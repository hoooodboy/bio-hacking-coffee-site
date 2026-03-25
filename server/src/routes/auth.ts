import { Router, Request, Response } from "express";
import { supabase } from "../supabase";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-change-in-production";

// JWT 토큰 생성 (7일 유효)
function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// 회원가입
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
    return;
  }

  try {
    // 이메일 중복 확인
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      res.status(400).json({ error: "이미 가입된 이메일입니다." });
      return;
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10);

    // 사용자 생성
    const userId = crypto.randomUUID();
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        password_hash: passwordHash,
        name: name || null,
        phone: phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "회원가입에 실패했습니다." });
      return;
    }

    // JWT 토큰 발급
    const token = generateToken(userId, email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
    return;
  }

  try {
    // 사용자 조회
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
      return;
    }

    // 비밀번호 확인
    const isValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isValid) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
      return;
    }

    // JWT 토큰 발급
    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        address_detail: user.address_detail,
        zip_code: user.zip_code,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 토큰 검증 및 사용자 정보 반환
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, phone, address, address_detail, zip_code, created_at")
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

// 회원정보 수정
router.patch("/me", verifyToken, async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const { name, phone, address, address_detail, zip_code } = req.body;

  try {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (address_detail !== undefined) updates.address_detail = address_detail;
    if (zip_code !== undefined) updates.zip_code = zip_code;

    const { data: user, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, email, name, phone, address, address_detail, zip_code")
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 비밀번호 변경
router.post("/change-password", verifyToken, async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "현재 비밀번호와 새 비밀번호를 입력해주세요." });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "새 비밀번호는 6자 이상이어야 합니다." });
    return;
  }

  try {
    // 현재 비밀번호 확인
    const { data: user, error } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single();

    if (error || !user) {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash || "");
    if (!isValid) {
      res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
      return;
    }

    // 새 비밀번호 해싱 및 저장
    const newHash = await bcrypt.hash(newPassword, 10);
    await supabase
      .from("users")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", userId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post("/logout", (_req: Request, res: Response) => {
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

export { router as authRouter };
