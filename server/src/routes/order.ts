import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

// 주문 목록 조회 (전체 or 유저별)
router.get("/", async (req: Request, res: Response) => {
  const { user_id, phone } = req.query;

  try {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (user_id) {
      query = query.eq("user_id", user_id);
    }
    if (phone) {
      query = query.eq("customer_phone", phone);
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 주문 상세 조회
router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 주문 상태 업데이트 (배송 상태 등)
router.patch("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("order_id", orderId)
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

// 배송 정보 저장 (POST)
router.post("/:orderId/shipping", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { name, phone, address, address_detail, zip_code, memo } = req.body;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        shipping_name: name,
        shipping_phone: phone,
        shipping_address: address,
        shipping_address_detail: address_detail,
        shipping_zip_code: zip_code,
        shipping_memo: memo,
      })
      .eq("order_id", orderId)
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

// 배송 정보 저장 (PUT - 프론트 호환)
router.put("/:orderId/shipping", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { name, phone, address, address_detail, zip_code, memo } = req.body;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        shipping_name: name,
        shipping_phone: phone,
        shipping_address: address,
        shipping_address_detail: address_detail,
        shipping_zip_code: zip_code,
        shipping_memo: memo,
      })
      .eq("order_id", orderId)
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

export { router as orderRouter };
