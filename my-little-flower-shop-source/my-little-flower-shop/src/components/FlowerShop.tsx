import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import { BouquetBuilder } from './BouquetBuilder';

const FLOATING_PETALS = Array.from({ length: 10 }, (_, idx) => ({
  id: idx,
  left: `${8 + idx * 9}%`,
  delay: idx * 0.9,
  duration: 9 + (idx % 4) * 2,
  size: 10 + (idx % 3) * 4,
}));

export const FlowerShop: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream paper-grain">
      {/* Sunlit window ambient rays */}
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 12% 8%, rgba(245, 223, 168, 0.55) 0%, rgba(255, 245, 233, 0) 45%), radial-gradient(circle at 90% 15%, rgba(233, 184, 190, 0.35) 0%, rgba(255, 245, 233, 0) 42%)',
        }}
      />

      {/* Drifting petals */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {FLOATING_PETALS.map((petal) => (
          <motion.span
            key={petal.id}
            initial={{ y: -30, opacity: 0, rotate: 0 }}
            animate={{ y: '105vh', opacity: [0, 0.7, 0.65, 0], rotate: 320, x: [0, 24, -18, 12] }}
            transition={{
              repeat: Infinity,
              duration: petal.duration,
              delay: petal.delay,
              ease: 'linear',
            }}
            style={{ left: petal.left, width: petal.size, height: petal.size * 0.7 }}
            className="absolute rounded-full bg-dusty-pink/65 blur-[0.3px]"
          />
        ))}
      </div>

      {/* Cozy Shop Awning Header */}
      <header className="relative z-10 border-b border-dusty-pink/40 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-dusty-pink to-soft-yellow shadow-sm">
              <Sun className="h-5 w-5 text-burgundy" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-burgundy sm:text-2xl">
                My Little Flower Shop
              </h1>
              <p className="font-script text-sm text-burgundy/75">
                A Gift Made With Love • Tiệm hoa nhỏ của riêng bạn
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-sage-green/50 bg-sage-green/15 px-3.5 py-1.5 text-xs font-medium text-burgundy sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-sage-green" />
            Gói từng cánh hoa bằng cả tấm lòng
          </div>
        </div>
      </header>

      {/* Main Shop Counter */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6">
        <BouquetBuilder />
      </main>
    </div>
  );
};
