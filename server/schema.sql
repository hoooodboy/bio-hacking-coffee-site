-- Supabase SQL Editor에서 실행

-- 유저 프로필 테이블
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  email text,
  address text,
  address_detail text,
  zip_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 주문 테이블
create table if not exists orders (
  id bigserial primary key,
  order_id text unique not null,
  user_id uuid references users(id),
  payment_key text,
  amount integer not null,
  status text default 'DONE',
  method text,
  order_name text,
  customer_name text,
  customer_phone text,
  customer_email text,
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_address_detail text,
  shipping_zip_code text,
  shipping_memo text,
  shipping_status text default 'pending',
  tracking_number text,
  approved_at timestamptz,
  raw_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS (Row Level Security) 활성화
alter table users enable row level security;
alter table orders enable row level security;

-- 서비스 키로 모든 접근 허용 (서버에서만 사용)
create policy "Service role full access on users"
  on users for all
  using (true)
  with check (true);

create policy "Service role full access on orders"
  on orders for all
  using (true)
  with check (true);

-- 재고 테이블
create table if not exists inventory (
  id bigserial primary key,
  product_key text unique not null,
  product_name text not null,
  stock integer not null default 0,
  reserved integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create policy "Service role full access on inventory"
  on inventory for all
  using (true)
  with check (true);

alter table inventory enable row level security;

-- 초기 재고 데이터
insert into inventory (product_key, product_name, stock) values
  ('trial-signature', '100ml 체험 키트 - Signature 디카페인', 30),
  ('trial-house', '100ml 체험 키트 - House 카페인', 30),
  ('trial-vibrant', '100ml 체험 키트 - Vibrant 산미', 30)
on conflict (product_key) do nothing;

-- 인덱스
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_order_id on orders(order_id);
create index if not exists idx_orders_customer_phone on orders(customer_phone);
create index if not exists idx_inventory_product_key on inventory(product_key);
