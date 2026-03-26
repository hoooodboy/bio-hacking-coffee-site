import { Router, Request, Response } from "express";
import { supabase } from "../supabase";
import { sendPurchaseEvent } from "../meta-capi";

const router = Router();

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "live_sk_Z1aOwX7K8m1AZNJmg7aB8yQxzvNP";

// 결제 승인
router.post("/confirm", async (req: Request, res: Response) => {
  const { paymentKey, orderId, amount, userId, cart } = req.body;

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

    // 결제 승인 성공 → DB에 주문 저장 (cart 정보 포함)
    const { error } = await supabase.from("orders").insert({
      order_id: orderId,
      payment_key: paymentKey,
      amount,
      user_id: userId || null, // 로그인한 사용자의 ID 연동
      status: "DONE",
      method: tossData.method || "카드",
      order_name: tossData.orderName || "",
      customer_name: tossData.customerName || "",
      customer_phone: tossData.customerMobilePhone || "",
      customer_email: tossData.customerEmail || "",
      approved_at: tossData.approvedAt || new Date().toISOString(),
      order_items: cart || null, // 상품 옵션 정보 (맛 선택 등)
      raw_data: tossData,
    });

    if (error) {
      console.error("DB insert error:", error);
      // DB 저장 실패해도 결제는 성공이므로 200 반환
    }

    // 재고 차감 (cart 정보 기반)
    if (cart && Array.isArray(cart) && cart.length > 0) {
      const deductItems = cart.map((item: { key: string; qty: number; option?: string }) => {
        // 체험 키트의 경우 trial-{option} 형태로 저장
        const productKey = item.option ? `trial-${item.option}` : item.key;
        return { productKey, quantity: item.qty };
      });
      
      // 재고 차감 요청 (내부 호출)
      try {
        for (const item of deductItems) {
          const { data: current } = await supabase
            .from("inventory")
            .select("stock")
            .eq("product_key", item.productKey)
            .single();
          
          if (current) {
            await supabase
              .from("inventory")
              .update({
                stock: current.stock - item.quantity,
                updated_at: new Date().toISOString(),
              })
              .eq("product_key", item.productKey);
          }
        }
      } catch (deductError) {
        console.error("Inventory deduct error:", deductError);
        // 재고 차감 실패해도 결제는 성공이므로 계속 진행
      }
    }

    // Meta Conversions API — 서버 사이드 Purchase 이벤트
    sendPurchaseEvent({
      orderId,
      amount,
      orderName: tossData.orderName || "",
      userData: {
        email: tossData.customerEmail || "",
        phone: tossData.customerMobilePhone || "",
        name: tossData.customerName || "",
        ip: req.ip || req.headers["x-forwarded-for"]?.toString() || "",
        userAgent: req.headers["user-agent"] || "",
        fbc: (req.body.fbc as string) || "",
        fbp: (req.body.fbp as string) || "",
      },
    }).catch((e) => console.error("Meta CAPI failed:", e));

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
