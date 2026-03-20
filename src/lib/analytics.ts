// ============================================
// Meta Pixel + GTM dataLayer 통합 트래킹
// ============================================

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }
}

const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

const pushDataLayer = (event: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  }
};

// ============================================
// 이커머스 이벤트
// ============================================

interface ProductItem {
  product_key: string;
  product_name: string;
  price: number;
  quantity: number;
}

// 상품 조회 (스마트스토어 클릭)
export function trackViewProduct(product: ProductItem) {
  fbq("track", "ViewContent", {
    content_ids: [product.product_key],
    content_name: product.product_name,
    content_type: "product",
    value: product.price,
    currency: "KRW",
  });
  pushDataLayer("view_item", {
    currency: "KRW",
    value: product.price,
    items: [
      {
        item_id: product.product_key,
        item_name: product.product_name,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

// 장바구니 추가
export function trackAddToCart(product: ProductItem) {
  fbq("track", "AddToCart", {
    content_ids: [product.product_key],
    content_name: product.product_name,
    content_type: "product",
    value: product.price * product.quantity,
    currency: "KRW",
  });
  pushDataLayer("add_to_cart", {
    currency: "KRW",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.product_key,
        item_name: product.product_name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

// 결제 시작
export function trackInitiateCheckout(
  items: ProductItem[],
  totalValue: number,
) {
  fbq("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.product_key),
    contents: items.map((i) => ({ id: i.product_key, quantity: i.quantity })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: totalValue,
    currency: "KRW",
  });
  pushDataLayer("begin_checkout", {
    currency: "KRW",
    value: totalValue,
    items: items.map((item) => ({
      item_id: item.product_key,
      item_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// 구매 완료
export function trackPurchase(
  orderId: string,
  items: ProductItem[],
  totalValue: number,
) {
  fbq("track", "Purchase", {
    content_ids: items.map((i) => i.product_key),
    contents: items.map((i) => ({ id: i.product_key, quantity: i.quantity })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: totalValue,
    currency: "KRW",
  });
  pushDataLayer("purchase", {
    transaction_id: orderId,
    currency: "KRW",
    value: totalValue,
    items: items.map((item) => ({
      item_id: item.product_key,
      item_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// 리드 (이메일 구독)
export function trackLead(value?: number) {
  fbq("track", "Lead", { value, currency: "KRW" });
  pushDataLayer("generate_lead", { value, currency: "KRW" });
}

// ============================================
// 행동 추적 (이탈 분석용)
// ============================================

// 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
export function initScrollTracking() {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);

    thresholds.forEach((t) => {
      if (percent >= t && !fired.has(t)) {
        fired.add(t);
        pushDataLayer("scroll_depth", { scroll_percent: t });
        fbq("trackCustom", "ScrollDepth", { percent: t });
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// 체류 시간 추적 (30초, 60초, 120초, 300초)
export function initTimeTracking() {
  const milestones = [30, 60, 120, 300];
  const fired = new Set<number>();
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    milestones.forEach((m) => {
      if (elapsed >= m && !fired.has(m)) {
        fired.add(m);
        pushDataLayer("time_on_page", { seconds: m });
        fbq("trackCustom", "TimeOnPage", { seconds: m });
      }
    });
    if (fired.size === milestones.length) clearInterval(interval);
  }, 5000);

  return () => clearInterval(interval);
}

// 섹션별 조회 추적 (어디서 이탈하는지 파악)
export function trackSectionView(sectionName: string) {
  pushDataLayer("section_view", { section_name: sectionName });
  fbq("trackCustom", "SectionView", { section: sectionName });
}

// 외부 링크 클릭 (스마트스토어 이동)
export function trackOutboundClick(url: string, label: string) {
  pushDataLayer("outbound_click", { link_url: url, link_label: label });
  fbq("trackCustom", "OutboundClick", { url, label });
}
