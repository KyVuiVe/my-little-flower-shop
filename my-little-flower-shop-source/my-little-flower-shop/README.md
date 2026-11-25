# 🌸 My Little Flower Shop – A Gift Made With Love

Mini game cửa hàng hoa tương tác xây dựng bằng **React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons + Supabase**.

## 1. Cấu trúc Source Code
- `src/components/`: 14+ component chuyên biệt (`FlowerShop`, `FlowerSelection`, `ColorPicker`, `BouquetBuilder`, `WrappingSelection`, `RibbonSelection`, `PhotoUploader`, `PhotoFrameEditor`, `LetterEditor`, `BouquetPreview`, `GiftPreview`, `GiftReceiver`, `GiftSharing`, `FlowerShopAssistant`, `FlowerIllustration`).
- `src/data/`: Tách riêng dữ liệu hoa (`flowers.ts`), màu sắc (`colors.ts`), giấy gói (`wrappingPapers.ts`), kiểu gói (`wrappingStyles.ts`), ruy băng (`ribbons.ts`), mẫu thiệp (`cardTemplates.ts`) và gợi ý của Florist (`floristTips.ts`).
- `src/lib/`: Tách riêng logic render & xuất PNG (`bouquetRenderer.ts`), xử lý ảnh trên trình duyệt (`imageProcessor.ts`), dịch vụ chia sẻ quà Supabase + Demo Mode (`giftService.ts`), lưu tiến trình (`storage.ts`), nhạc piano Web Audio (`pianoAudio.ts`).
- `supabase/schema.sql`: Toàn bộ cấu trúc bảng `bouquet_gifts`, RLS bảo mật, các hàm RPC (`get_gift_by_id`, `update_gift_with_token`, `delete_gift_with_token`, `submit_gift_thank_you`, `cleanup_expired_gifts`) và Storage bucket `gift-memories`.

## 2. Hướng dẫn cài đặt
Yêu cầu: **Node.js >= 18** và **npm**.

```bash
# Giải nén thư mục dự án và di chuyển vào bên trong
cd my-little-flower-shop

# Cài đặt thư viện
npm install
```

## 3. Hướng dẫn chạy Local
```bash
# (Tùy chọn) Tạo file biến môi trường cho Supabase
cp .env.example .env.local

# Chạy môi trường phát triển
npm run dev
```
Mở trình duyệt tại `http://localhost:5173`. Nếu chưa cấu hình Supabase, ứng dụng tự động bật **Chế độ Demo** và hiển thị thông báo rõ ràng khi tạo link quà.

## 4. Hướng dẫn cấu hình Supabase (Gửi link thật giữa các thiết bị)
1. Tạo project miễn phí tại [https://supabase.com](https://supabase.com).
2. Vào mục **SQL Editor** → tạo query mới → dán toàn bộ nội dung file `supabase/schema.sql` → bấm **Run**.
   - Script sẽ tự tạo bảng `bouquet_gifts` (có `id` dạng UUID, `edit_token` chỉ dành cho người tạo, `expires_at` mặc định 30 ngày), bật **Row Level Security** không cho phép liệt kê công khai, tạo các hàm RPC an toàn và tạo Storage Bucket `gift-memories`.
3. Vào **Project Settings → API**, copy **Project URL** và **anon public key**.
4. Dán vào file `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   VITE_GIFT_EXPIRY_DAYS=30
   ```
5. Khởi động lại `npm run dev`.
6. *(Tùy chọn)* Để tự động dọn quà hết hạn mỗi ngày, bật extension `pg_cron` trên Supabase và chạy:
   ```sql
   select cron.schedule('cleanup-expired-gifts', '0 3 * * *', $$select public.cleanup_expired_gifts();$$);
   ```

## 5. Hướng dẫn Deploy lên Vercel hoặc Netlify

### Deploy lên Vercel (Khuyến nghị)
1. Đẩy thư mục dự án lên GitHub.
2. Vào [https://vercel.com](https://vercel.com) → **Add New Project** → chọn repo `my-little-flower-shop`.
3. Trong mục **Environment Variables**, thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
4. Bấm **Deploy**. File `vercel.json` đã cấu hình sẵn SPA rewrite cho đường dẫn `/gift/:giftId`.

### Deploy lên Netlify
1. Kết nối repo GitHub trên [https://app.netlify.com](https://app.netlify.com).
2. Build command: `npm run build`, Publish directory: `dist` (đã cấu hình sẵn trong `netlify.toml`).
3. Thêm biến môi trường `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong **Site settings → Environment variables**.

## 6. Hướng dẫn gửi món quà cho người khác
1. Lần lượt hoàn thành 6 bước: Chọn hoa → Chọn giấy gói (1–3 lớp) → Chọn kiểu gói → Thắt ruy băng → Gắn ảnh kỷ niệm (tùy chọn) → Viết thiệp & ký tên.
2. Ở màn hình **Final Stage – Your Masterpiece**, bạn có thể nhấn **Preview Gift** để xem hiệu ứng hoa nở kèm cánh hoa bay, hoặc **Save Image** để tải ảnh PNG.
3. Nhấn **Send Your Gift** → bấm **Tạo link món quà ngay**.
4. Copy đường link dạng `https://yourwebsite.com/gift/<uuid>` và gửi qua Messenger, Zalo hoặc Instagram cho người thương.
5. Khi người nhận mở link, họ sẽ thấy hộp quà tương tác, nhấn để mở bó hoa + thiệp, tải ảnh PNG và gửi lại lời cảm ơn cho bạn!
