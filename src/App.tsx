import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { useEffect, useRef, useState, useCallback } from "react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ─── Scroll reveal hook ─── */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Use default root (viewport) — works for both page scroll and
    // fixed bottom-sheet since the sheet is position:fixed filling the viewport
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const revealUp = (visible: boolean, delay = 0) => css`
  opacity: ${visible ? 1 : 0};
  transform: translateY(${visible ? 0 : 60}px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s;
`;

const revealLeft = (visible: boolean, delay = 0) => css`
  opacity: ${visible ? 1 : 0};
  transform: translateX(${visible ? 0 : -40}px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s;
`;

const revealRight = (visible: boolean, delay = 0) => css`
  opacity: ${visible ? 1 : 0};
  transform: translateX(${visible ? 0 : 40}px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s;
`;

/* ─── Hero Section ─── */

const HeroFixed = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  height: 100dvh;
  z-index: 0;
  background: #000;
  color: #fff;
  font-family: "Helvetica Neue", "Arial", "Pretendard", sans-serif;
`;

const HeroBlackout = styled.div<{ opacity: number }>`
  position: absolute;
  inset: 0;
  background: #000;
  opacity: ${({ opacity }) => opacity};
  z-index: 2;
  pointer-events: none;
`;

const HeroVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  background-position: top;
`;

const HeroOverlay = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 28px 24px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: ${fadeIn} 0.8s ease-out;
`;

const TopLeft = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.3;
  text-transform: uppercase;
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const TopRight = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.3;
  text-transform: uppercase;
  text-align: right;
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const FounderText = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.5px;
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const FocusText = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 28px;
  font-weight: 400;
  text-align: right;
  line-height: 0.8;
  em {
    font-style: italic;
  }
  @media (min-width: 768px) {
    font-size: 34px;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 80px;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`;

const HeroLogo = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  object-fit: contain;
`;

const MainTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: 2px;
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const SubText = styled.div`
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  opacity: 0.85;
  letter-spacing: 0.5px;
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`;

const Arrow = styled.div`
  margin-top: 20px;
  font-size: 20px;
  animation: ${bounce} 1.5s ease-in-out infinite;
  cursor: pointer;
`;

const FooterText = styled.div`
  position: absolute;
  bottom: 16px;
  left: 24px;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 0.6;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ─── Bottom Sheet Modal ─── */

const PEEK_HEIGHT = 48; // px visible at bottom in idle state

const BottomSheet = styled.div<{ bottomOffset: number; expanded: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  z-index: 3;
  height: 100dvh;
  bottom: ${({ bottomOffset }) => `${bottomOffset}px`};
  ${({ expanded }) =>
    expanded &&
    `transition: bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s cubic-bezier(0.32, 0.72, 0, 1);`}
  border-radius: ${({ expanded }) => (expanded ? "0" : "20px 20px 0 0")};
  overflow: hidden;
  will-change: bottom, border-radius;
  pointer-events: ${({ expanded }) => (expanded ? "auto" : "none")};
`;

const SheetHandle = styled.div<{ expanded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
  opacity: ${({ expanded }) => (expanded ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const HandleBar = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
`;

const SheetVideo = styled.video<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(${({ scale }) => scale});
  will-change: transform;
  filter: brightness(0.8);
`;

/* ─── Text over video (scrollable after expand) ─── */

const ScrollableContent = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100dvh;
`;

const TextContent = styled.div<{ show: boolean }>`
  color: #fff;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: translateY(${({ show }) => (show ? 0 : 40)}px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
`;

const OverlayBlock = styled.div`
  padding: 48px 24px;
`;

const HeadingNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const NavLabel = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.4;
  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const BigHeading = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.15;
  margin: 0;
  em {
    font-style: italic;
  }
  @media (min-width: 768px) {
    font-size: 54px;
  }
`;

const LabelSmall = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 8px;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const TitleLarge = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.2;
  @media (min-width: 768px) {
    font-size: 46px;
  }
`;

const BodyText = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  opacity: 0.85;
  margin-top: 10px;
  max-width: 220px;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 17px;
    max-width: 320px;
  }
`;

/* Free-form canvas for scattered text blocks */
const FreeCanvas = styled.div`
  position: relative;
  overflow: hidden;
`;

const StickyBlock = styled.div<{
  align?: string;
  padLeft?: string;
  padRight?: string;
  rotate?: string;
}>`
  position: sticky;
  top: 20dvh;
  padding: 16dvh 24px 20dvh;
  ${({ align }) => align === "right" && `text-align: right;`}
  ${({ padLeft }) => padLeft && `padding-left: ${padLeft};`}
  ${({ padRight }) => padRight && `padding-right: ${padRight};`}
  ${({ rotate }) => rotate && `transform: rotate(${rotate});`}
`;

const WatermarkText = styled.div<{ size?: number }>`
  font-family: "Roboto Mono", monospace;
  font-size: ${({ size }) => size || 100}px;
  font-weight: 500;
  line-height: 0.85;
  letter-spacing: -4px;
  opacity: 0.1;
  text-transform: uppercase;
  white-space: nowrap;
`;

const DetailTitle = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.25;
  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const DetailBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
  opacity: 0.85;
  margin-top: 10px;
  max-width: 200px;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 17px;
    max-width: 300px;
  }
`;

const revealScale = (visible: boolean, delay = 0) => css`
  opacity: ${visible ? 1 : 0};
  transform: scale(${visible ? 1 : 0.85});
  transition:
    opacity 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
    transform 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s;
`;

/* ─── Sub-page Sections (matching 하위페이지.png) ─── */

const SubPageWrap = styled.div`
  position: relative;
  z-index: 5;
  background: #000;
`;

const GrainCanvas = styled.canvas`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  pointer-events: none;
  z-index: 0;
  margin-bottom: -100dvh;
`;

const SubPageContent = styled.div`
  position: relative;
  z-index: 1;
  transform: translateZ(0);
  will-change: transform;
`;

/* ── Shared sub-page styles ── */
const SecTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 32px;
  font-weight: 400;
  color: #fff;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 40px;
  }
`;

const SecSub = styled.p`
  font-family: "Instrument Serif", serif;
  font-size: 22px;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.35;
  margin: 4px 0 0;
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const ItemName = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 17px;
  }
`;

const PriceRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
`;

const PriceOrigRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OrigPrice = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: line-through;
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const SalePrice = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const DiscountBadge = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #e8743a;
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ItemSub = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

/* ── Section 1: Event (wide banner + 2-col grid) ── */
const EventSection = styled.section`
  background: transparent;
  padding: 72px 24px 56px;
`;

const EventBanner = styled.div`
  display: flex;
  gap: 0;
  border-radius: 0;
  overflow: hidden;
  margin-top: 40px;
  margin-bottom: 12px;
`;

const BannerImg = styled.div`
  flex: 1;
  aspect-ratio: 1;
  background: #1a1a1a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px;
  gap: 12px;
`;

const BannerTitle = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 26px;
  font-weight: 400;
  color: #fff;
  line-height: 1.2;
  em {
    font-style: italic;
  }
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const BannerDesc = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const BannerBtn = styled.div`
  display: inline-block;
  align-self: flex-start;
  padding: 8px 20px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 10px 28px;
  }
`;

const BannerNote = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GridImgBox = styled.div<{ bg: string }>`
  width: 100%;
  aspect-ratio: 4 / 5;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateZ(0);
`;

const GridLabel = styled.div`
  padding-top: 12px;
`;

/* ── Section 2: Flavors ── */
const FlavorSection = styled.section`
  background: transparent;
  padding: 72px 24px 56px;
`;

const FlavorWide = styled.div`
  margin-top: 28px;
`;

