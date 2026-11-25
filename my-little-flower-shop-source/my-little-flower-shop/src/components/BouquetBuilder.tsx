import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Music, Redo2, Shuffle, Undo2, VolumeX } from 'lucide-react';
import { FLOWER_COLORS, RIBBON_COLORS } from '../data/colors';
import { FLOWERS } from '../data/flowers';
import { BOW_STYLES, RIBBON_MATERIALS } from '../data/ribbons';
import { WRAPPING_PAPERS } from '../data/wrappingPapers';
import { WRAPPING_STYLES } from '../data/wrappingStyles';
import { useBouquetHistory } from '../hooks/useBouquetHistory';
import { pianoPlayer } from '../lib/pianoAudio';
import { ShopStage } from '../types/bouquet';
import { BouquetPreview } from './BouquetPreview';
import { FlowerSelection } from './FlowerSelection';
import { FlowerShopAssistant } from './FlowerShopAssistant';
import { GiftPreview } from './GiftPreview';
import { LetterEditor } from './LetterEditor';
import { PhotoUploader } from './PhotoUploader';
import { RibbonSelection } from './RibbonSelection';
import { WrappingSelection } from './WrappingSelection';

const STAGES: { id: ShopStage; short: string; title: string }[] = [
  { id: 1, short: 'Hoa', title: 'Chọn hoa' },
  { id: 2, short: 'Giấy gói', title: 'Giấy gói' },
  { id: 3, short: 'Kiểu gói', title: 'Kiểu gói' },
  { id: 4, short: 'Ruy băng', title: 'Ruy băng' },
  { id: 5, short: 'Ảnh', title: 'Kỷ niệm' },
  { id: 6, short: 'Thiệp', title: 'Viết thiệp' },
  { id: 7, short: 'Hoàn thành', title: 'Thành phẩm' },
];

