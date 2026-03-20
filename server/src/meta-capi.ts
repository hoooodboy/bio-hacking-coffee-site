// Meta Conversions API (서버 사이드 이벤트)
import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "1241903357615189";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ||
  "EAAYSB51P9sUBQZB5Li5vxaBDBATx0m3RbXRS85KU8fCFNZCIu0wgd2ConGgcWZCMqr3qv6uMF2XUinZAV4rvOpcIywRYdZCgTMGySFu46W02NKTcsJyEhVZCBZCynTahS32FOK0pFBvqo701iMIKAzLo6cftkG6gbHbT5k7lNPJe4HbZArS9xMRR0YliZBZBqu3QZDZD";

const API_VERSION = "v21.0";
const ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

function hashData(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface UserData {
  email?: string;
  phone?: string;
  name?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}

interface PurchaseData {
  orderId: string;
  amount: number;
  currency?: string;
  orderName?: string;
  userData: UserData;
}

export async function sendPurchaseEvent(data: PurchaseData) {
  const userData: Record<string, any> = {};

  if (data.userData.email) userData.em = [hashData(data.userData.email)];
  if (data.userData.phone) userData.ph = [hashData(data.userData.phone.replace(/[-\s]/g, ""))];
  if (data.userData.name) userData.fn = [hashData(data.userData.name)];
  if (data.userData.ip) userData.client_ip_address = data.userData.ip;
  if (data.userData.userAgent) userData.client_user_agent = data.userData.userAgent;
  if (data.userData.fbc) userData.fbc = data.userData.fbc;
  if (data.userData.fbp) userData.fbp = data.userData.fbp;

  const eventData = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://www.thezone.bio",
        event_id: data.orderId,
        user_data: userData,
        custom_data: {
          currency: data.currency || "KRW",
          value: data.amount,
          order_id: data.orderId,
          content_name: data.orderName || "",
          content_type: "product",
        },
      },
    ],
  };

  try {
    const response = await fetch(`${ENDPOINT}?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const result = (await response.json()) as Record<string, any>;

    if (!response.ok) {
      console.error("Meta CAPI error:", result);
    } else {
      console.log("Meta CAPI Purchase sent:", data.orderId);
    }

    return result;
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
    return null;
  }
}