const FlavorWideImg = styled.div<{ bg: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transform: translateZ(0);
`;

/* ── Section 3: In Good Company ── */
const CompanySection = styled.section`
  background: transparent;
  padding: 72px 24px 60px;
`;

const CompanyTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 56px;
  font-weight: 400;
  color: #fff;
  line-height: 1;
  margin: 0 0 24px;
  em {
    font-style: italic;
  }
  @media (min-width: 768px) {
    font-size: 72px;
  }
`;

const CompanyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 8px;
  margin-bottom: 32px;
`;

const GBox = styled.div<{ bg?: string; span?: number; h?: number }>`
  background: ${({ bg }) => bg || "#f0ece6"};
  border-radius: 8px;
  height: ${({ h }) => h || 100}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ span }) => span && `grid-column: span ${span};`}
  @media (min-width: 768px) {
    height: ${({ h }) => (h ? h * 1.8 : 180)}px;
  }
  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CompanyBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin: 0 0 28px;
  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const MetaLine = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

/* ── Section 4: Leave No Trace ── */
const TraceSection = styled.section`
  background: transparent;
  padding: 80px 24px;
  text-align: center;
`;

const TraceTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 48px;
  font-weight: 400;
  color: #fff;
  line-height: 1.1;
  margin: 0 auto 12px;
  @media (min-width: 768px) {
    font-size: 62px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const TraceBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  max-width: 300px;
  margin: 16px auto 0;
  @media (min-width: 768px) {
    font-size: 16px;
    max-width: 450px;
  }
`;

/* ── CTA Banner ── */
const CtaBanner = styled.section`
  padding: 48px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const CtaCard = styled.div`
  display: flex;
  border-radius: 0;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(232, 116, 58, 0.12) 0%,
    rgba(232, 116, 58, 0.04) 100%
  );
  border: 1px solid rgba(232, 116, 58, 0.15);
`;

const CtaImg = styled.div`
  flex: 0 0 40%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 480px) {
    flex: 0 0 35%;
  }
`;

const CtaInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px;
  gap: 14px;
`;

const CtaLabel = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #e8743a;
  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const CtaText = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  strong {
    color: #fff;
    font-weight: 600;
  }
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const CtaButton = styled.button`
  display: inline-block;
  align-self: flex-start;
  padding: 12px 32px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.5px;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  @media (min-width: 768px) {
    font-size: 16px;
    padding: 14px 40px;
  }
`;

const CtaNote = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
`;

/* ── Section 5: Footer ── */
const FooterSection = styled.footer`
  background: transparent;
  padding: 56px 24px 60px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const FtLabel = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 4px;
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const FtBrand = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 8px;
  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const FtLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 28px;
  opacity: 0.8;
`;

const FtRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const FtInput = styled.div`
  flex: 1;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const FtBtn = styled.div`
  height: 40px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const FtLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const FtLink = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const marqueeScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const FtMarqueeWrap = styled.div`
  overflow: hidden;
  margin: 32px -24px 16px;
`;

const FtMarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${marqueeScroll} 40s linear infinite;
`;

const FtWatermark = styled.span`
  font-family: "Instrument Serif", serif;
  font-size: 80px;
  @media (min-width: 768px) {
    font-size: 120px;
  }
  font-style: italic;
  color: rgba(255, 255, 255, 0.08);
  line-height: 0.9;
  white-space: nowrap;
  padding-right: 40px;
`;

const FtCopy = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const FtBizInfo = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 10px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
  margin-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 20px;
  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const FtPolicyLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const FtPolicyLink = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  &:hover {
    color: #fff;
  }
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const FtSocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const FtSocialLink = styled.a`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  &:hover {
    color: #fff;
  }
  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

/* ── Policy Modal ── */
const PolicyOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  height: 100dvh;
  z-index: 300;
  background: #111;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PolicyClose = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 301;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 1px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  @media (min-width: 780px) {
    right: calc(50% - 390px + 16px);
  }
`;

const PolicyContent = styled.div`
  padding: 60px 24px 80px;
  color: rgba(255, 255, 255, 0.8);
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  line-height: 1.9;
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 32px;
  }
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 28px 0 12px;
  }
  p {
    margin: 0 0 12px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
    h1 {
      font-size: 30px;
    }
    h2 {
      font-size: 18px;
    }
  }
`;

/* ─── Intro Overlay (iOS video activation) ─── */

const introFadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; pointer-events: none; }
`;

const introPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const IntroOverlay = styled.div<{ hiding: boolean }>`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  height: 100dvh;
  z-index: 100;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
  ${({ hiding }) =>
    hiding &&
    css`
      animation: ${introFadeOut} 0.6s ease-out forwards;
    `}
`;

const IntroLogo = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  opacity: 0.9;
`;

const IntroText = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  animation: ${introPulse} 2s ease-in-out infinite;
`;

/* ─── Product Detail Modal ─── */

const PRODUCTS = {
  signature: {
    name: "Signature",
    sub: "디카페인",
    image: "/decaf.png",
    bg: "#4a1a1a",
    price: "39,000원",
    origPrice: "70,000원",
    discount: "44%",
    specs: [
      {
        label: "PRODUCT FLAVOR",
        value:
          "노루궁뎅이 버섯의 깊은 풍미와 스페셜티 디카페인 원두의 부드러운 밸런스. 카페인 없이도 흔들리지 않는 집중.",
      },
      {
        label: "INFO",
        value:
          "100% 천연 · 디카페인 · 노루궁뎅이 버섯 추출물 · 인공 첨가물 無 · 콜드브루 추출",
      },
      {
        label: "PRODUCTION",
        value:
          "24시간 저온 추출 콜드브루 공법. 스위스 워터 프로세스로 카페인만 제거, 풍미는 온전히.",
      },
      {
        label: "INGREDIENTS",
        value: "정제수, 디카페인 커피 추출액, 노루궁뎅이 버섯 추출물",
      },
      {
        label: "THE RESULT",
        value:
          "밤에도, 언제든. 카페인 없이 인지 기능을 깨우는 커피. 잠을 방해하지 않으면서 뇌는 계속 작동합니다.",
      },
    ],
  },
  house: {
    name: "House",
    sub: "카페인",
    image: "/caffeine.png",
    bg: "#1a3a5c",
    price: "36,000원",
    origPrice: "60,000원",
    discount: "40%",
    specs: [
      {
        label: "PRODUCT FLAVOR",
        value:
          "스페셜티 원두의 깔끔한 첫 맛, 노루궁뎅이 버섯이 더하는 깊은 여운. 일반 커피에서는 느낄 수 없는 레이어.",
      },
      {
        label: "INFO",
        value:
          "100% 천연 · 카페인 함유 · 노루궁뎅이 버섯 추출물 · 인공 첨가물 無 · 콜드브루 추출",
      },
      {
        label: "PRODUCTION",
        value:
          "24시간 저온 추출 콜드브루 공법. 에티오피아 싱글 오리진 스페셜티 원두의 잠재력을 온전히 추출.",
      },
      {
        label: "INGREDIENTS",
        value: "정제수, 커피 추출액, 노루궁뎅이 버섯 추출물",
      },
      {
        label: "THE RESULT",
        value:
          "크래시 없는 에너지, 선명한 집중력. 일반 커피가 주지 못한 '그 다음 단계'의 각성.",
      },
    ],
  },
  vibrant: {
    name: "Vibrant",
    sub: "산미",
    image: "/acidity.png",
    bg: "#3a2010",
    price: "42,000원",
    origPrice: "80,000원",
    discount: "47%",
    specs: [
      {
        label: "PRODUCT FLAVOR",
        value:
          "밝은 산미와 과일 향이 감각을 깨우는 프리미엄 블렌드. 노루궁뎅이 버섯이 완성하는 예상 밖의 깊이.",
      },
      {
        label: "INFO",
        value:
          "100% 천연 · 카페인 함유 · 노루궁뎅이 버섯 추출물 · 인공 첨가물 無 · 콜드브루 추출",
      },
      {
        label: "PRODUCTION",
        value:
          "24시간 저온 추출 콜드브루 공법. 케냐 AA 스페셜티 원두가 만드는 정제된 산미.",
      },
      {
        label: "INGREDIENTS",
        value: "정제수, 커피 추출액, 노루궁뎅이 버섯 추출물",
      },
      {
        label: "THE RESULT",
        value:
          "생동감 넘치는 산미, 깨끗한 피니시. 감각이 열리는 순간, 당신의 하루가 달라집니다.",
      },
    ],
  },
  trial: {
    name: "100ml 무료 체험",
    sub: "이벤트",
    image: "/event-hero.png",
    bg: "#1a1a1a",
    price: "0원",
    origPrice: "0원",
    discount: "",
    specs: [],
  },
} as const;

