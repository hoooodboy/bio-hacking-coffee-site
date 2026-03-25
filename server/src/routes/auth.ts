import { Router, Request, Response } from "express";
import { supabase } from "../supabase";
import jwt from "jsonwebtoken";

const router = Router();

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || "";
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET || "";
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || "https://bio-hacking-coffee-api.onrender.com/api/auth/kakao/callback";
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-change-in-production";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://www.thezone.bio";

// JWT 토큰 생성 (7일 유효)
function generateToken(userId: string, kakaoId: string): string {
  return jwt.sign({ userId, kakaoId }, JWT_SECRET, { expiresIn: "7d" });
}

// JWT 토큰 검증 미들웨어
export function verifyToken(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; kakaoId: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// 카카오 로그인 URL 생성
router.get("/kakao", (_req: Request, res: Response) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code&scope=profile_nickname,account_email`;
  res.json({ url: kakaoAuthUrl });
});

// 카카오 OAuth 콜백
router.get("/kakao/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    res.redirect(`${FRONTEND_URL}?auth=error&message=no_code`);
    return;
  }

  try {
    // 1. 카카오 토큰 발급
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code as string,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Kakao token error:", tokenData);
      res.redirect(`${FRONTEND_URL}?auth=error&message=token_failed`);
      return;
    }

    // 2. 카카오 사용자 정보 조회
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json() as {
      id: number;
      kakao_account?: {
        email?: string;
        profile?: { nickname?: string };
      };
    };

    if (!userRes.ok) {
      console.error("Kakao user info error:", userData);
      res.redirect(`${FRONTEND_URL}?auth=error&message=user_info_failed`);
      return;
    }

    const kakaoId = userData.id.toString();
    const email = userData.kakao_account?.email || null;
    const name = userData.kakao_account?.profile?.nickname || null;

    // 3. DB에서 기존 사용자 확인 또는 새로 생성
    let { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("kakao_id", kakaoId)
      .single();

    let userId: string;

    if (findError || !existingUser) {
      // 신규 사용자 생성
      const newUserId = crypto.randomUUID();
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: newUserId,
          kakao_id: kakaoId,
          email,
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError || !newUser) {
        console.error("User insert error:", insertError);
        res.redirect(`${FRONTEND_URL}?auth=error&message=db_error`);
        return;
      }

      userId = newUserId;
    } else {
      userId = existingUser.id;
      // 기존 사용자 정보 업데이트 (이메일/이름이 변경되었을 수 있음)
      await supabase
        .from("users")
        .update({ email: email || existingUser.email, name: name || existingUser.name, updated_at: new Date().toISOString() })
        .eq("id", userId);
    }

    // 4. JWT 토큰 발급
    const token = generateToken(userId, kakaoId);

    // 5. 프론트엔드로 리다이렉트 (토큰 전달)
    res.redirect(`${FRONTEND_URL}?auth=success&token=${token}`);
  } catch (error) {
    console.error("Kakao callback error:", error);
    res.redirect(`${FRONTEND_URL}?auth=error&message=server_error`);
  }
});

// 토큰 검증 및 사용자 정보 반환
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 로그아웃 (클라이언트에서 토큰 삭제하면 됨, 서버에서는 카카오 연결 해제 옵션)
router.post("/logout", verifyToken, async (req: Request, res: Response) => {
  // JWT는 stateless이므로 서버에서 할 일은 없음
  // 필요 시 카카오 로그아웃 API 호출 가능
  res.json({ success: true });
});

// 회원 탈퇴
router.delete("/withdraw", verifyToken, async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  try {
    // 주문 내역은 보존 (user_id를 null로)
    await supabase
      .from("orders")
      .update({ user_id: null })
      .eq("user_id", userId);

    // 사용자 삭제
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 토큰 갱신 (선택적)
router.post("/refresh", verifyToken, async (req: Request, res: Response) => {
  const { userId, kakaoId } = (req as any).user;
  const newToken = generateToken(userId, kakaoId);
  res.json({ token: newToken });
});

export { router as authRouter };
