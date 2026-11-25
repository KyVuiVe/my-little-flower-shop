import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Download, Edit3, Eye, Send } from 'lucide-react';
import { getCardTemplate } from '../data/cardTemplates';
import { exportSvgToPng } from '../lib/bouquetRenderer';
import { BouquetDesign } from '../types/bouquet';
import { BouquetPreview } from './BouquetPreview';
import { GiftSharing } from './GiftSharing';

interface GiftPreviewProps {
  design: BouquetDesign;
  onEditBouquet: () => void;
}

export const GiftPreview: React.FC<GiftPreviewProps> = ({ design, onEditBouquet }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [revealKey, setRevealKey] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [savingPng, setSavingPng] = useState(false);

  const template = getCardTemplate(design.letter.template);

  const handlePreviewGift = () => {
    setRevealKey((k) => k + 1);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#E9B8BE', '#A8B59B', '#F5DFA8', '#813C4A'],
    });
  };

  const handleSaveImage = async () => {
    if (!svgRef.current) return;
    setSavingPng(true);
    try {
      await exportSvgToPng(
        svgRef.current,
        `my-little-flower-shop-${Date.now()}.png`,
        design.letter.recipientName,
        design.letter.senderName
      );
    } finally {
      setSavingPng(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block rounded-full bg-soft-yellow/60 px-3.5 py-1 text-xs font-semibold text-burgundy">
          Final Stage • Your Masterpiece
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold text-burgundy">
          Món quà dành riêng cho {design.letter.recipientName || 'người thương'}
        </h2>
        <p className="mt-1 text-sm text-burgundy/75">
          Từ: <strong>{design.letter.senderName || 'Một trái tim ấm áp'}</strong>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePreviewGift}
          className="inline-flex items-center gap-2 rounded-full border border-burgundy/30 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy shadow-sm hover:bg-cream"
        >
          <Eye className="h-4 w-4" /> Preview Gift
        </button>
        <button
          type="button"
          onClick={onEditBouquet}
          className="inline-flex items-center gap-2 rounded-full border border-burgundy/30 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy shadow-sm hover:bg-cream"
        >
          <Edit3 className="h-4 w-4" /> Edit Bouquet
        </button>
        <button
          type="button"
          disabled={savingPng}
          onClick={() => void handleSaveImage()}
          className="inline-flex items-center gap-2 rounded-full bg-sage-green px-5 py-2.5 text-sm font-semibold text-white shadow-cozy hover:brightness-95 disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> {savingPng ? 'Đang xuất PNG...' : 'Save Image'}
        </button>
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-2.5 text-sm font-semibold text-cream shadow-cozy hover:bg-burgundy/90"
        >
          <Send className="h-4 w-4" /> Send Your Gift
        </button>
      </div>

      {/* Masterpiece Showcase */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <motion.div
          key={revealKey}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="rounded-3xl border border-dusty-pink/50 bg-white/80 p-5 shadow-cozy"
        >
          <BouquetPreview ref={svgRef} design={design} revealAnimation />
        </motion.div>

        <div className="space-y-4">
          {/* Letter Card */}
          <div
            className={`rounded-3xl border-2 p-6 shadow-cozy ${template.bgClass}`}
            style={{ borderColor: template.borderHex, color: design.letter.textColor }}
          >
            <p className="text-[11px] uppercase tracking-widest opacity-60">Thiệp gửi kèm bó hoa</p>
            <p className="mt-2 font-script text-2xl font-bold">
              Gửi {design.letter.recipientName || 'người thương'},
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {design.letter.message || 'Một bó hoa nhỏ được gói bằng thật nhiều yêu thương dành tặng riêng bạn.'}
            </p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-xs opacity-60">My Little Flower Shop</span>
              <div className="text-right">
                {design.letter.signatureDataUrl && (
                  <img
                    src={design.letter.signatureDataUrl}
                    alt="Chữ ký"
                    className="ml-auto h-11 w-auto object-contain"
                  />
                )}
                <p className="font-script text-xl font-bold">
                  — {design.letter.senderName || 'Người thương bạn'}
                </p>
              </div>
            </div>
          </div>

          {/* Photo Memories Strip */}
          {design.photos.length > 0 && (
            <div className="rounded-3xl border border-dusty-pink/40 bg-white/80 p-4">
              <p className="mb-2 text-xs font-semibold text-burgundy">Ảnh kỷ niệm đính kèm</p>
              <div className="flex flex-wrap gap-3">
                {design.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="w-24 rounded-xl border border-dusty-pink/40 bg-cream p-1.5 text-center shadow-sm"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="h-20 w-full rounded-lg object-cover"
                    />
                    <p className="mt-1 truncate font-script text-xs text-burgundy">
                      {photo.caption || 'Kỷ niệm'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showShareModal && (
        <GiftSharing design={design} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};