type ProductKey = keyof typeof PRODUCTS;

const pdFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pdSlideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PDOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  height: 100dvh;
  z-index: 200;
  background: #f5f0ea;
  animation: ${pdFadeIn} 0.3s ease-out;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const PDLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const PDInfoPanel = styled.div`
  padding: 32px 24px 48px;
  animation: ${pdSlideUp} 0.5s ease-out;
`;

const PDImagePanel = styled.div<{ bg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bg }) => bg};
  animation: ${pdFadeIn} 0.5s ease-out 0.1s both;
  overflow: hidden;
  aspect-ratio: 1;
`;

const PDProductImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
`;

const PDClose = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 201;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const PDName = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 40px;
  font-weight: 400;
  color: #111;
  margin: 0;
  line-height: 1.1;
  @media (min-width: 768px) {
    font-size: 48px;
  }
`;

const PDSub = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  margin-top: 4px;
  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const PDBuyBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 24px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 40px;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  @media (min-width: 768px) {
    font-size: 13px;
    padding: 14px 28px;
  }
`;

const PDPriceArea = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PDPriceOrigRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PDOrigPrice = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  color: #999;
  text-decoration: line-through;
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const PDSalePrice = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #111;
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const PDDiscount = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #e8743a;
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const PDSpecsTable = styled.div`
  margin-top: 40px;
`;

const PDSpecRow = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  &:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
`;

const PDSpecLabel = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #111;
  min-width: 90px;
  flex-shrink: 0;
  @media (min-width: 768px) {
    font-size: 10px;
    min-width: 110px;
  }
`;

const PDSpecValue = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #111;
  line-height: 1.6;
  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

/* ─── Quantity Selector ─── */

const PDQtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  background: transparent;
  font-size: 16px;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const QtyNum = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  min-width: 24px;
  text-align: center;
`;

/* ─── Floating Cart ─── */

const cartPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }
  50% { box-shadow: 0 4px 20px rgba(232, 116, 58, 0.6), 0 0 0 8px rgba(232, 116, 58, 0.15); }
`;

const CartFab = styled.button<{ hasItems?: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 190;
  @media (min-width: 780px) {
    right: calc(50% - 390px + 24px);
  }
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #111;
  color: #fff;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  ${({ hasItems }) =>
    hasItems &&
    css`
      animation: ${cartPulse} 2s ease-in-out infinite;
    `}
  &:hover {
    background: #222;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #e8743a;
  color: #fff;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
`;

const CartFloat = styled.div`
  position: fixed;
  bottom: 92px;
  right: 24px;
  z-index: 189;
  background: #111;
  color: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  min-width: 280px;
  max-width: 340px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  animation: ${pdSlideUp} 0.3s ease-out;
  @media (min-width: 780px) {
    right: calc(50% - 390px + 24px);
  }
  @media (max-width: 767px) {
    left: 16px;
    right: 16px;
    bottom: 88px;
    max-width: none;
  }
`;

const CartTitle = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
`;

const CartItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const CartItemName = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
`;

const CartItemPrice = styled.span`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
`;

const CartItemQty = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartQtyBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: transparent;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartRemoveBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: #e8743a;
  }
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
`;

const CartCheckoutBtn = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  background: #e8743a;
  color: #fff;
  border: none;
  border-radius: 40px;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
`;

/* ─── Checkout Modal ─── */

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (
        method: string,
        options: {
          amount: number;
          orderId: string;
          orderName: string;
          customerName: string;
          successUrl: string;
          failUrl: string;
        },
      ) => Promise<void>;
    };
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
      }) => { open: () => void };
    };
  }
}

const CheckoutOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 780px;
  height: 100dvh;
  z-index: 210;
  background: #0a0a0a;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: ${pdFadeIn} 0.3s ease-out;
  color: #fff;
`;

const CheckoutLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const CheckoutPreview = styled.div`
  padding: 40px 24px;
  background: #111;
`;

const CheckoutPreviewTitle = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 28px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 32px;
  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const CheckoutProductCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  align-items: center;
`;

const CheckoutProductThumb = styled.div<{ bg: string }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: ${({ bg }) => bg};
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 100%;
    width: auto;
    object-fit: cover;
  }
`;

const CheckoutProductInfo = styled.div`
  flex: 1;
`;

const CheckoutProductName = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const CheckoutProductSub = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
`;

const CheckoutProductPrice = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
  white-space: nowrap;
`;

const CheckoutTotalBlock = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const CheckoutTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  padding: 4px 0;
`;

const CheckoutGrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-top: 12px;
  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const CheckoutFormPanel = styled.div`
  padding: 40px 24px 80px;
`;

const CheckoutFormTitle = styled.h3`
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0 24px;
`;

const CheckoutSection = styled.div`
  margin-bottom: 20px;
`;

const CheckoutLabel = styled.label`
  display: block;
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 6px;
`;

const CheckoutInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #e8743a;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const CheckoutInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckoutAddrBtn = styled.button`
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const CheckoutPayBtn = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background: #e8743a;
  color: #fff;
  border: none;
  border-radius: 40px;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #d4632e;
  }
