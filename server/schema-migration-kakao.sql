-- ============================================
-- 카카오 로그인을 위한 스키마 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. users 테이블에 kakao_id 필드 추가
-- (기존 auth.users 연결을 끊고 독립적인 테이블로 변경)
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- kakao_id 컬럼 추가 (없는 경우)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS kakao_id TEXT UNIQUE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);

-- 2. id 컬럼 타입 변경 (uuid로 유지, 기본값 추가)
-- 참고: 이미 uuid 타입이면 무시됨
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. orders 테이블의 user_id 외래키 제약조건 업데이트
-- 기존 제약 조건 삭제 (있는 경우)
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 새로운 외래키 추가 (ON DELETE SET NULL로 탈퇴 시에도 주문 보존)
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 확인 쿼리 (선택사항)
-- ============================================
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users';
