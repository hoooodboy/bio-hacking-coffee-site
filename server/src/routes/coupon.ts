import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

// 사용자 쿠폰 목록 조회
router.get("/user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 쿠폰 발급 (회원가입 시 호출)
router.post("/issue", async (req: Request, res: Response) => {
  const { userId, couponType } = req.body;

  if (!userId || !couponType) {
    res.status(400).json({ error: "userId and couponType required" });
    return;
  }

  try {
    // 쿠폰 타입별 설정
    const couponConfig: Record<string, { name: string; discount: number; minOrder: number; expiryDays: number }> = {
      welcome: { name: "신규가입 축하 쿠폰", discount: 3000, minOrder: 0, expiryDays: 30 },
      first_purchase: { name: "첫 구매 감사 쿠폰", discount: 5000, minOrder: 30000, expiryDays: 14 },
    };

    const config = couponConfig[couponType];
    if (!config) {
      res.status(400).json({ error: "Invalid coupon type" });
      return;
    }

    // 이미 같은 타입 쿠폰이 있는지 확인
    const { data: existing } = await supabase
      .from("user_coupons")
      .select("id")
      .eq("user_id", userId)
      .eq("coupon_type", couponType)
      .single();

    if (existing) {
      res.status(400).json({ error: "Coupon already issued" });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.expiryDays);

    const { data, error } = await supabase
      .from("user_coupons")
      .insert({
        user_id: userId,
        coupon_type: couponType,
        name: config.name,
        discount_amount: config.discount,
        min_order_amount: config.minOrder,
        expires_at: expiresAt.toISOString(),
        is_used: false,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 쿠폰 사용 (결제 완료 시 호출)
router.post("/use", async (req: Request, res: Response) => {
  const { couponId, orderId } = req.body;

  if (!couponId || !orderId) {
    res.status(400).json({ error: "couponId and orderId required" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("user_coupons")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_order_id: orderId,
      })
      .eq("id", couponId)
      .eq("is_used", false)
      .select()
      .single();

    if (error || !data) {
      res.status(400).json({ error: "Coupon not found or already used" });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 쿠폰 유효성 검증
router.post("/validate", async (req: Request, res: Response) => {
  const { couponId, userId, orderAmount } = req.body;

  if (!couponId || !userId) {
    res.status(400).json({ error: "couponId and userId required" });
    return;
  }

  try {
    const { data: coupon, error } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("id", couponId)
      .eq("user_id", userId)
      .single();

    if (error || !coupon) {
      res.json({ valid: false, reason: "쿠폰을 찾을 수 없습니다." });
      return;
    }

    if (coupon.is_used) {
      res.json({ valid: false, reason: "이미 사용된 쿠폰입니다." });
      return;
    }

    if (new Date(coupon.expires_at) < new Date()) {
      res.json({ valid: false, reason: "만료된 쿠폰입니다." });
      return;
    }

    if (orderAmount && orderAmount < coupon.min_order_amount) {
      res.json({ 
        valid: false, 
        reason: `최소 주문금액 ${coupon.min_order_amount.toLocaleString()}원 이상 주문 시 사용 가능합니다.` 
      });
      return;
    }

    res.json({ valid: true, coupon });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as couponRouter };
