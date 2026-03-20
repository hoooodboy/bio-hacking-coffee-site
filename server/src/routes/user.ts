import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

// 유저 프로필 조회
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 유저 프로필 업데이트 (이름, 전화번호, 주소 등)
router.patch("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
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

// 유저의 주문 내역
router.get("/:userId/orders", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as userRouter };
