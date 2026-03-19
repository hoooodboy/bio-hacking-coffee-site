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
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.3;
  text-transform: uppercase;
`;

const TopRight = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.3;
  text-transform: uppercase;
  text-align: right;
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
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const FocusText = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 24px;
  font-weight: 400;
  text-align: right;
  line-height: 0.8;
  em {
    font-style: italic;
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
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: 2px;
`;

const SubText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  opacity: 0.85;
  letter-spacing: 0.5px;
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
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 0.6;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
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
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.4;
`;

const BigHeading = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 38px;
  font-weight: 400;
  line-height: 1.15;
  margin: 0;
  em {
    font-style: italic;
  }
`;

const LabelSmall = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 8px;
  color: #fff;
`;

const TitleLarge = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
`;

const BodyText = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 300;
  line-height: 1.8;
  opacity: 0.85;
  margin-top: 10px;
  max-width: 220px;
  color: #fff;
`;

/* Free-form canvas for scattered text blocks */
const FreeCanvas = styled.div`
  position: relative;
  min-height: 220dvh;
  overflow: hidden;
`;

const FloatBlock = styled.div<{
  top: string;
  left?: string;
  right?: string;
  rotate?: string;
}>`
  position: absolute;
  top: ${({ top }) => top};
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  ${({ rotate }) => rotate && `transform: rotate(${rotate});`}
`;

const WatermarkText = styled.div<{ size?: number }>`
  font-family: "Roboto Mono", monospace;
  font-size: ${({ size }) => size || 100}px;
  font-weight: 500;
  line-height: 0.85;
  letter-spacing: -4px;
  opacity: 0.06;
  text-transform: uppercase;
  white-space: nowrap;
`;

const DetailTitle = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.25;
`;

const DetailBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 300;
  line-height: 1.7;
  opacity: 0.85;
  margin-top: 10px;
  max-width: 200px;
  color: #fff;
`;

const LineDivider = styled.div<{ top: string; rotate?: string }>`
  position: absolute;
  top: ${({ top }) => top};
  left: 10%;
  right: 10%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  ${({ rotate }) => rotate && `transform: rotate(${rotate});`}
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
`;

const Placeholder = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  color: rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

/* ── Shared sub-page styles ── */
const SecTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 28px;
  font-weight: 400;
  color: #fff;
  margin: 0;
`;

const SecSub = styled.p`
  font-family: "Instrument Serif", serif;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.35;
  margin: 4px 0 0;
`;

const ItemName = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const ItemSub = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
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
  font-size: 28px;
  font-weight: 400;
  color: #fff;
  line-height: 1.2;
  em { font-style: italic; }
  @media (min-width: 768px) {
    font-size: 40px;
  }
`;


const BannerDesc = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const BannerBtn = styled.div`
  display: inline-block;
  align-self: flex-start;
  padding: 10px 24px;
  border-radius: 40px;
  background: #fff;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #e8743a;
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 14px 32px;
  }
