import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "live_sk_0RnYX2w532Eppz7YXD4P8NeyqApQ";

// 결제 승인
router.post("/confirm", async (req: Request, res: Response) => {
  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    res.status(400).json({ error: "Missing required fields: paymentKey, orderId, amount" });
    return;
  }

  try {
    const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

    // 토스 결제 승인 API 호출
    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const tossData = (await tossRes.json()) as Record<string, any>;

    if (!tossRes.ok) {
      res.status(tossRes.status).json(tossData);
      return;
    }

    // 결제 승인 성공 → DB에 주문 저장
    const { error } = await supabase.from("orders").insert({
      order_id: orderId,
      payment_key: paymentKey,
      amount,
      status: "DONE",
      method: tossData.method || "카드",
      order_name: tossData.orderName || "",
      customer_name: tossData.customerName || "",
      customer_phone: tossData.customerMobilePhone || "",
      customer_email: tossData.customerEmail || "",
      approved_at: tossData.approvedAt || new Date().toISOString(),
      raw_data: tossData,
    });

    if (error) {
      console.error("DB insert error:", error);
      // DB 저장 실패해도 결제는 성공이므로 200 반환
    }

    res.status(200).json(tossData);
  } catch (error) {
    console.error("Payment confirm error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 결제 조회 (by orderId)
router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

    const tossRes = await fetch(`https://api.tosspayments.com/v1/payments/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    });

    const data = (await tossRes.json()) as Record<string, any>;
    res.status(tossRes.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as paymentRouter };
