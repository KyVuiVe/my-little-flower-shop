import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Sparkles, Trash2 } from 'lucide-react';
import { FLOWER_COLORS } from '../data/colors';
import { FLOWERS, getFlowerMeta, MAX_PER_ITEM, MAX_TOTAL_STEMS } from '../data/flowers';
import { FlowerColorId, FlowerId, SelectedFlower } from '../types/bouquet';
import { ColorPicker } from './ColorPicker';
import { FlowerIllustration } from './FlowerIllustration';

interface FlowerSelectionProps {
  selectedFlowers: SelectedFlower[];
  onChange: (next: SelectedFlower[]) => void;
}

export const FlowerSelection: React.FC<FlowerSelectionProps> = ({
  selectedFlowers,
  onChange,
}) => {
  const [activeFlowerId, setActiveFlowerId] = useState<FlowerId>('rose');
  const [activeColorId, setActiveColorId] = useState<FlowerColorId>('pink');

  const totalStems = selectedFlowers.reduce((sum, item) => sum + item.quantity, 0);
  const activeMeta = getFlowerMeta(activeFlowerId);

  const handleSelectShelfFlower = (flowerId: FlowerId) => {
    setActiveFlowerId(flowerId);
    const meta = getFlowerMeta(flowerId);
    setActiveColorId(meta.defaultColor);
  };

  const handleAddFlower = () => {
    if (totalStems >= MAX_TOTAL_STEMS) return;
    const existing = selectedFlowers.find(
      (f) => f.flowerId === activeFlowerId && f.colorId === activeColorId
    );
    if (existing) {
      if (existing.quantity >= MAX_PER_ITEM) return;
      onChange(
        selectedFlowers.map((f) =>
          f.id === existing.id ? { ...f, quantity: f.quantity + 1 } : f
        )
      );
    } else {
      onChange([
        ...selectedFlowers,
        {
          id: `${activeFlowerId}-${activeColorId}-${Date.now()}`,
          flowerId: activeFlowerId,
          colorId: activeColorId,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    onChange(
      selectedFlowers
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.quantity + delta;
          if (delta > 0 && (totalStems >= MAX_TOTAL_STEMS || nextQty > MAX_PER_ITEM)) {
            return item;
          }
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="space-y-5">
      {/* Header & Stem Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-semibold text-burgundy">Quầy hoa tươi hôm nay</h2>
          <p className="text-xs text-burgundy/70">Chọn loại hoa, màu sắc và thêm từng cành vào bó của bạn</p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            totalStems >= MAX_TOTAL_STEMS
              ? 'bg-burgundy text-cream'
              : 'bg-soft-yellow/60 text-burgundy'
          }`}
        >
          {totalStems} / {MAX_TOTAL_STEMS} cành hoa
        </div>
      </div>

      {/* Interactive Flower Shelf (10 flowers) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {FLOWERS.map((flower) => {
          const isSelected = activeFlowerId === flower.id;
          const countInBouquet = selectedFlowers
            .filter((f) => f.flowerId === flower.id)
            .reduce((s, f) => s + f.quantity, 0);

          return (
            <motion.button
              key={flower.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectShelfFlower(flower.id)}
              className={`relative flex flex-col items-center rounded-2xl border p-2.5 text-center transition-all ${
                isSelected
                  ? 'border-burgundy bg-white shadow-cozy ring-2 ring-dusty-pink/50'
                  : 'border-dusty-pink/40 bg-white/70 hover:bg-white'
              }`}
            >
              {countInBouquet > 0 && (
                <span className="absolute right-2 top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-cream">
                  {countInBouquet}
                </span>
              )}
              <FlowerIllustration
                flowerId={flower.id}
                colorId={isSelected ? activeColorId : flower.defaultColor}
                size={52}
              />
              <span className="mt-1 text-xs font-semibold text-burgundy">{flower.nameVi}</span>
              <span className="text-[10px] text-burgundy/60">{flower.nameEn}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Active Flower Preview & Color Picker */}
      <div className="rounded-3xl border border-dusty-pink/50 bg-white/85 p-4 shadow-paper">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <motion.div
              key={`${activeFlowerId}-${activeColorId}`}
              initial={{ scale: 0.8, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cream border border-dusty-pink/40"
            >
              <FlowerIllustration flowerId={activeFlowerId} colorId={activeColorId} size={68} />
            </motion.div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-burgundy">
                {activeMeta.nameVi} <span className="text-sm font-normal text-burgundy/60">({activeMeta.nameEn})</span>
              </h3>
              <p className="text-xs italic text-burgundy/75">“{activeMeta.meaning}”</p>
            </div>
          </div>

          <button
            type="button"
            disabled={totalStems >= MAX_TOTAL_STEMS}
            onClick={handleAddFlower}
            className="sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-cream shadow-cozy transition hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus className="h-4 w-4" />
            Thêm vào bó hoa
          </button>
        </div>

        <div className="mt-4 border-t border-dusty-pink/30 pt-3">
          <ColorPicker
            label="Chọn sắc hoa:"
            options={FLOWER_COLORS}
            selectedId={activeColorId}
            onSelect={setActiveColorId}
          />
        </div>
      </div>

      {/* Selected Stems Tray */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-burgundy/80">
          <Sparkles className="h-3.5 w-3.5 text-burgundy" />
          Hoa đã chọn trong bó ({selectedFlowers.length} nhóm)
        </div>
        {selectedFlowers.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-dusty-pink/60 bg-white/50 p-3 text-center text-xs text-burgundy/60">
            Chưa có bông hoa nào. Nhấn “Thêm vào bó hoa” để bắt đầu nhé!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedFlowers.map((item) => {
              const meta = getFlowerMeta(item.flowerId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-full border border-dusty-pink/50 bg-white px-2.5 py-1.5 shadow-sm"
                >
                  <FlowerIllustration flowerId={item.flowerId} colorId={item.colorId} size={24} />
                  <span className="text-xs font-medium text-burgundy">{meta.nameVi}</span>
                  <div className="flex items-center gap-1 rounded-full bg-cream px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="rounded-full p-0.5 text-burgundy hover:bg-dusty-pink/30"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[16px] text-center text-xs font-bold text-burgundy">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      disabled={totalStems >= MAX_TOTAL_STEMS || item.quantity >= MAX_PER_ITEM}
                      className="rounded-full p-0.5 text-burgundy hover:bg-dusty-pink/30 disabled:opacity-35"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -item.quantity)}
                    className="text-burgundy/45 hover:text-burgundy"
                    aria-label="Xóa hoa này"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
