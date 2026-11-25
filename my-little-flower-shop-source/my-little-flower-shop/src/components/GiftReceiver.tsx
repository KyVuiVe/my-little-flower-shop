import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Gift, Heart, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getCardTemplate } from '../data/cardTemplates';
import { exportSvgToPng } from '../lib/bouquetRenderer';
import { fetchSharedGift, sendThankYouReply } from '../lib/giftService';
import { BouquetDesign, SharedGiftRecord } from '../types/bouquet';
import { BouquetPreview } from './BouquetPreview';

const REACTIONS = ['🥰 Xúc động quá!', '💐 Đẹp tuyệt vời!', '💗 Cảm ơn bạn nhiều!', '🥹 Mình rất thích!'];

export const GiftReceiver: React.FC = () => {
  const { giftId } = useParams<{ giftId: string }>();
  const svgRef = useRef<SVGSVGElement>(null);

  const [loading, setLoading] = useState(true);
  const [gift, setGift] = useState<SharedGiftRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const [reaction, setReaction] = useState(REACTIONS[0]);
  const [thankYouText, setThankYouText] = useState('');
  const [thankYouSent, setThankYouSent] = useState(false);

  useEffect(() => {
    if (!giftId) {
      setLoading(false);
      setError('Đường link món quà không hợp lệ.');
      return;
    }
    let mounted = true;
    fetchSharedGift(giftId)
      .then(({ gift: found }) => {
        if (!mounted) return;
        if (!found) {
          setError('Món quà không tồn tại hoặc đã hết hạn lưu trữ.');
        } else {
          setGift(found);
          if (found.thank_you_message) setThankYouSent(true);
        }
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Không thể mở món quà.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [giftId]);

  const handleOpenBox = () => {
    setOpened(true);
    confetti({
      particleCount: 70,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#E9B8BE', '#A8B59B', '#F5DFA8', '#813C4A'],
    });
  };

  const handleSendThankYou = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftId || !thankYouText.trim()) return;
    const ok = await sendThankYouReply(giftId, reaction, thankYouText.trim());
    if (ok) setThankYouSent(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-6 text-center">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-dusty-pink/40 text-burgundy"
        >
          <Gift className="h-8 w-8" />
        </motion.div>
        <p className="font-serif text-lg text-burgundy">Đang mang bó hoa từ tiệm đến cho bạn...</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-6 text-center">
        <div className="max-w-md rounded-3xl border border-dusty-pink bg-white p-8 shadow-cozy">
          <h1 className="font-serif text-2xl font-bold text-burgundy">Không tìm thấy món quà</h1>
          <p className="mt-2 text-sm text-burgundy/75">{error || 'Đường link có thể đã hết hạn hoặc không tồn tại.'}</p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-cream"
          >
            <ArrowLeft className="h-4 w-4" /> Ghé My Little Flower Shop
          </Link>
        </div>
      </div>
    );
  }

  const fullDesign: BouquetDesign = {
    ...gift.bouquet_config,
    photos: gift.photo_memories ?? [],
    letter: gift.letter_config,
  };
  const template = getCardTemplate(fullDesign.letter.template);

  return (
    <div className="min-h-screen bg-cream paper-grain px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Tự tay gói một bó hoa khác
          </Link>
          <span className="font-serif text-sm font-semibold text-burgundy">My Little Flower Shop</span>
        </div>

        {!opened ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dusty-pink bg-white/90 p-10 text-center shadow-cozy"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, rotate: [-2, 2, -2] }}
              whileTap={{ scale: 0.94 }}
              onClick={handleOpenBox}
              className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-dusty-pink to-soft-yellow shadow-lg"
            >
              <Gift className="h-16 w-16 text-burgundy" />
            </motion.button>
            <h1 className="mt-6 font-serif text-2xl font-bold text-burgundy">
              Bạn có một món quà đặc biệt!
            </h1>
            <p className="mt-2 text-sm text-burgundy/75">
              <strong>{gift.sender_name || 'Một người thương bạn'}</strong> đã tự tay chọn hoa và viết thiệp gửi đến{' '}
              <strong>{gift.recipient_name || 'bạn'}</strong>.
            </p>
            <button
              type="button"
              onClick={handleOpenBox}
              className="mt-6 rounded-full bg-burgundy px-7 py-3 text-sm font-semibold text-cream shadow-cozy hover:bg-burgundy/90"
            >
              Mở hộp quà ngay ✨
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-dusty-pink/50 bg-white/85 p-5 shadow-cozy">
                <BouquetPreview ref={svgRef} design={fullDesign} revealAnimation />
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      svgRef.current &&
                      void exportSvgToPng(
                        svgRef.current,
                        `gift-for-${gift.recipient_name || 'you'}.png`,
                        gift.recipient_name,
                        gift.sender_name
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-sage-green px-5 py-2 text-xs font-semibold text-white shadow hover:brightness-95"
                  >
                    <Download className="h-4 w-4" /> Tải ảnh bó hoa (PNG)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className={`rounded-3xl border-2 p-6 shadow-cozy ${template.bgClass}`}
                  style={{ borderColor: template.borderHex, color: fullDesign.letter.textColor }}
                >
                  <p className="font-script text-2xl font-bold">
                    Gửi {gift.recipient_name || 'người thương'},
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                    {fullDesign.letter.message || 'Gửi bạn thật nhiều yêu thương cùng bó hoa nhỏ này!'}
                  </p>
                  <div className="mt-5 text-right">
                    {fullDesign.letter.signatureDataUrl && (
                      <img src={fullDesign.letter.signatureDataUrl} alt="Chữ ký" className="ml-auto h-10" />
                    )}
                    <p className="font-script text-xl font-bold">— {gift.sender_name || 'Người thương bạn'}</p>
                  </div>
                </div>

                {/* Thank you reply form */}
                <div className="rounded-3xl border border-dusty-pink/50 bg-white/90 p-5 shadow-paper">
                  <h3 className="flex items-center gap-1.5 font-serif text-lg font-semibold text-burgundy">
                    <Heart className="h-4 w-4 text-dusty-pink fill-dusty-pink" /> Gửi lời cảm ơn
                  </h3>
                  {thankYouSent ? (
                    <p className="mt-2 rounded-2xl bg-sage-green/20 p-3 text-xs text-burgundy">
                      ✓ Lời cảm ơn của bạn đã được gửi lại cho {gift.sender_name || 'người tặng'}!
                    </p>
                  ) : (
                    <form onSubmit={(e) => void handleSendThankYou(e)} className="mt-3 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {REACTIONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReaction(r)}
                            className={`rounded-full border px-2.5 py-1 text-xs ${
                              reaction === r
                                ? 'border-burgundy bg-burgundy text-cream'
                                : 'border-dusty-pink/40 bg-cream/60 text-burgundy'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        value={thankYouText}
                        onChange={(e) => setThankYouText(e.target.value)}
                        placeholder="Viết vài lời cảm ơn gửi lại người tặng nhé..."
                        className="w-full rounded-xl border border-dusty-pink/60 bg-cream/40 p-2.5 text-xs text-burgundy focus:border-burgundy focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-cream hover:bg-burgundy/90"
                      >
                        <Send className="h-3.5 w-3.5" /> Gửi lời cảm ơn
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
