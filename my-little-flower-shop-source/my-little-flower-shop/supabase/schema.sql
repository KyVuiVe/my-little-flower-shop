-- ============================================================
-- MY LITTLE FLOWER SHOP — SUPABASE SCHEMA & SECURITY POLICIES
-- Chạy toàn bộ script này trong Supabase SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- 1. Bảng lưu món quà (bouquet_gifts)
create table if not exists public.bouquet_gifts (
  id uuid primary key default gen_random_uuid(),
  edit_token uuid not null default gen_random_uuid(),
  bouquet_config jsonb not null,
  letter_config jsonb not null,
  photo_memories jsonb not null default '[]'::jsonb,
  recipient_name text not null default '',
  sender_name text not null default '',
  thank_you_message text,
  thank_you_reaction text,
  thank_you_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create index if not exists idx_bouquet_gifts_expires_at on public.bouquet_gifts (expires_at);

-- 2. Bật Row Level Security (RLS)
alter table public.bouquet_gifts enable row level security;

-- Không cho phép liệt kê (SELECT *) danh sách quà công khai để bảo vệ ảnh cá nhân.
-- Người nhận chỉ có thể truy vấn đúng 1 món quà thông qua RPC get_gift_by_id(gift_id).
create policy "Allow insert new gifts"
  on public.bouquet_gifts
  for insert
  to anon, authenticated
  with check (true);

-- 3. RPC xem quà bằng UUID (chỉ trả về quà còn hạn, KHÔNG trả về edit_token)
create or replace function public.get_gift_by_id(p_gift_id uuid)
returns table (
  id uuid,
  bouquet_config jsonb,
  letter_config jsonb,
  photo_memories jsonb,
  recipient_name text,
  sender_name text,
  thank_you_message text,
  thank_you_reaction text,
  thank_you_at timestamptz,
  created_at timestamptz,
  expires_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    g.id,
    g.bouquet_config,
    g.letter_config,
    g.photo_memories,
    g.recipient_name,
    g.sender_name,
    g.thank_you_message,
    g.thank_you_reaction,
    g.thank_you_at,
    g.created_at,
    g.expires_at
  from public.bouquet_gifts g
  where g.id = p_gift_id
    and g.expires_at > now();
$$;

-- 4. RPC chỉnh sửa quà (chỉ người tạo có edit_token mới được sửa)
create or replace function public.update_gift_with_token(
  p_gift_id uuid,
  p_edit_token uuid,
  p_bouquet_config jsonb,
  p_letter_config jsonb,
  p_photo_memories jsonb,
  p_recipient_name text,
  p_sender_name text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer;
begin
  update public.bouquet_gifts
  set
    bouquet_config = p_bouquet_config,
    letter_config = p_letter_config,
    photo_memories = p_photo_memories,
    recipient_name = p_recipient_name,
    sender_name = p_sender_name
  where id = p_gift_id
    and edit_token = p_edit_token
    and expires_at > now();

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

-- 5. RPC xóa quà (chỉ người tạo có edit_token)
create or replace function public.delete_gift_with_token(
  p_gift_id uuid,
  p_edit_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.bouquet_gifts
  where id = p_gift_id
    and edit_token = p_edit_token;

  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

-- 6. RPC gửi lời cảm ơn từ người nhận (chỉ cho phép cập nhật lời cảm ơn, không sửa bó hoa)
create or replace function public.submit_gift_thank_you(
  p_gift_id uuid,
  p_reaction text,
  p_message text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer;
begin
  update public.bouquet_gifts
  set
    thank_you_reaction = left(coalesce(p_reaction, ''), 40),
    thank_you_message = left(coalesce(p_message, ''), 500),
    thank_you_at = now()
  where id = p_gift_id
    and expires_at > now();

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

-- 7. Hàm dọn dẹp quà hết hạn (có thể chạy qua pg_cron hoặc Scheduled Function)
create or replace function public.cleanup_expired_gifts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from public.bouquet_gifts where expires_at <= now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.get_gift_by_id(uuid) to anon, authenticated;
grant execute on function public.update_gift_with_token(uuid, uuid, jsonb, jsonb, jsonb, text, text) to anon, authenticated;
grant execute on function public.delete_gift_with_token(uuid, uuid) to anon, authenticated;
grant execute on function public.submit_gift_thank_you(uuid, text, text) to anon, authenticated;

-- 8. Storage Bucket cho ảnh photocard cá nhân (không cho phép list thư mục công khai)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gift-memories',
  'gift-memories',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Cho phép upload ảnh vào bucket gift-memories
create policy "Allow upload gift memories"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'gift-memories');

-- Cho phép đọc từng file ảnh trực tiếp theo đường dẫn UUID (không bật list)
create policy "Allow read individual gift memory"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gift-memories');