export const BouquetBuilder: React.FC = () => {
  const { design, setDesign, undo, redo, canUndo, canRedo, lastSavedAt } = useBouquetHistory();
  const [stage, setStage] = useState<ShopStage>(1);
  const [musicOn, setMusicOn] = useState(false);

  const handleToggleMusic = () => {
    setMusicOn(pianoPlayer.toggle());
  };

  const handleRandomBouquet = () => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const shuffledFlowers = [...FLOWERS].sort(() => Math.random() - 0.5).slice(0, 3);
    const randomFlowers = shuffledFlowers.map((f, idx) => ({
      id: `rnd-${Date.now()}-${idx}`,
      flowerId: f.id,
      colorId: pick(FLOWER_COLORS).id,
      quantity: idx === 0 ? 4 : 3,
    }));
    const p1 = pick(WRAPPING_PAPERS);
    const p2 = pick(WRAPPING_PAPERS.filter((p) => p.id !== p1.id));

    setDesign((prev) => ({
      ...prev,
      flowers: randomFlowers,
      wrappingLayers: [
        { id: `rl-1-${Date.now()}`, paperId: p1.id, tintHex: '', pattern: p1.defaultPattern },
        { id: `rl-2-${Date.now()}`, paperId: p2.id, tintHex: '', pattern: p2.defaultPattern },
      ],
      wrappingStyle: pick(WRAPPING_STYLES).id,
      ribbon: {
        material: pick(RIBBON_MATERIALS).id,
        colorId: pick(RIBBON_COLORS).id,
        bowStyle: pick(BOW_STYLES).id,
        tieVersion: prev.ribbon.tieVersion + 1,
      },
    }));
  };

  const goStage = (next: ShopStage) => {
    if (next === 7 && stage !== 7) {
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#E9B8BE', '#A8B59B', '#F5DFA8', '#813C4A'],
      });
    }
    setStage(next);
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Progress & Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-dusty-pink/50 bg-white/85 px-4 py-3 shadow-paper backdrop-blur">
        <div className="flex flex-wrap items-center gap-1.5">
          {STAGES.map((st) => {
            const active = stage === st.id;
            const done = stage > st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => goStage(st.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-burgundy text-cream shadow-sm'
                    : done
                    ? 'bg-sage-green/30 text-burgundy'
                    : 'bg-cream text-burgundy/70 hover:bg-dusty-pink/25'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px]">
                  {done ? <Check className="h-3 w-3" /> : st.id}
                </span>
                <span className="hidden sm:inline">{st.title}</span>
                <span className="sm:hidden">{st.short}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRandomBouquet}
            title="Tạo bó hoa ngẫu nhiên"
            className="inline-flex items-center gap-1 rounded-full bg-soft-yellow/70 px-3 py-1.5 text-xs font-semibold text-burgundy hover:bg-soft-yellow"
          >
            <Shuffle className="h-3.5 w-3.5" /> Ngẫu nhiên
          </button>
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            title="Hoàn tác"
            className="rounded-full border border-dusty-pink/50 bg-white p-1.5 text-burgundy hover:bg-cream disabled:opacity-35"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            title="Làm lại"
            className="rounded-full border border-dusty-pink/50 bg-white p-1.5 text-burgundy hover:bg-cream disabled:opacity-35"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToggleMusic}
            title={musicOn ? 'Tắt nhạc piano' : 'Bật nhạc piano nhẹ nhàng'}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              musicOn ? 'bg-sage-green text-white' : 'border border-dusty-pink/50 bg-white text-burgundy'
            }`}
          >
            {musicOn ? <Music className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{musicOn ? 'Piano: Bật' : 'Piano: Tắt'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      {stage === 7 ? (
        <GiftPreview design={design} onEditBouquet={() => setStage(1)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Live Bouquet Preview Table */}
          <div className="space-y-4 lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-dusty-pink/50 bg-gradient-to-b from-white/90 via-cream/80 to-soft-yellow/25 p-5 shadow-cozy">
              <div className="mb-2 flex items-center justify-between text-xs text-burgundy/70">
                <span className="font-serif font-semibold text-burgundy">Bàn cắm hoa trực tiếp</span>
                {lastSavedAt && <span>Đã tự động lưu lúc {lastSavedAt}</span>}
              </div>
              <BouquetPreview design={design} />
            </div>

            <FlowerShopAssistant stage={stage} design={design} />
          </div>

          {/* Interactive Stage Panel */}
          <div className="flex flex-col justify-between rounded-3xl border border-dusty-pink/50 bg-white/80 p-5 shadow-cozy backdrop-blur lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.22 }}
              >
                {stage === 1 && (
                  <FlowerSelection
                    selectedFlowers={design.flowers}
                    onChange={(flowers) => setDesign((prev) => ({ ...prev, flowers }))}
                  />
                )}
                {stage === 2 && (
                  <WrappingSelection
                    mode="paper"
                    layers={design.wrappingLayers}
                    styleId={design.wrappingStyle}
                    onChangeLayers={(wrappingLayers) => setDesign((prev) => ({ ...prev, wrappingLayers }))}
                    onChangeStyle={(wrappingStyle) => setDesign((prev) => ({ ...prev, wrappingStyle }))}
                  />
                )}
                {stage === 3 && (
                  <WrappingSelection
                    mode="style"
                    layers={design.wrappingLayers}
                    styleId={design.wrappingStyle}
                    onChangeLayers={(wrappingLayers) => setDesign((prev) => ({ ...prev, wrappingLayers }))}
                    onChangeStyle={(wrappingStyle) => setDesign((prev) => ({ ...prev, wrappingStyle }))}
                  />
                )}
                {stage === 4 && (
                  <RibbonSelection
                    ribbon={design.ribbon}
                    onChange={(ribbon) => setDesign((prev) => ({ ...prev, ribbon }))}
                  />
                )}
                {stage === 5 && (
                  <PhotoUploader
                    photos={design.photos}
                    onChange={(photos) => setDesign((prev) => ({ ...prev, photos }))}
                  />
                )}
                {stage === 6 && (
                  <LetterEditor
                    letter={design.letter}
                    onChange={(letter) => setDesign((prev) => ({ ...prev, letter }))}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stage Navigation Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-dusty-pink/35 pt-4">
              <button
                type="button"
                disabled={stage === 1}
                onClick={() => goStage((stage - 1) as ShopStage)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dusty-pink bg-white px-4 py-2 text-xs font-semibold text-burgundy hover:bg-cream disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Bước trước
              </button>

              <button
                type="button"
                onClick={() => goStage((stage + 1) as ShopStage)}
                className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-5 py-2.5 text-xs font-semibold text-cream shadow-cozy hover:bg-burgundy/90"
              >
                {stage === 6 ? 'Hoàn thành bó hoa ✨' : 'Bước tiếp theo'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