`;

const BannerNote = styled.div`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 9px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  @media (min-width: 768px) {
    font-size: 12px;
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
  margin-top: 12px;
`;

const FlavorWideImg = styled.div<{ bg: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

/* ── Section 3: In Good Company ── */
const CompanySection = styled.section`
  background: transparent;
  padding: 72px 24px 60px;
`;

const CompanyTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 52px;
  font-weight: 400;
  color: #fff;
  line-height: 1.0;
  margin: 0 0 24px;
  em { font-style: italic; }
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
  ${({ span }) => span && `grid-column: span ${span};`}
`;

const CompanyBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin: 0 0 28px;
`;

const MetaLine = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
`;

/* ── Section 4: Leave No Trace ── */
const TraceSection = styled.section`
  background: transparent;
  padding: 80px 24px;
  text-align: center;
`;

const TraceTitle = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: 44px;
  font-weight: 400;
  color: #fff;
  line-height: 1.1;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const TraceInline = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: #e8743a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TraceBody = styled.p`
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  max-width: 300px;
  margin: 16px auto 0;
`;

/* ── Section 5: Footer ── */
const FooterSection = styled.footer`
  background: transparent;
  padding: 56px 24px 28px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const FtLabel = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 4px;
`;

const FtBrand = styled.h3`
  font-family: "Roboto Mono", monospace;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 8px;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
`;

const FtBtn = styled.div`
  height: 40px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const FtLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const FtLink = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
`;

const FtWatermark = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 80px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.03);
  line-height: 0.9;
  margin: 32px -24px 16px;
  white-space: nowrap;
`;

const FtCopy = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.1);
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
      grainScroll.current = scrollable > 0 ? (el.scrollTop / scrollable) * 10 : 0;
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
        video.currentTime = progress * video.duration;
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
              new <em>luxury</em>
            </FocusText>
          </MiddleSection>
          <BottomSection>
            <HeroLogo src="/logo.png" alt="더존바이오" />
            <MainTitle>완벽한 몰입</MainTitle>
            <SubText>
              배송비만 내고
              <br />
              무료 체험
              <br />
              하러가기
            </SubText>
            <Arrow>↓</Arrow>
          </BottomSection>
        </HeroOverlay>
        <FooterText>focus is the new luxury.</FooterText>
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
                <NavLabel>More to Enjoy</NavLabel>
                <NavLabel>001</NavLabel>
              </HeadingNav>
              <BigHeading css={revealUp(heading.visible)}>
                The bottle is our
                <br />
                <em>tribute</em> to the
                <br />
                source.
              </BigHeading>
            </OverlayBlock>

            {/* Free-form scattered layout */}
            <FreeCanvas>
              {/* Watermarks — background texture */}
              <FloatBlock top="2%" left="-5%">
                <WatermarkText size={120}>LOCK-IN</WatermarkText>
              </FloatBlock>
              <FloatBlock top="50%" right="-8%" rotate="90deg">
                <WatermarkText size={90}>COFFEE</WatermarkText>
              </FloatBlock>
              <FloatBlock top="85%" left="5%">
                <WatermarkText size={70}>MUSHROOM</WatermarkText>
              </FloatBlock>

              {/* Decorative lines */}
              <LineDivider top="30%" rotate="-2deg" />
              <LineDivider top="70%" rotate="1deg" />

              {/* The Name — top left */}
              <FloatBlock top="5%" left="20px" ref={nameBlock.ref}>
                <div css={revealLeft(nameBlock.visible, 0)}>
                  <LabelSmall>The Name</LabelSmall>
                  <TitleLarge>
                    Lock-in
                    <br />
                    Coffee
                  </TitleLarge>
                  <BodyText>
                    노트로픽 버섯 원두커피.
                    <br />
                    집중력과 인지 기능을 위한
                    <br />
                    바이오해킹 음료.
                  </BodyText>
                </div>
              </FloatBlock>

              {/* The Flavor — right */}
              <FloatBlock top="22%" right="20px" ref={flavorBlock.ref}>
                <div
                  css={revealRight(flavorBlock.visible, 0.2)}
                  style={{ textAlign: "right" }}
                >
                  <LabelSmall>The Flavor</LabelSmall>
                  <TitleLarge>
                    Nature's
                    <br />
                    Dancing Light
                  </TitleLarge>
                  <BodyText style={{ marginLeft: "auto" }}>
                    노루궁뎅이 버섯의 은은한 향과
                    <br />
                    스페셜티 원두의 깊은 풍미가
                    <br />
                    조화를 이루는 맛.
                  </BodyText>
                </div>
              </FloatBlock>

              {/* The Source — center-left */}
              <FloatBlock top="46%" left="32px" ref={sourceBlock.ref}>
                <div css={revealScale(sourceBlock.visible, 0)}>
                  <LabelSmall>The Source</LabelSmall>
                  <DetailTitle style={{ fontSize: 34 }}>
                    Lion's
                    <br />
                    Mane
                  </DetailTitle>
                  <DetailBody>
                    기억력과 집중력 향상에 도움을 주는
                    <br />
                    노루궁뎅이 버섯(Lion's Mane)을
                    <br />
                    핵심 원료로 사용합니다.
                  </DetailBody>
                </div>
              </FloatBlock>

              {/* The Process — far right */}
              <FloatBlock top="68%" right="16px">
                <div
                  ref={processBlock.ref}
                  css={revealUp(processBlock.visible, 0.1)}
                  style={{ textAlign: "right" }}
                >
                  <LabelSmall>The Process</LabelSmall>
                  <DetailTitle>
                    Cold Brew
                    <br />
                    Extraction
                  </DetailTitle>
                  <DetailBody style={{ marginLeft: "auto" }}>
                    24시간 저온 추출로
                    <br />
                    부드러운 맛과 높은 카페인
                    <br />
                    효율을 동시에 실현.
                  </DetailBody>
                </div>
              </FloatBlock>
            </FreeCanvas>
          </TextContent>

          {/* ─── Sub Pages (하위페이지.png) ─── */}
          <SubPageWrap>
            <GrainCanvas ref={grainRef} />
            <SubPageContent>

            {/* Section 1: Event + Products */}
            <EventSection ref={eventReveal.ref}>
              <div css={revealUp(eventReveal.visible)}>
                <SecTitle>Lock-in Coffee</SecTitle>
                <SecSub>100ml 무료 체험.<br />배송비만 부담하세요.</SecSub>
              </div>

              {/* Wide banner: image left, info right */}
              <EventBanner>
                <BannerImg>
                  <img src="/event-hero.png" alt="100ml 무료 체험" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </BannerImg>
                <BannerInfo>
                  <BannerTitle>100ml <em>무료</em><br />체험 이벤트</BannerTitle>
                  <BannerDesc>노루궁뎅이 버섯 × 스페셜티 원두<br />배송비만 부담하세요.</BannerDesc>
                  <BannerBtn>무료 체험 신청하기</BannerBtn>
                  <BannerNote>* 배송비 3,000원 · 1인 1회</BannerNote>
                </BannerInfo>
              </EventBanner>

            </EventSection>

            {/* Section 2: Flavors */}
            <FlavorSection ref={flavorReveal.ref}>
              <div css={revealUp(flavorReveal.visible)}>
                <SecTitle>The Flavors</SecTitle>
                <SecSub>Clean. 100% Natural. Taste The<br />Difference</SecSub>
              </div>

              <GridRow style={{ marginTop: 40 }}>
                <div>
                  <GridImgBox bg="#4a1a1a" style={{ overflow: "hidden" }}>
                    <img src="/decaf.png" alt="디카페인 블렌드" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </GridImgBox>
                  <GridLabel>
                    <ItemName>디카페인 블렌드</ItemName>
                    <ItemSub>Decaf</ItemSub>
                  </GridLabel>
                </div>
                <div>
                  <GridImgBox bg="#1a3a5c" style={{ overflow: "hidden" }}>
                    <img src="/caffeine.png" alt="카페인 부스트" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </GridImgBox>
                  <GridLabel>
                    <ItemName>카페인 부스트</ItemName>
                    <ItemSub>Caffeine</ItemSub>
                  </GridLabel>
                </div>
              </GridRow>
              <FlavorWide>
                <FlavorWideImg bg="#3a2010" style={{ overflow: "hidden" }}>
                  <img src="/acidity.png" alt="산미 에디션" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </FlavorWideImg>
                <ItemName>산미 에디션</ItemName>
                <ItemSub>Acidity</ItemSub>
              </FlavorWide>
            </FlavorSection>

            {/* Section 3: In Good Company */}
            <CompanySection ref={editorialReveal.ref}>
              <div css={revealUp(editorialReveal.visible)}>
                <CompanyTitle>In<br />Good<br /><em>Company</em></CompanyTitle>

                <CompanyGrid>
                  <GBox h={90} bg="#222"><Placeholder style={{ color: "rgba(255,255,255,0.15)" }}>Image</Placeholder></GBox>
                  <GBox h={90} bg="#e8743a"><Placeholder style={{ color: "rgba(255,255,255,0.3)" }}>Image</Placeholder></GBox>
                  <GBox h={90} bg="#1a1a1a"><Placeholder style={{ color: "rgba(255,255,255,0.15)" }}>Image</Placeholder></GBox>
                  <GBox h={120} span={2} bg="#181818"><Placeholder style={{ color: "rgba(255,255,255,0.15)" }}>Image</Placeholder></GBox>
                  <GBox h={120} bg="#e8743a"><Placeholder style={{ color: "rgba(255,255,255,0.3)" }}>Image</Placeholder></GBox>
                </CompanyGrid>

                <CompanyBody>
                  크리에이터, 큐레이터, 그리고<br />
                  더존바이오의 정신을 담아내는<br />
                  공간들과 함께합니다.
                </CompanyBody>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <MetaLine>From the Lab</MetaLine>
                  <MetaLine>Seoul · San Francisco</MetaLine>
                  <MetaLine>Est. 2025</MetaLine>
                </div>
              </div>
            </CompanySection>

            {/* Section 4: Leave No Trace */}
            <TraceSection ref={sustainReveal.ref}>
              <TraceTitle css={revealScale(sustainReveal.visible)}>
                <span>Leave</span>
              </TraceTitle>
              <TraceTitle css={revealScale(sustainReveal.visible, 0.1)}>
                <span>No</span>
                <TraceInline><Placeholder>Img</Placeholder></TraceInline>
                <span>Trace</span>
              </TraceTitle>
              <TraceBody>
                지속 가능한 원료 수급과 친환경 패키징으로
                자연에 흔적을 남기지 않습니다.
                우리가 아끼는 땅을 지키는 것,
                그것이 더존바이오의 약속입니다.
              </TraceBody>
            </TraceSection>

            {/* Section 5: Footer */}
            <FooterSection>
              <FtLabel>Stay in Focus</FtLabel>
              <FtBrand>LOCK-IN<br />COFFEE</FtBrand>
              <FtLogo src="/logo.png" alt="더존바이오" />

              <FtRow>
                <FtInput>이메일을 입력하세요</FtInput>
                <FtBtn>Subscribe</FtBtn>
              </FtRow>

              <FtLinks>
                <FtLink>Shop</FtLink>
                <FtLink>About</FtLink>
                <FtLink>Contact</FtLink>
                <FtLink>Instagram</FtLink>
              </FtLinks>

              <FtWatermark>focus is the new luxury</FtWatermark>

              <FtCopy>
                <span>© 2025 더존바이오</span>
                <span>Made with focus</span>
              </FtCopy>
            </FooterSection>

            </SubPageContent>
          </SubPageWrap>
        </ScrollableContent>
      </BottomSheet>
    </div>
  );
}

export default App;
