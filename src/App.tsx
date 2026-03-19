import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: "Helvetica Neue", "Arial", "Pretendard", sans-serif;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
`;

const Overlay = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
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
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const FocusText = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: 24px;
  font-weight: 400;
  text-align: right;
  line-height: 1.2;

  em {
    font-style: italic;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 52px;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`;

const Logo = styled.img`
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

function App() {
  return (
    <Container>
      <Video autoPlay muted loop playsInline>
        <source src="/bg-video.mp4" type="video/mp4" />
      </Video>

      <Overlay>
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
          <Logo src="/logo.png" alt="더존바이오" />
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
      </Overlay>

      <FooterText>focus is the new luxury.</FooterText>
    </Container>
  );
}

export default App;
