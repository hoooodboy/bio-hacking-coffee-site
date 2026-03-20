// ============================================
// Google Analytics 4 + Meta Pixel 트래킹
// ============================================

// GA4 Measurement ID (TODO: 실제 ID로 교체)
export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID || 'G-XXXXXXXXXX'

// Meta Pixel ID (TODO: 실제 ID로 교체)
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || 'XXXXXXXXXXXXXXXX'

// ============================================
// GA4 이벤트 트래킹
// ============================================

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

// GA4 이벤트 전송
export function trackGA4Event(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// GA4 페이지뷰
export function trackGA4PageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
}

// ============================================
// Meta Pixel 이벤트 트래킹
// ============================================

// Meta Pixel 이벤트 전송
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Meta Pixel 커스텀 이벤트
export function trackMetaCustomEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}

// ============================================
// 이커머스 이벤트 (GA4 + Meta 동시 트래킹)
// ============================================

interface ProductItem {
  product_key: string
  product_name: string
  price: number
  quantity: number
}

// 상품 조회 (ViewContent)
export function trackViewProduct(product: ProductItem) {
  // GA4
  trackGA4Event('view_item', {
    currency: 'KRW',
    value: product.price,
    items: [{
      item_id: product.product_key,
      item_name: product.product_name,
      price: product.price,
      quantity: 1
    }]
  })

  // Meta Pixel
  trackMetaEvent('ViewContent', {
    content_ids: [product.product_key],
    content_name: product.product_name,
    content_type: 'product',
    value: product.price,
    currency: 'KRW'
  })
}

// 장바구니 추가 (AddToCart)
export function trackAddToCart(product: ProductItem) {
  // GA4
  trackGA4Event('add_to_cart', {
    currency: 'KRW',
    value: product.price * product.quantity,
    items: [{
      item_id: product.product_key,
      item_name: product.product_name,
      price: product.price,
      quantity: product.quantity
    }]
  })

  // Meta Pixel
  trackMetaEvent('AddToCart', {
    content_ids: [product.product_key],
    content_name: product.product_name,
    content_type: 'product',
    value: product.price * product.quantity,
    currency: 'KRW'
  })
}

// 결제 시작 (InitiateCheckout)
export function trackInitiateCheckout(items: ProductItem[], totalValue: number) {
  // GA4
  trackGA4Event('begin_checkout', {
    currency: 'KRW',
    value: totalValue,
    items: items.map(item => ({
      item_id: item.product_key,
      item_name: item.product_name,
      price: item.price,
      quantity: item.quantity
    }))
  })

  // Meta Pixel
  trackMetaEvent('InitiateCheckout', {
    content_ids: items.map(i => i.product_key),
    contents: items.map(i => ({
      id: i.product_key,
      quantity: i.quantity
    })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: totalValue,
    currency: 'KRW'
  })
}

// 결제 완료 (Purchase)
export function trackPurchase(
  orderId: string,
  items: ProductItem[],
  totalValue: number
) {
  // GA4
  trackGA4Event('purchase', {
    transaction_id: orderId,
    currency: 'KRW',
    value: totalValue,
    items: items.map(item => ({
      item_id: item.product_key,
      item_name: item.product_name,
      price: item.price,
      quantity: item.quantity
    }))
  })

  // Meta Pixel
  trackMetaEvent('Purchase', {
    content_ids: items.map(i => i.product_key),
    contents: items.map(i => ({
      id: i.product_key,
      quantity: i.quantity
    })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: totalValue,
    currency: 'KRW'
  })
}

// 리드 생성 (Lead) - 무료체험 신청 등
export function trackLead(value?: number) {
  trackGA4Event('generate_lead', { value, currency: 'KRW' })
  trackMetaEvent('Lead', { value, currency: 'KRW' })
}
