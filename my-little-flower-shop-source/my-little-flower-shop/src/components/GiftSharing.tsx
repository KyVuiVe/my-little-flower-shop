import React, { useState } from 'react';
import { Check, Copy, ExternalLink, HeartHandshake, Loader2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSharedGift, CreateGiftResult, isSupabaseConfigured } from '../lib/giftService';
import { BouquetDesign } from '../types/bouquet';

interface GiftSharingProps {
  design: BouquetDesign;
  onClose: () => void;
}

export const GiftSharing: React.FC<GiftSharingProps> = ({ design, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateGiftResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateGift = async () => {
    setLoading(true);
    setError(null);
    try {
      const created = await createSharedGift(design);
      setResult(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo món quà.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = result.shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-dusty-pink bg-cream p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-burgundy">Gửi món quà đến người thương</h3>
            <p className="mt-1 text-xs text-burgundy/75">
              Tạo một đường link riêng kèm hiệu ứng mở hộp quà bất ngờ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-burgundy/70 hover:bg-dusty-pink/30"
          >
            Đóng
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-soft-yellow bg-soft-yellow/40 p-3 text-xs text-burgundy">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
            <div>
              <strong>Chế độ Demo (chưa cấu hình Supabase):</strong> Link tạo ra sẽ xem thử trực tiếp trên phiên hiện tại.
              Để gửi link hoạt động thật giữa hai thiết bị khác nhau, hãy cấu hình biến môi trường{' '}
              <code className="rounded bg-white/80 px-1">VITE_SUPABASE_URL</code> và{' '}
              <code className="rounded bg-white/80 px-1">VITE_SUPABASE_ANON_KEY</code> theo hướng dẫn trong{' '}
              <code className="rounded bg-white/80 px-1">README.md</code>.
            </div>
          </div>
        )}

        {!result ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-dusty-pink/50 bg-white/80 p-4 text-xs text-burgundy/85 space-y-1">
              <p><strong>Người nhận:</strong> {design.letter.recipientName || '(Chưa nhập tên)'}</p>
              <p><strong>Người gửi:</strong> {design.letter.senderName || '(Chưa nhập tên)'}</p>
              <p><strong>Số ảnh kỷ niệm:</strong> {design.photos.length} tấm</p>
              <p><strong>Bảo mật:</strong> Mỗi món quà có mã UUID riêng, không hiển thị công khai và tự hết hạn sau 30 ngày.</p>
            </div>

            {error && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}

            <button
              type="button"
              disabled={loading}
              onClick={() => void handleCreateGift()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy py-3 text-sm font-semibold text-cream shadow-cozy transition hover:bg-burgundy/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang gói hộp quà & tải ảnh kỷ niệm...
                </>
              ) : (
                <>
                  <HeartHandshake className="h-4 w-4" />
                  Tạo link món quà ngay
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-sage-green bg-white p-4">
              <p className="text-xs font-semibold text-sage-green">
                ✓ Hộp quà đã sẵn sàng! ({result.mode === 'supabase' ? 'Đã lưu lên Supabase' : 'Chế độ Demo'})
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={result.shareUrl}
                  className="flex-1 rounded-xl border border-dusty-pink/50 bg-cream/60 px-3 py-2 text-xs text-burgundy"
                />
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="inline-flex items-center gap-1 rounded-xl bg-burgundy px-3.5 py-2 text-xs font-semibold text-cream hover:bg-burgundy/90"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Đã copy' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-burgundy/65">
                Hết hạn vào: {new Date(result.expiresAt).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/gift/${result.id}`);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-dusty-pink px-4 py-2.5 text-xs font-semibold text-burgundy hover:bg-dusty-pink/80"
              >
                <ExternalLink className="h-4 w-4" />
                Mở xem như người nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
