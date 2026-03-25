-- 이메일/비밀번호 로그인을 위한 스키마 마이그레이션
-- Supabase SQL Editor에서 실행

-- 1. users 테이블 수정 (auth.users 연결 해제)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. password_hash 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 3. id 기본값 추가
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. email에 unique 제약 추가
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- 5. orders 외래키 업데이트 (탈퇴해도 주문 보존)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- 6. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