`;

const CheckoutClose = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 211;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 20px;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

/* ─── App ─── */

function App() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const [heroFade, setHeroFade] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [videoScale, setVideoScale] = useState(1);
  const [sheetBottom, setSheetBottom] = useState(
    -(window.innerHeight - PEEK_HEIGHT),
  );
  const [introVisible, setIntroVisible] = useState(true);
  const [introHiding, setIntroHiding] = useState(false);
  // URL-based routing helpers
  const getInitialRoute = () => {
    const path = window.location.pathname;
    if (path.startsWith("/product/")) {
      const key = path.replace("/product/", "") as ProductKey;
      if (key in PRODUCTS)
        return {
          product: key,
          checkout: false,
          policy: null as "refund" | "terms" | null,
        };
    }
    if (path === "/checkout")
      return {
        product: null,
        checkout: true,
        policy: null as "refund" | "terms" | null,
      };
    if (path === "/refund")
      return { product: null, checkout: false, policy: "refund" as const };
    if (path === "/terms")
      return { product: null, checkout: false, policy: "terms" as const };
    return { product: null, checkout: false, policy: null };
  };

  const initialRoute = getInitialRoute();
  const [activeProduct, setActiveProductRaw] = useState<ProductKey | null>(
    initialRoute.product,
  );
  const [pdQty, setPdQty] = useState(1);
  const [cart, setCart] = useState<{ key: ProductKey; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckoutRaw] = useState(initialRoute.checkout);
  const [isProcessing, setIsProcessing] = useState(false);
  const [policyModal, setPolicyModalRaw] = useState<"refund" | "terms" | null>(
    initialRoute.policy,
  );

  const navigate = (path: string) => {
    window.history.pushState(null, "", path);
  };

  const setActiveProduct = (key: ProductKey | null) => {
    setActiveProductRaw(key);
    if (key) navigate(`/product/${key}`);
    else navigate("/");
  };

  const setShowCheckout = (show: boolean) => {
    setShowCheckoutRaw(show);
    if (show) navigate("/checkout");
    else navigate("/");
  };

  const setPolicyModal = (val: "refund" | "terms" | null) => {
    setPolicyModalRaw(val);
    if (val) navigate(`/${val}`);
    else navigate("/");
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      if (path.startsWith("/product/")) {
        const key = path.replace("/product/", "") as ProductKey;
        if (key in PRODUCTS) {
          setActiveProductRaw(key);
          setShowCheckoutRaw(false);
          setPolicyModalRaw(null);
          return;
        }
      }
      if (path === "/checkout") {
        setShowCheckoutRaw(true);
        setActiveProductRaw(null);
        setPolicyModalRaw(null);
        return;
      }
      if (path === "/refund") {
        setPolicyModalRaw("refund");
        setActiveProductRaw(null);
        setShowCheckoutRaw(false);
        return;
      }
      if (path === "/terms") {
        setPolicyModalRaw("terms");
        setActiveProductRaw(null);
        setShowCheckoutRaw(false);
        return;
      }
      setActiveProductRaw(null);
      setShowCheckoutRaw(false);
      setPolicyModalRaw(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    email: "",
    zipCode: "",
    address: "",
    addressDetail: "",
    memo: "",
  });

  const addToCart = (key: ProductKey, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing)
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i,
        );
      return [...prev, { key, qty }];
    });
  };

  const updateCartQty = (key: ProductKey, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.key !== key));
    } else {
      setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
    }
  };

  const removeFromCart = (key: ProductKey) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  };

  const cartTotal = cart.reduce((sum, i) => {
    const p = PRODUCTS[i.key];
    const price = parseInt(p.price.replace(/[^0-9]/g, ""));
    return sum + price * i.qty;
  }, 0);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.address;
        let extra = "";
        if (data.addressType === "R") {
          if (data.bname) extra += data.bname;
          if (data.buildingName)
            extra += extra ? `, ${data.buildingName}` : data.buildingName;
          if (extra) fullAddress += ` (${extra})`;
        }
        setShipping((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address: fullAddress,
        }));
      },
    }).open();
  };

  const handlePayment = async () => {
    if (!shipping.name || !shipping.phone || !shipping.address) return;
    setIsProcessing(true);
    try {
      const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
      const tossPayments = window.TossPayments(clientKey);
      const orderId = `LOCKIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const firstName =
        cart.length > 0
          ? `${PRODUCTS[cart[0].key].name} ${PRODUCTS[cart[0].key].sub}`
          : "";
      const orderName =
        cart.length === 1 ? firstName : `${firstName} 외 ${cart.length - 1}건`;
      const SHIPPING_FEE = 3000;
      await tossPayments.requestPayment("카드", {
        amount: cartTotal + SHIPPING_FEE,
        orderId,
        orderName,
        customerName: shipping.name,
        successUrl: `${window.location.origin}?payment=success`,
        failUrl: `${window.location.origin}?payment=fail`,
      });
    } catch (e) {
      console.log("결제 취소:", e);
    }
    setIsProcessing(false);
  };

  // Activate all videos (called on intro dismiss + as fallback)
  const activateVideos = () => {
    const heroVid = heroVideoRef.current;
    const scrollVid = videoRef.current;
    if (heroVid) {
      heroVid.muted = true;
      heroVid.play().catch(() => {});
    }
    if (scrollVid) {
      scrollVid.muted = true;
      scrollVid
        .play()
        .then(() => {
          scrollVid.pause();
          scrollVid.currentTime = 0;
        })
        .catch(() => {});
    }
  };

  // Dismiss intro overlay → activate videos
  const dismissIntro = () => {
    if (introHiding) return;
    activateVideos();
    setIntroHiding(true);
    setTimeout(() => setIntroVisible(false), 600);
  };

  // Auto-dismiss on desktop (where autoplay usually works without gesture)
  useEffect(() => {
    const heroVid = heroVideoRef.current;
    const scrollVid = videoRef.current;
    heroVid?.setAttribute("webkit-playsinline", "true");
    scrollVid?.setAttribute("webkit-playsinline", "true");

    // Try playing immediately — if it succeeds, auto-dismiss intro
    const heroVidEl = heroVideoRef.current;
    if (heroVidEl) {
      heroVidEl.muted = true;
      const p = heroVidEl.play();
      if (p) {
        p.then(() => {
          // Autoplay worked (desktop / non-low-power iOS) → dismiss intro
          dismissIntro();
        }).catch(() => {
          // Autoplay blocked (iOS) → keep intro visible, wait for tap
        });
      }
    }

    // Also try activating scroll video
    if (scrollVid) {
      scrollVid.muted = true;
      scrollVid
        .play()
        .then(() => {
          scrollVid.pause();
          scrollVid.currentTime = 0;
        })
        .catch(() => {});
    }

    // Fallback: auto-dismiss after 3s even if video didn't play
    const fallback = setTimeout(() => {
      if (introVisible) dismissIntro();
    }, 3000);

    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading = useScrollReveal(0.2);
  const nameBlock = useScrollReveal(0.15);
  const flavorBlock = useScrollReveal(0.15);
  const sourceBlock = useScrollReveal(0.15);
  const processBlock = useScrollReveal(0.15);
  const eventReveal = useScrollReveal(0.1);
  const flavorReveal = useScrollReveal(0.1);
  const editorialReveal = useScrollReveal(0.1);
  const sustainReveal = useScrollReveal(0.1);

  // Orange gradient grain canvas
  const grainRef = useRef<HTMLCanvasElement>(null);
  const grainScroll = useRef(0);

  const drawGrain = useCallback(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Black background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    const scroll = grainScroll.current;

    // Blob 1 — main glow
    const cx1 = w * 0.5 + Math.sin(scroll * 0.3) * w * 0.25;
    const cy1 = h * 0.35 + Math.cos(scroll * 0.2) * h * 0.2;
    const r1 = Math.max(w, h) * (0.55 + Math.sin(scroll * 0.15) * 0.1);
    const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, r1);
    g1.addColorStop(0, "rgba(232, 116, 58, 0.22)");
    g1.addColorStop(0.4, "rgba(232, 116, 58, 0.08)");
    g1.addColorStop(1, "rgba(232, 116, 58, 0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    // Blob 2 — warm accent lower
    const cx2 = w * 0.3 + Math.cos(scroll * 0.25 + 2) * w * 0.2;
    const cy2 = h * 0.7 + Math.sin(scroll * 0.3 + 1) * h * 0.15;
    const r2 = Math.max(w, h) * (0.4 + Math.cos(scroll * 0.18) * 0.08);
    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
    g2.addColorStop(0, "rgba(244, 162, 97, 0.14)");
    g2.addColorStop(0.5, "rgba(244, 162, 97, 0.04)");
    g2.addColorStop(1, "rgba(244, 162, 97, 0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // Blob 3 — subtle upper-right
    const cx3 = w * 0.75 + Math.sin(scroll * 0.35 + 3) * w * 0.1;
    const cy3 = h * 0.25 + Math.cos(scroll * 0.28 + 2) * h * 0.1;
    const r3 = Math.max(w, h) * (0.3 + Math.sin(scroll * 0.2 + 1) * 0.06);
    const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, r3);
    g3.addColorStop(0, "rgba(232, 116, 58, 0.1)");
    g3.addColorStop(0.5, "rgba(232, 116, 58, 0.03)");
    g3.addColorStop(1, "rgba(232, 116, 58, 0)");
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, w, h);

    // Noise/grain overlay
    const imageData = ctx.getImageData(0, 0, w * dpr, h * dpr);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  // Scroll-driven grain animation in sheet content
  useEffect(() => {
    if (!expanded) return;
    const el = sheetContentRef.current;
    if (!el) return;

    let rafId: number;
    const onScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight;
      grainScroll.current =
        scrollable > 0 ? (el.scrollTop / scrollable) * 10 : 0;
      rafId = requestAnimationFrame(drawGrain);
    };

    // Initial draw
    drawGrain();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [expanded, drawGrain]);

  // Scroll → sheet follows, then snaps
  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const update = () => {
      const viewportH = window.innerHeight;
      const scrollY = window.scrollY;
      // Use full viewport as scroll range so it doesn't snap too fast on desktop
      const scrollRange = viewportH;
      const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);

      const hiddenAmount = viewportH - PEEK_HEIGHT;

      if (!expanded) {
        const bottom = -hiddenAmount * (1 - progress);
        setSheetBottom(bottom);
        setHeroFade(progress);

        // Snap when past 40%
        if (progress >= 0.4) {
          setExpanded(true);
          setSheetBottom(0);
          setHeroFade(1);
          document.body.style.overflow = "hidden";
          document.body.style.position = "fixed";
          document.body.style.width = "100%";
          document.body.style.top = `-${scrollY}px`;
          setTimeout(() => setShowText(true), 300);
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [expanded]);

  // Close the sheet and restore page scroll
  const closeSheet = () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(0, 0);
    setExpanded(false);
    setShowText(false);
    setHeroFade(0);
    setSheetBottom(-(window.innerHeight - PEEK_HEIGHT));
    setVideoScale(1);
  };

  // Scroll-synced video playback + scale after expanded
  useEffect(() => {
    if (!expanded) return;

    let rafId: number;
    let ticking = false;

    const update = () => {
      const video = videoRef.current;
      const content = sheetContentRef.current;
      if (!video || !content) {
        ticking = false;
        return;
      }

      const scrollTop = content.scrollTop;
      const scrollable = content.scrollHeight - content.clientHeight;
      const progress = scrollable > 0 ? scrollTop / scrollable : 0;

      const scaleT = Math.min(progress / 0.2, 1);
      setVideoScale(1 + scaleT * 0.2);

      if (video.duration && isFinite(video.duration)) {
        // Accelerate: video completes in first 40% of scroll
        const videoProgress = Math.min(progress / 0.4, 1);
        video.currentTime = videoProgress * video.duration;
      }

      ticking = false;
    };

    // Close sheet when pulling down at top (touch for mobile)
    let touchStartY = 0;
    const el2 = sheetContentRef.current;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!el2 || el2.scrollTop > 0) return;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (deltaY > 80) {
        closeSheet();
      }
    };

    el2?.addEventListener("touchstart", onTouchStart, { passive: true });
    el2?.addEventListener("touchmove", onTouchMove, { passive: true });

    // Desktop: wheel-up at top of sheet → close
    const onWheel = (e: WheelEvent) => {
      if (!el2 || el2.scrollTop > 0) return;
      if (e.deltaY < -60) {
        closeSheet();
      }
    };
    el2?.addEventListener("wheel", onWheel, { passive: true });

    const el = sheetContentRef.current;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el?.removeEventListener("scroll", onScroll);
      el2?.removeEventListener("touchstart", onTouchStart);
      el2?.removeEventListener("touchmove", onTouchMove);
      el2?.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, [expanded]);

  return (
    <div>
      {/* Intro overlay — captures first tap for iOS video activation */}
      {introVisible && (
        <IntroOverlay
          hiding={introHiding}
          onClick={dismissIntro}
          onTouchStart={dismissIntro}
        >
          <IntroLogo src="/logo.png" alt="더존바이오" />
          <IntroText>Tap to Enter</IntroText>
        </IntroOverlay>
      )}

      {/* Hero */}
      <HeroFixed>
        <HeroBlackout opacity={heroFade} />
        <HeroVideo
          ref={heroVideoRef}
          src="/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <HeroOverlay>
          <TopSection>
            <TopLeft>
              BIO HACKING
              <br />
              MUSHROOM COFFEE
            </TopLeft>
            <TopRight>
              LION'S MANE
              <br />
              MUSHROOM
            </TopRight>
          </TopSection>
          <MiddleSection>
            <FounderText>Founder's drinks</FounderText>
            <FocusText>
              Focus is the
              <br />
              new <em>Luxury</em>
            </FocusText>
          </MiddleSection>
          <BottomSection>
            <HeroLogo src="/logo.png" alt="더존바이오" />
            <MainTitle>아직, 진짜 집중을 모릅니다</MainTitle>
            <SubText>
              배송비만 내고
              <br />
              무료 체험
              <br />
              시작하기
            </SubText>
            <Arrow>↓</Arrow>
          </BottomSection>
        </HeroOverlay>
        <FooterText>unlock what you've been missing.</FooterText>
      </HeroFixed>

      {/* Invisible scroll area to trigger sheet */}
      <div style={{ height: "200dvh", position: "relative", zIndex: 0 }} />

      {/* Bottom Sheet Modal */}
      <BottomSheet bottomOffset={sheetBottom} expanded={expanded}>
        {/* Handle bar — peek state */}
        <SheetHandle expanded={expanded}>
          <HandleBar />
        </SheetHandle>

        {/* Video background */}
        <SheetVideo
          ref={videoRef}
          src="/product-video.mp4"
          scale={videoScale}
          muted
          playsInline
          preload="auto"
        />

        {/* Scrollable text content over video */}
        <ScrollableContent
          ref={sheetContentRef}
          style={{ overflowY: expanded ? "auto" : "hidden", height: "100%" }}
        >
          <TextContent show={showText}>
            <OverlayBlock ref={heading.ref}>
              <HeadingNav>
                <NavLabel>Beyond Coffee</NavLabel>
                <NavLabel>001</NavLabel>
              </HeadingNav>
              <BigHeading css={revealUp(heading.visible)}>
                What if your coffee
                <br />
                was holding
                <br />
                you <em>back</em>?
              </BigHeading>
            </OverlayBlock>

            {/* Free-form scattered layout */}
            <FreeCanvas>
              {/* The Name — left, slightly tilted */}
              <StickyBlock padLeft="24px" ref={nameBlock.ref}>
                <div
                  css={revealLeft(nameBlock.visible, 0)}
                  style={{ transform: "rotate(-1deg)" }}
                >
                  <WatermarkText
                    size={80}
                    style={{ marginBottom: -20, marginLeft: -12 }}
                  >
                    LOCK IN
                  </WatermarkText>
                  <LabelSmall>The Name</LabelSmall>
                  <TitleLarge>
                    Lock-in
                    <br />
                    Coffee
                  </TitleLarge>
                  <BodyText>
                    일반 커피가 채울 수 없는 영역.
                    <br />
                    인지 기능과 몰입을 위해
                    <br />
                    설계된 바이오해킹 음료.
                  </BodyText>
                </div>
              </StickyBlock>

              {/* The Flavor — right, tilted other way */}
              <StickyBlock align="right" padRight="24px" ref={flavorBlock.ref}>
                <div
                  css={revealRight(flavorBlock.visible, 0.2)}
                  style={{ transform: "rotate(1.5deg)" }}
                >
                  <LabelSmall>The Flavor</LabelSmall>
                  <TitleLarge>
                    Nature's
                    <br />
                    Quiet Depth
                  </TitleLarge>
                  <BodyText style={{ marginLeft: "auto" }}>
                    노루궁뎅이 버섯의 섬세한 뉘앙스와
                    <br />
                    스페셜티 원두의 깊은 바디가
                    <br />
                    만들어내는 미지의 풍미.
                  </BodyText>
                  <WatermarkText
                    size={60}
                    style={{ marginTop: -10, opacity: 0.1 }}
                  >
                    COFFEE
                  </WatermarkText>
                </div>
              </StickyBlock>

              {/* The Source — left, scaled in */}
              <StickyBlock padLeft="32px" ref={sourceBlock.ref}>
                <div
                  css={revealScale(sourceBlock.visible, 0)}
                  style={{ transform: "rotate(-0.5deg)" }}
                >
                  <LabelSmall>The Source</LabelSmall>
                  <DetailTitle style={{ fontSize: 34 }}>
                    Lion's
                    <br />
                    Mane
                  </DetailTitle>
                  <DetailBody>
                    신경성장인자(NGF) 생성을 촉진하는
                    <br />
                    노루궁뎅이 버섯(Lion's Mane).
                    <br />
                    당신의 뇌가 기다려온 원료.
                  </DetailBody>
                </div>
              </StickyBlock>

              {/* The Process — right, rising up */}
              <StickyBlock align="right" padRight="20px">
                <div
                  ref={processBlock.ref}
                  css={revealUp(processBlock.visible, 0.1)}
                  style={{ transform: "rotate(2deg)" }}
                >
                  <LabelSmall>The Process</LabelSmall>
                  <DetailTitle>
                    Cold Brew
                    <br />
                    Extraction
                  </DetailTitle>
                  <DetailBody style={{ marginLeft: "auto" }}>
                    24시간 저온 추출.
                    <br />
                    열이 파괴하는 것들을 지킵니다.
                  </DetailBody>
                  <WatermarkText
                    size={50}
                    style={{ marginTop: -8, opacity: 0.1 }}
                  >
                    MUSHROOM
                  </WatermarkText>
                </div>
              </StickyBlock>
            </FreeCanvas>
          </TextContent>

          {/* ─── Sub Pages (하위페이지.png) ─── */}
          <SubPageWrap>
            <GrainCanvas ref={grainRef} />
            <SubPageContent>
              {/* Section 1: Event + Products */}
              <EventSection ref={eventReveal.ref}>
                <div css={revealUp(eventReveal.visible)}>
                  <SecTitle>단 100개 한정</SecTitle>
                  <SecSub>
                    당신의 첫 번째 몰입.
                    <br />
                    100ml, 배송비만 부담하세요.
                  </SecSub>
                </div>

                {/* Wide banner: image left, info right */}
                <EventBanner>
                  <BannerImg>
                    <img
                      src="/event-hero.png"
                      alt="100ml 무료 체험"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </BannerImg>
                  <BannerInfo>
                    <BannerTitle>
                      100ml <em>무료</em>
                      <br />
                      체험 이벤트
                    </BannerTitle>
                    <BannerDesc>
                      노루궁뎅이 버섯 × 스페셜티 콜드브루
                      <br />한 모금이면 차이를 압니다.
                    </BannerDesc>
                    <BannerBtn
                      onClick={() => {
                        setCart([{ key: "trial", qty: 1 }]);
                        setCartOpen(false);
                        setShowCheckout(true);
                      }}
                    >
                      지금 경험하기
                    </BannerBtn>
                    <BannerNote>* 배송비 3,000원 · 1인 1회</BannerNote>
                  </BannerInfo>
                </EventBanner>
              </EventSection>

              {/* Section 2: Flavors */}
              <FlavorSection ref={flavorReveal.ref}>
                <div css={revealUp(flavorReveal.visible)}>
                  <SecTitle>The Flavors</SecTitle>
                  <SecSub>
                    Clean. Potent. Feel The
                    <br />
                    Difference
                  </SecSub>
                </div>

                <GridRow style={{ marginTop: 40 }}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveProduct("signature")}
                  >
                    <GridImgBox bg="#4a1a1a" style={{ overflow: "hidden" }}>
                      <img
                        src="/decaf.png"
                        alt="Signature 디카페인"
                        style={{
                          width: "110%",
                          height: "110%",
                          objectFit: "cover",
                        }}
                      />
                    </GridImgBox>
                    <GridLabel>
                      <ItemName>Signature</ItemName>
                      <ItemSub>디카페인</ItemSub>
                      <PriceRow>
                        <PriceOrigRow>
                          <OrigPrice>70,000원</OrigPrice>
                          <DiscountBadge>44%</DiscountBadge>
                        </PriceOrigRow>
                        <SalePrice>39,000원</SalePrice>
                      </PriceRow>
                    </GridLabel>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveProduct("house")}
                  >
                    <GridImgBox bg="#1a3a5c" style={{ overflow: "hidden" }}>
                      <img
                        src="/caffeine.png"
                        alt="카페인 부스트"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </GridImgBox>
                    <GridLabel>
                      <ItemName>House</ItemName>
                      <ItemSub>카페인</ItemSub>
                      <PriceRow>
                        <PriceOrigRow>
                          <OrigPrice>60,000원</OrigPrice>
                          <DiscountBadge>40%</DiscountBadge>
                        </PriceOrigRow>
                        <SalePrice>36,000원</SalePrice>
                      </PriceRow>
                    </GridLabel>
                  </div>
                </GridRow>
                <FlavorWide
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveProduct("vibrant")}
                >
                  <FlavorWideImg bg="#3a2010" style={{ overflow: "hidden" }}>
                    <img
                      src="/acidity.png"
                      alt="Vibrant 산미"
                      style={{
                        width: "120%",
                        height: "120%",
                        objectFit: "cover",
                      }}
                    />
                  </FlavorWideImg>
                  <ItemName>Vibrant</ItemName>
                  <ItemSub>산미</ItemSub>
                  <PriceRow>
                    <PriceOrigRow>
                      <OrigPrice>80,000원</OrigPrice>
                      <DiscountBadge>47%</DiscountBadge>
                    </PriceOrigRow>
                    <SalePrice>42,000원</SalePrice>
                  </PriceRow>
                </FlavorWide>
              </FlavorSection>

              {/* Section 3: In Good Company */}
              <CompanySection ref={editorialReveal.ref}>
                <div css={revealUp(editorialReveal.visible)}>
                  <CompanyTitle>
                    In
                    <br />
                    Good
                    <br />
                    <em>Company</em>
                  </CompanyTitle>

                  <CompanyGrid>
                    <GBox h={140} span={2}>
                      <video
                        src="/company-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </GBox>
                    <GBox h={140}>
                      <img src="/company1.jpg" alt="company" />
                    </GBox>
                    <GBox h={120}>
                      <img src="/company2.jpg" alt="company" />
                    </GBox>
                    <GBox h={120}>
                      <img src="/company3.jpg" alt="company" />
                    </GBox>
                    <GBox h={120}>
                      <img src="/company4.jpg" alt="company" />
                    </GBox>
                  </CompanyGrid>

                  <CompanyBody>
                    가장 깨어있는 크리에이터,
                    <br />
                    큐레이터, 그리고 공간들이
                    <br />
                    선택한 커피.
                  </CompanyBody>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <MetaLine
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/thezonebio.kr",
                          "_blank",
                        )
                      }
                      style={{
                        color: "#fff",
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                        cursor: "pointer",
                      }}
                    >
                      @thezonebio.kr
                    </MetaLine>
                  </div>
                </div>
              </CompanySection>

              {/* Section 4: Lock In Now */}
              <TraceSection ref={sustainReveal.ref}>
                <TraceTitle css={revealScale(sustainReveal.visible)}>
                  LOCK IN <em>Now</em>
                </TraceTitle>
                <TraceBody>
                  마감은 다가오는데 머리는 멍하고, 앉아만 있다 하루가 끝난 적
                  있잖아요. 원할 때 바로 몰입에 들어가는 것 — 그게 이 커피가
                  만들어진 이유입니다.
                </TraceBody>
              </TraceSection>

              {/* Section 4.5: CTA Banner */}
              <CtaBanner>
                <CtaCard>
                  <CtaImg>
                    <img src="/event-hero.png" alt="100ml 무료 체험" />
                  </CtaImg>
                  <CtaInfo>
                    <CtaLabel>Free Trial</CtaLabel>
                    <CtaText>
                      아직 안 마셔봤다면,
                      <br />
                      지금이 기회입니다.
                      <br />
                      <strong>100ml 무료</strong>
                    </CtaText>
                    <CtaButton
                      onClick={() => {
                        setCart([{ key: "trial", qty: 1 }]);
                        setCartOpen(false);
                        setShowCheckout(true);
                      }}
                    >
                      지금 경험하기
                    </CtaButton>
                    <CtaNote>* 배송비 3,000원 · 1인 1회</CtaNote>
                  </CtaInfo>
                </CtaCard>
              </CtaBanner>

              {/* Section 5: Footer */}
              <FooterSection>
                <FtLabel>Stay Locked In</FtLabel>
                <FtBrand>
                  LOCK IN
                  <br />
                  COFFEE
                </FtBrand>
                <FtLogo src="/logo.png" alt="더존바이오" />

                <FtRow>
                  <FtInput>이메일을 입력하세요</FtInput>
                  <FtBtn>Subscribe</FtBtn>
                </FtRow>

                <FtLinks>
                  <FtLink>Shop</FtLink>
                  <FtLink>About</FtLink>
                  <FtLink>Contact</FtLink>
                  <FtLink
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/thezonebio.kr",
                        "_blank",
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    Instagram
                  </FtLink>
                </FtLinks>

                <FtMarqueeWrap>
                  <FtMarqueeTrack>
                    <FtWatermark>unlock what you've been missing</FtWatermark>
                    <FtWatermark>unlock what you've been missing</FtWatermark>
                    <FtWatermark>unlock what you've been missing</FtWatermark>
                    <FtWatermark>unlock what you've been missing</FtWatermark>
                  </FtMarqueeTrack>
                </FtMarqueeWrap>

                <FtCopy>
                  <span>© {new Date().getFullYear()} THEZONEBIO</span>
                  <span>Made with focus</span>
                </FtCopy>

                <FtBizInfo>
                  상호 : 더존바이오 &nbsp;|&nbsp; 대표 : 박민성 &nbsp;|&nbsp;
                  사업자등록번호 : 787-31-01774
                  <br />
                  사업장소재지 : 인천광역시 연수구 인천타워대로 323, A동 31층
                  더블유엔73호(송도동, 송도 센트로드)
                  <br />
                  업태 : 도매 및 소매업 &nbsp;|&nbsp; 종목 : 전자상거래 소매업
                  &nbsp;|&nbsp; 이메일 : me@thezonebio.com
                  <br />
                  통신판매업신고번호 : 제 2025-인천연수구-2735 호<br />
                  고객센터 : 010-9942-7360
                </FtBizInfo>

                <FtPolicyLinks>
                  <FtPolicyLink onClick={() => setPolicyModal("refund")}>
                    환불정책
                  </FtPolicyLink>
                  <FtPolicyLink onClick={() => setPolicyModal("terms")}>
                    이용약관
                  </FtPolicyLink>
                </FtPolicyLinks>

                <FtSocialLinks>
                  <FtSocialLink
                    href="https://www.instagram.com/thezonebio.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </FtSocialLink>
                  <FtSocialLink
                    href="https://smartstore.naver.com/thezonebio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Naver Store
                  </FtSocialLink>
                </FtSocialLinks>
              </FooterSection>
            </SubPageContent>
          </SubPageWrap>
        </ScrollableContent>
      </BottomSheet>

      {/* Product Detail Modal */}
      {activeProduct &&
        (() => {
          const p = PRODUCTS[activeProduct];
          return (
            <PDOverlay>
              <PDClose
                onClick={() => {
                  setActiveProduct(null);
                  setPdQty(1);
                }}
              >
                CLOSE
              </PDClose>
              <PDLayout>
                <PDImagePanel bg={p.bg}>
                  <PDProductImage src={p.image} alt={p.name} />
                </PDImagePanel>
                <PDInfoPanel>
                  <PDName>{p.name}</PDName>
                  <PDSub>{p.sub}</PDSub>
                  <PDPriceArea>
                    <PDPriceOrigRow>
                      <PDOrigPrice>{p.origPrice}</PDOrigPrice>
                      <PDDiscount>{p.discount}</PDDiscount>
                    </PDPriceOrigRow>
                    <PDSalePrice>{p.price}</PDSalePrice>
                  </PDPriceArea>
                  <PDQtyRow>
                    <QtyBtn onClick={() => setPdQty((q) => Math.max(1, q - 1))}>
                      −
                    </QtyBtn>
                    <QtyNum>{pdQty}</QtyNum>
                    <QtyBtn onClick={() => setPdQty((q) => q + 1)}>+</QtyBtn>
                  </PDQtyRow>
                  <PDBuyBtn
                    onClick={() => {
                      addToCart(activeProduct, pdQty);
                      setActiveProduct(null);
                      setPdQty(1);
                    }}
                  >
                    장바구니 담기
                  </PDBuyBtn>
                  <PDSpecsTable>
                    {p.specs.map((s, i) => (
                      <PDSpecRow key={i}>
                        <PDSpecLabel>{s.label}</PDSpecLabel>
                        <PDSpecValue>{s.value}</PDSpecValue>
                      </PDSpecRow>
                    ))}
                  </PDSpecsTable>
                </PDInfoPanel>
              </PDLayout>
            </PDOverlay>
          );
        })()}

      {/* Floating Cart */}
      {cart.length > 0 && !activeProduct && !showCheckout && (
        <>
          {cartOpen && (
            <CartFloat>
              <CartTitle>
                Cart ({cart.reduce((s, i) => s + i.qty, 0)})
              </CartTitle>
              {cart.map((item) => {
                const p = PRODUCTS[item.key];
                const price = parseInt(p.price.replace(/[^0-9]/g, ""));
                return (
                  <CartItemRow key={item.key}>
                    <div>
                      <CartItemName>
                        {p.name} {p.sub}
                      </CartItemName>
                      <CartItemPrice>
                        {(price * item.qty).toLocaleString()}원
                      </CartItemPrice>
                    </div>
                    <CartItemQty>
                      <CartQtyBtn
                        onClick={() => updateCartQty(item.key, item.qty - 1)}
                      >
                        −
                      </CartQtyBtn>
                      <span
                        style={{
                          fontSize: 13,
                          minWidth: 16,
                          textAlign: "center",
                        }}
                      >
                        {item.qty}
                      </span>
                      <CartQtyBtn
                        onClick={() => updateCartQty(item.key, item.qty + 1)}
                      >
                        +
                      </CartQtyBtn>
                      <CartRemoveBtn onClick={() => removeFromCart(item.key)}>
                        ×
                      </CartRemoveBtn>
                    </CartItemQty>
                  </CartItemRow>
                );
              })}
              <CartTotal>
                <span>합계</span>
                <span>{cartTotal.toLocaleString()}원</span>
              </CartTotal>
              <CartCheckoutBtn
                onClick={() => {
                  setCartOpen(false);
                  setShowCheckout(true);
                }}
              >
                CHECKOUT
              </CartCheckoutBtn>
            </CartFloat>
          )}
          <CartFab
            hasItems={cart.length > 0}
            onClick={() => setCartOpen((o) => !o)}
          >
            <CartBadge>{cart.reduce((s, i) => s + i.qty, 0)}</CartBadge>
            {cartOpen ? "✕" : "🛒"}
          </CartFab>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutOverlay>
          <CheckoutClose onClick={() => setShowCheckout(false)}>
            CLOSE
          </CheckoutClose>
          <CheckoutLayout>
            {/* Left: Order Preview */}
            <CheckoutPreview>
              <CheckoutPreviewTitle>주문 확인</CheckoutPreviewTitle>
              {cart.map((item) => {
                const p = PRODUCTS[item.key];
                const price = parseInt(p.price.replace(/[^0-9]/g, ""));
                return (
                  <CheckoutProductCard key={item.key}>
                    <CheckoutProductThumb bg={p.bg}>
                      <img src={p.image} alt={p.name} />
                    </CheckoutProductThumb>
                    <CheckoutProductInfo>
                      <CheckoutProductName>{p.name}</CheckoutProductName>
                      <CheckoutProductSub>
                        {p.sub} · {item.qty}개
                      </CheckoutProductSub>
                    </CheckoutProductInfo>
                    <CheckoutProductPrice>
                      {(price * item.qty).toLocaleString()}원
                    </CheckoutProductPrice>
                  </CheckoutProductCard>
                );
              })}
              <CheckoutTotalBlock>
                <CheckoutTotalRow>
                  <span>상품 금액</span>
                  <span>{cartTotal.toLocaleString()}원</span>
                </CheckoutTotalRow>
                <CheckoutTotalRow>
                  <span>배송비</span>
                  <span>3,000원</span>
                </CheckoutTotalRow>
                <CheckoutGrandTotal>
                  <span>총 결제금액</span>
                  <span>{(cartTotal + 3000).toLocaleString()}원</span>
                </CheckoutGrandTotal>
              </CheckoutTotalBlock>
            </CheckoutPreview>

            {/* Right: Shipping Form */}
            <CheckoutFormPanel>
              <CheckoutFormTitle>배송 정보</CheckoutFormTitle>

              <CheckoutSection>
                <CheckoutLabel>이름</CheckoutLabel>
                <CheckoutInput
                  value={shipping.name}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="홍길동"
                />
              </CheckoutSection>

              <CheckoutSection>
                <CheckoutLabel>연락처</CheckoutLabel>
                <CheckoutInput
                  value={shipping.phone}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="010-0000-0000"
                />
              </CheckoutSection>

              <CheckoutSection>
                <CheckoutLabel>이메일</CheckoutLabel>
                <CheckoutInput
                  value={shipping.email}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                />
              </CheckoutSection>

              <CheckoutSection>
                <CheckoutLabel>주소</CheckoutLabel>
                <CheckoutInputRow>
                  <CheckoutInput
                    value={shipping.zipCode}
                    readOnly
                    placeholder="우편번호"
                    style={{ flex: 1 }}
                  />
                  <CheckoutAddrBtn onClick={handleAddressSearch}>
                    주소 검색
                  </CheckoutAddrBtn>
                </CheckoutInputRow>
                <CheckoutInput
                  value={shipping.address}
                  readOnly
                  placeholder="주소"
                  style={{ marginTop: 8 }}
                />
                <CheckoutInput
                  value={shipping.addressDetail}
                  onChange={(e) =>
                    setShipping((p) => ({
                      ...p,
                      addressDetail: e.target.value,
                    }))
                  }
                  placeholder="상세주소"
                  style={{ marginTop: 8 }}
                />
              </CheckoutSection>

              <CheckoutSection>
                <CheckoutLabel>배송 메모</CheckoutLabel>
                <CheckoutInput
                  value={shipping.memo}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, memo: e.target.value }))
                  }
                  placeholder="부재 시 문 앞에 놓아주세요"
                />
              </CheckoutSection>

              <CheckoutPayBtn
                onClick={handlePayment}
                disabled={
                  isProcessing ||
                  !shipping.name ||
                  !shipping.phone ||
                  !shipping.address
                }
              >
                {isProcessing
                  ? "처리 중..."
                  : `${(cartTotal + 3000).toLocaleString()}원 결제하기`}
              </CheckoutPayBtn>
            </CheckoutFormPanel>
          </CheckoutLayout>
        </CheckoutOverlay>
      )}

      {/* Policy Modals */}
      {policyModal === "refund" && (
        <PolicyOverlay>
          <PolicyClose onClick={() => setPolicyModal(null)}>CLOSE</PolicyClose>
          <PolicyContent>
            <h1>환불정책</h1>

            <h2>1. 반품/환불 기본 안내</h2>
            <p>
              상품 수령일로부터 7일 이내에 반품 및 환불을 요청하실 수 있습니다.
              단, 식품 특성상 고객의 단순 변심에 의한 반품은 제한될 수 있으며,
              상품 하자나 배송 오류의 경우 전액 환불 처리됩니다.
            </p>

            <h2>2. 환불이 가능한 경우</h2>
            <p>
              · 상품이 파손 또는 변질된 상태로 배송된 경우
              <br />
              · 주문한 상품과 다른 상품이 배송된 경우
              <br />· 상품 수령 후 7일 이내 미개봉 상태인 경우
            </p>

            <h2>3. 환불이 불가한 경우</h2>
            <p>
              · 개봉 후 일부 소비한 식품
              <br />
              · 고객의 보관 부주의로 인한 변질
              <br />· 수령일로부터 7일이 경과한 경우
            </p>

            <h2>4. 환불 절차</h2>
            <p>
              고객센터(010-9942-7360) 또는 이메일(me@thezonebio.com)로 문의해
              주세요. 접수 후 1~2 영업일 내에 확인 후 처리되며, 카드 결제 취소는
              카드사에 따라 3~7 영업일 소요될 수 있습니다.
            </p>

            <h2>5. 배송비 부담</h2>
            <p>
              상품 하자 및 오배송의 경우 반품 배송비는 더존바이오가 부담합니다.
              단순 변심의 경우 왕복 배송비는 고객 부담입니다.
            </p>

            <div
              style={{
                marginTop: 40,
                padding: "16px 0",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              상호 : 더존바이오 | 대표 : 박민성 | 사업자등록번호 : 787-31-01774
              <br />
              고객센터 : 010-9942-7360 | 이메일 : me@thezonebio.com
            </div>
          </PolicyContent>
        </PolicyOverlay>
      )}

      {policyModal === "terms" && (
        <PolicyOverlay>
          <PolicyClose onClick={() => setPolicyModal(null)}>CLOSE</PolicyClose>
          <PolicyContent>
            <h1>이용약관</h1>

            <h2>제1조 (목적)</h2>
            <p>
              본 약관은 더존바이오(이하 "회사")가 운영하는 온라인 쇼핑몰에서
              제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와
              이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <h2>제2조 (정의)</h2>
            <p>
              · "쇼핑몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여
              정보통신설비를 이용하여 설정한 가상의 영업장을 말합니다.
              <br />· "이용자"란 쇼핑몰에 접속하여 본 약관에 따라 쇼핑몰이
              제공하는 서비스를 받는 회원 및 비회원을 말합니다.
            </p>

            <h2>제3조 (약관의 명시와 개정)</h2>
            <p>
              회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기
              화면에 게시합니다. 약관을 개정할 경우 적용일자 및 개정사유를
              명시하여 현행 약관과 함께 7일 전에 공지합니다.
            </p>

            <h2>제4조 (서비스의 제공 및 변경)</h2>
            <p>
              회사는 다음과 같은 서비스를 제공합니다.
              <br />
              · 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
              <br />
              · 구매계약이 체결된 재화 또는 용역의 배송
              <br />· 기타 회사가 정하는 서비스
            </p>

            <h2>제5조 (구매 및 결제)</h2>
            <p>
              이용자는 쇼핑몰에서 다음의 방법으로 구매를 신청하며, 회사는
              이용자의 구매 신청에 대하여 각 호의 사항을 알기 쉽게 제공하여야
              합니다.
              <br />
              · 재화 등의 검색 및 선택
              <br />
              · 성명, 주소, 전화번호, 결제 정보 입력
              <br />
              · 약관 동의 확인
              <br />· 결제 방법 선택 및 결제
            </p>

            <h2>제6조 (배송)</h2>
            <p>
              회사는 이용자와 배송 시기에 관한 별도의 약정이 없는 이상,
              주문일로부터 3~5 영업일 이내에 배송합니다. 다만, 회사의 사정에
              의해 지연될 수 있으며 이 경우 사전에 안내합니다.
            </p>

            <h2>제7조 (개인정보보호)</h2>
            <p>
              회사는 이용자의 개인정보를 수집 시 서비스 제공에 필요한 최소한의
              정보만을 수집하며, 개인정보처리방침에 따라 이용자의 개인정보를
              보호합니다.
            </p>

            <h2>제8조 (분쟁해결)</h2>
            <p>
              회사와 이용자 간에 발생한 분쟁에 관하여는 전자거래기본법,
              전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한
              법률 등 관련 법령에 따릅니다.
            </p>

            <div
              style={{
                marginTop: 40,
                padding: "16px 0",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              상호 : 더존바이오 | 대표 : 박민성 | 사업자등록번호 : 787-31-01774
              <br />
              사업장소재지 : 인천광역시 연수구 인천타워대로 323, A동 31층
              더블유엔73호(송도동, 송도 센트로드)
              <br />
              통신판매업신고번호 : 제 2025-인천연수구-2735 호<br />
              고객센터 : 010-9942-7360 | 이메일 : me@thezonebio.com
            </div>
          </PolicyContent>
        </PolicyOverlay>
      )}
    </div>
  );
}

export default App;
