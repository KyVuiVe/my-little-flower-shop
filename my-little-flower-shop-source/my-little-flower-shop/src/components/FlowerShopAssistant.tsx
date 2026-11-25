import React from 'react';
import { motion } from 'framer-motion';
import { getFloristTip } from '../data/floristTips';
import { BouquetDesign, ShopStage } from '../types/bouquet';

interface FlowerShopAssistantProps {
  stage: ShopStage;
  design: BouquetDesign;
}

export const FlowerShopAssistant: React.FC<FlowerShopAssistantProps> = ({ stage, design }) => {
  const tip = getFloristTip(stage, design);

  return (
    <div className="flex items-end gap-3 rounded-3xl border border-dusty-pink/50 bg-white/85 p-3 shadow-paper">
      {/* Cute 2D Florist Character SVG */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="shrink-0"
      >
        <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#FFF5E9" stroke="#E9B8BE" strokeWidth="2" />
          {/* Hair & Beret */}
          <path d="M 16 28 C 16 14, 48 14, 48 28 L 48 38 C 48 44, 16 44, 16 38 Z" fill="#6E473B" />
          <ellipse cx="34" cy="15" rx="15" ry="6" fill="#A8B59B" transform="rotate(-8 34 15)" />
          <circle cx="42" cy="14" r="3" fill="#E9B8BE" />
          {/* Face */}
          <circle cx="32" cy="31" r="12" fill="#FFE6D5" />
          <circle cx="27.5" cy="30" r="1.6" fill="#4A2E2B" />
          <circle cx="36.5" cy="30" r="1.6" fill="#4A2E2B" />
          <circle cx="24.5" cy="33" r="2.2" fill="#E9B8BE" opacity="0.7" />
          <circle cx="39.5" cy="33" r="2.2" fill="#E9B8BE" opacity="0.7" />
          <path d="M 29.5 34.5 Q 32 37, 34.5 34.5" fill="none" stroke="#813C4A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Apron */}
          <path d="M 20 44 Q 32 41, 44 44 L 46 58 Q 32 61, 18 58 Z" fill="#A8B59B" />
          <rect x="27" y="48" width="10" height="7" rx="2" fill="#FFF5E9" />
        </svg>
      </motion.div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-sage-green">
          Bé Florist Hana • Gợi ý cho bạn
        </p>
        <motion.p
          key={tip}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-0.5 text-xs leading-relaxed text-burgundy"
        >
          “{tip}”
        </motion.p>
      </div>
    </div>
  );
};
