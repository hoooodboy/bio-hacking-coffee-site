import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

// 전체 재고 조회
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("product_key");

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 특정 상품 재고 조회
router.get("/:productKey", async (req: Request, res: Response) => {
  const { productKey } = req.params;

  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_key", productKey)
      .single();

    if (error) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const available = data.stock - data.reserved;
    res.json({ ...data, available });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 재고 차감 (결제 완료 시 호출)
router.post("/deduct", async (req: Request, res: Response) => {
  const { items } = req.body; // [{ productKey: string, quantity: number }]

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "items array required" });
    return;
  }

  try {
    const results = [];

    for (const item of items) {
      const { productKey, quantity } = item;

      // 현재 재고 확인
      const { data: current, error: fetchError } = await supabase
        .from("inventory")
        .select("stock, reserved")
        .eq("product_key", productKey)
        .single();

      if (fetchError || !current) {
        results.push({ productKey, success: false, error: "Product not found" });
        continue;
      }

      const available = current.stock - current.reserved;
      if (available < quantity) {
        results.push({ productKey, success: false, error: "Insufficient stock", available });
        continue;
      }

      // 재고 차감
      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          stock: current.stock - quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("product_key", productKey);

      if (updateError) {
        results.push({ productKey, success: false, error: updateError.message });
      } else {
        results.push({ productKey, success: true, newStock: current.stock - quantity });
      }
    }

    const allSuccess = results.every((r) => r.success);
    res.status(allSuccess ? 200 : 207).json({ results });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 재고 업데이트 (관리자용)
router.patch("/:productKey", async (req: Request, res: Response) => {
  const { productKey } = req.params;
  const { stock, reserved } = req.body;

  try {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof stock === "number") updates.stock = stock;
    if (typeof reserved === "number") updates.reserved = reserved;

    const { data, error } = await supabase
      .from("inventory")
      .update(updates)
      .eq("product_key", productKey)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as inventoryRouter };
