import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Mail, MailOpen, PenTool, Sparkles } from 'lucide-react';
import { CARD_TEMPLATES, getCardTemplate, LETTER_STICKERS } from '../data/cardTemplates';
import { LETTER_TEXT_COLORS } from '../data/colors';
import { CardFontId, LetterConfig, StickerId } from '../types/bouquet';

interface LetterEditorProps {
  letter: LetterConfig;
  onChange: (next: LetterConfig) => void;
}

const FONT_OPTIONS: { id: CardFontId; label: string; className: string }[] = [
  { id: 'script', label: 'Viết tay (Dancing Script)', className: 'font-script' },
  { id: 'serif', label: 'Cổ điển (Playfair)', className: 'font-serif' },
  { id: 'sans', label: 'Hiện đại (Be Vietnam)', className: 'font-sans' },
];

export const LetterEditor: React.FC<LetterEditorProps> = ({ letter, onChange }) => {
  const [isCardOpen, setIsCardOpen] = useState(true);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  const template = getCardTemplate(letter.template);
  const fontClass =
    letter.font === 'script' ? 'font-script text-lg' : letter.font === 'serif' ? 'font-serif' : 'font-sans';

  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (!canvas || !letter.signatureDataUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = letter.signatureDataUrl;
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.strokeStyle = letter.textColor;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!drawingRef.current || !sigCanvasRef.current) return;
    drawingRef.current = false;
    onChange({ ...letter, signatureDataUrl: sigCanvasRef.current.toDataURL('image/png') });
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }
    onChange({ ...letter, signatureDataUrl: null });
  };

  const addSticker = (type: StickerId) => {
    if (letter.stickers.length >= 10) return;
    const x = 12 + ((letter.stickers.length * 19) % 76);
    const y = 12 + ((letter.stickers.length * 23) % 72);
    onChange({
      ...letter,
      stickers: [...letter.stickers, { id: `st-${Date.now()}`, type, x, y }],
    });
  };

  const removeSticker = (id: string) => {
    onChange({
      ...letter,
      stickers: letter.stickers.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-semibold text-burgundy">Viết thiệp gửi yêu thương</h2>
          <p className="text-xs text-burgundy/70">Chọn mẫu thiệp, dán sticker và ký tên viết tay của riêng bạn</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCardOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/30 bg-white px-3.5 py-1.5 text-xs font-semibold text-burgundy shadow-sm hover:bg-cream"
        >
          {isCardOpen ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
          {isCardOpen ? 'Đóng phong bì' : 'Mở thiệp ra'}
        </button>
      </div>

      {/* Live Animated Card Preview */}
      <div className="relative overflow-hidden rounded-3xl border border-dusty-pink/40 bg-cream/60 p-4">
        <motion.div
          animate={{ scale: isCardOpen ? 1 : 0.94 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="mx-auto max-w-md"
        >
          {!isCardOpen ? (
            <button
              type="button"
              onClick={() => setIsCardOpen(true)}
              className="relative flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 shadow-cozy transition hover:brightness-95"
              style={{
                backgroundColor: template.envelopeHex,
                borderColor: template.borderHex,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-20 rounded-t-2xl opacity-75"
                style={{
                  backgroundColor: template.envelopeFlapHex,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />
              <span className="z-10 mt-6 rounded-full bg-white/90 px-4 py-1.5 font-serif text-sm font-semibold text-burgundy shadow">
                Gửi đến: {letter.recipientName || 'Người thương của bạn'} 💌
              </span>
              <span className="z-10 mt-2 text-xs text-burgundy/80">Nhấn để mở thiệp</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative min-h-[220px] rounded-2xl border-2 p-5 shadow-cozy ${template.bgClass}`}
              style={{ borderColor: template.borderHex, color: letter.textColor }}
            >
              {/* Stickers overlay (click to remove) */}
              {letter.stickers.map((st) => {
                const emoji = LETTER_STICKERS.find((s) => s.id === st.type)?.emoji ?? '💗';
                return (
                  <button
                    key={st.id}
                    type="button"
                    title="Nhấn để gỡ sticker"
                    onClick={() => removeSticker(st.id)}
                    className="absolute text-lg transition hover:scale-125"
                    style={{ left: `${st.x}%`, top: `${st.y}%` }}
                  >
                    {emoji}
                  </button>
                );
              })}

              <p className="text-[11px] uppercase tracking-widest opacity-65">My Little Flower Shop</p>
              <p className={`mt-2 font-semibold ${fontClass}`}>
                Gửi {letter.recipientName || 'người thương'},
              </p>
              <p className={`mt-2 whitespace-pre-wrap leading-relaxed ${fontClass}`}>
                {letter.message || 'Cảm ơn bạn đã luôn mang đến những điều dịu dàng nhất. Chúc bạn một ngày thật ấm áp như bó hoa này nhé!'}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-xs opacity-65">A gift made with love</span>
                <div className="text-right">
                  {letter.signatureDataUrl && (
                    <img
                      src={letter.signatureDataUrl}
                      alt="Chữ ký viết tay"
                      className="ml-auto h-10 w-auto object-contain"
                    />
                  )}
                  <p className={`font-semibold ${fontClass}`}>— {letter.senderName || 'Từ một người thương bạn'}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 5 Card Templates */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {CARD_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onChange({ ...letter, template: tpl.id, textColor: tpl.defaultTextColor })}
            className={`rounded-xl border px-2.5 py-2 text-center text-xs transition ${
              letter.template === tpl.id
                ? 'border-burgundy bg-burgundy text-cream font-semibold'
                : 'border-dusty-pink/40 bg-white text-burgundy hover:bg-cream'
            }`}
          >
            {tpl.nameVi}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={letter.recipientName}
          onChange={(e) => onChange({ ...letter, recipientName: e.target.value })}
          placeholder="Tên người nhận..."
          className="rounded-xl border border-dusty-pink/60 bg-white px-3.5 py-2 text-sm text-burgundy focus:border-burgundy focus:outline-none"
        />
        <input
          type="text"
          value={letter.senderName}
          onChange={(e) => onChange({ ...letter, senderName: e.target.value })}
          placeholder="Tên người gửi..."
          className="rounded-xl border border-dusty-pink/60 bg-white px-3.5 py-2 text-sm text-burgundy focus:border-burgundy focus:outline-none"
        />
      </div>

      <textarea
        rows={3}
        value={letter.message}
        onChange={(e) => onChange({ ...letter, message: e.target.value })}
        placeholder="Viết lời chúc ngọt ngào của bạn tại đây..."
        className="w-full rounded-2xl border border-dusty-pink/60 bg-white p-3.5 text-sm text-burgundy focus:border-burgundy focus:outline-none"
      />

      {/* Font, Color, Stickers */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dusty-pink/40 bg-white/80 p-3.5 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-burgundy/80">Font chữ:</p>
          <div className="flex flex-wrap gap-1.5">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ ...letter, font: f.id })}
                className={`rounded-full border px-2.5 py-1 text-xs ${
                  letter.font === f.id
                    ? 'border-burgundy bg-burgundy text-cream'
                    : 'border-dusty-pink/40 bg-white text-burgundy'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-burgundy/80">Màu mực:</p>
          <div className="flex flex-wrap gap-2">
            {LETTER_TEXT_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ ...letter, textColor: c.hex })}
                title={c.nameVi}
                className={`h-6 w-6 rounded-full border-2 ${
                  letter.textColor === c.hex ? 'border-burgundy scale-110' : 'border-white shadow'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 border-t border-dusty-pink/30 pt-2.5">
          <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-burgundy/80">
            <Sparkles className="h-3.5 w-3.5" /> Thêm sticker lên thiệp (nhấn sticker trên thiệp để gỡ):
          </p>
          <div className="flex flex-wrap gap-2">
            {LETTER_STICKERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => addSticker(s.id)}
                className="rounded-full border border-dusty-pink/50 bg-cream/70 px-3 py-1 text-xs text-burgundy hover:bg-dusty-pink/30"
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Handwritten Signature Pad */}
      <div className="rounded-2xl border border-dusty-pink/40 bg-white/85 p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-burgundy">
            <PenTool className="h-3.5 w-3.5" /> Chữ ký viết tay cuối thiệp
          </span>
          <button
            type="button"
            onClick={clearSignature}
            className="inline-flex items-center gap-1 text-xs text-burgundy/70 hover:text-burgundy"
          >
            <Eraser className="h-3.5 w-3.5" /> Xóa chữ ký
          </button>
        </div>
        <canvas
          ref={sigCanvasRef}
          width={360}
          height={90}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="h-24 w-full touch-none rounded-xl border border-dashed border-dusty-pink bg-cream/40 cursor-crosshair"
        />
      </div>
    </div>
  );
};
