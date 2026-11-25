import React, { useState } from 'react';
import { Layers, Plus, Sparkles, Trash2 } from 'lucide-react';
import { PAPER_PATTERNS, PAPER_TINT_SWATCHES, WRAPPING_PAPERS } from '../data/wrappingPapers';
import { WRAPPING_STYLES } from '../data/wrappingStyles';
import { WrappingLayer, WrappingPaperId, WrappingStyleId } from '../types/bouquet';

interface WrappingSelectionProps {
  mode: 'paper' | 'style';
  layers: WrappingLayer[];
  styleId: WrappingStyleId;
  onChangeLayers: (layers: WrappingLayer[]) => void;
  onChangeStyle: (styleId: WrappingStyleId) => void;
}

export const WrappingSelection: React.FC<WrappingSelectionProps> = ({
  mode,
  layers,
  styleId,
  onChangeLayers,
  onChangeStyle,
}) => {
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);
  const safeIdx = Math.min(activeLayerIdx, Math.max(0, layers.length - 1));
  const activeLayer = layers[safeIdx];

  const updateActiveLayer = (patch: Partial<WrappingLayer>) => {
    onChangeLayers(layers.map((l, idx) => (idx === safeIdx ? { ...l, ...patch } : l)));
  };

  const addLayer = () => {
    if (layers.length >= 3) return;
    const nextPaper: WrappingPaperId = layers.length === 1 ? 'translucent' : 'korean-style';
    const nextLayers: WrappingLayer[] = [
      ...layers,
      {
        id: `layer-${Date.now()}`,
        paperId: nextPaper,
        tintHex: '',
        pattern: nextPaper === 'translucent' ? 'lace-edge' : 'none',
      },
    ];
    onChangeLayers(nextLayers);
    setActiveLayerIdx(nextLayers.length - 1);
  };

  const removeLayer = (idx: number) => {
    if (layers.length <= 1) return;
    const next = layers.filter((_, i) => i !== idx);
    onChangeLayers(next);
    setActiveLayerIdx(Math.max(0, idx - 1));
  };

  if (mode === 'style') {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-burgundy">Chọn kiểu gói hoa</h2>
          <p className="text-xs text-burgundy/70">
            Mỗi kiểu gói sẽ tạo hình dáng, độ xòe và nếp gấp khác nhau cho bó hoa của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {WRAPPING_STYLES.map((style) => {
            const active = style.id === styleId;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeStyle(style.id)}
                className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                  active
                    ? 'border-burgundy bg-white shadow-cozy ring-2 ring-dusty-pink/50'
                    : 'border-dusty-pink/40 bg-white/75 hover:bg-white'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-serif text-base font-semibold text-burgundy">{style.nameEn}</span>
                  {active && (
                    <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-semibold text-cream">
                      Đang chọn
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-burgundy/80">{style.nameVi}</span>
                <p className="mt-1 text-xs leading-relaxed text-burgundy/65">{style.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-semibold text-burgundy">Quầy giấy gói nhiều lớp</h2>
          <p className="text-xs text-burgundy/70">Phối hợp 1–3 lớp giấy gói cùng màu sắc và họa tiết riêng</p>
        </div>
        {layers.length < 3 && (
          <button
            type="button"
            onClick={addLayer}
            className="inline-flex items-center gap-1.5 rounded-full bg-sage-green/30 px-3.5 py-1.5 text-xs font-semibold text-burgundy hover:bg-sage-green/45"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm lớp giấy ({layers.length}/3)
          </button>
        )}
      </div>

      {/* Layer Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {layers.map((layer, idx) => (
          <div
            key={layer.id}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
              idx === safeIdx
                ? 'border-burgundy bg-burgundy text-cream font-semibold'
                : 'border-dusty-pink/50 bg-white/80 text-burgundy hover:bg-white'
            }`}
          >
            <button type="button" onClick={() => setActiveLayerIdx(idx)} className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Lớp {idx + 1} {idx === 0 ? '(Trong)' : idx === layers.length - 1 ? '(Ngoài)' : '(Giữa)'}
            </button>
            {layers.length > 1 && (
              <button
                type="button"
                onClick={() => removeLayer(idx)}
                className="ml-1 opacity-75 hover:opacity-100"
                aria-label="Xóa lớp giấy"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 8 Wrapping Paper Types */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {WRAPPING_PAPERS.map((paper) => {
          const active = activeLayer?.paperId === paper.id;
          return (
            <button
              key={paper.id}
              type="button"
              onClick={() =>
                updateActiveLayer({
                  paperId: paper.id,
                  tintHex: '',
                  pattern: paper.defaultPattern,
                })
              }
              className={`rounded-2xl border p-3 text-left transition-all ${
                active
                  ? 'border-burgundy bg-white shadow-cozy ring-2 ring-dusty-pink/50'
                  : 'border-dusty-pink/40 bg-white/75 hover:bg-white'
              }`}
            >
              <div
                className="mb-2 h-9 w-full rounded-xl border"
                style={{
                  backgroundColor: paper.baseHex,
                  borderColor: paper.edgeHex,
                  opacity: paper.opacity,
                }}
              />
              <p className="text-xs font-semibold text-burgundy">{paper.nameVi}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] text-burgundy/65">{paper.description}</p>
            </button>
          );
        })}
      </div>

      {/* Layer Tint & Pattern */}
      {activeLayer && (
        <div className="space-y-3 rounded-2xl border border-dusty-pink/40 bg-white/80 p-3.5">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-burgundy/80">Tùy chỉnh tông màu cho Lớp {safeIdx + 1}:</p>
            <div className="flex flex-wrap gap-2">
              {PAPER_TINT_SWATCHES.map((sw) => {
                const selected = activeLayer.tintHex === sw.hex;
                return (
                  <button
                    key={sw.nameVi}
                    type="button"
                    onClick={() => updateActiveLayer({ tintHex: sw.hex })}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                      selected
                        ? 'border-burgundy bg-burgundy/10 font-semibold text-burgundy'
                        : 'border-dusty-pink/40 bg-white text-burgundy/75'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: sw.hex || '#FFF5E9' }}
                    />
                    {sw.nameVi}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-dusty-pink/30 pt-2.5">
            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-burgundy/80">
              <Sparkles className="h-3.5 w-3.5" /> Họa tiết lớp giấy:
            </p>
            <div className="flex flex-wrap gap-2">
              {PAPER_PATTERNS.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => updateActiveLayer({ pattern: pat.id })}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    activeLayer.pattern === pat.id
                      ? 'border-burgundy bg-burgundy text-cream font-semibold'
                      : 'border-dusty-pink/40 bg-white text-burgundy/80 hover:bg-cream'
                  }`}
                >
                  {pat.nameVi}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
