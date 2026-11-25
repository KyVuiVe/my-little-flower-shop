import React from 'react';
import { Sparkles } from 'lucide-react';
import { RIBBON_COLORS } from '../data/colors';
import { BOW_STYLES, RIBBON_MATERIALS } from '../data/ribbons';
import { RibbonConfig } from '../types/bouquet';
import { ColorPicker } from './ColorPicker';

interface RibbonSelectionProps {
  ribbon: RibbonConfig;
  onChange: (ribbon: RibbonConfig) => void;
}

export const RibbonSelection: React.FC<RibbonSelectionProps> = ({ ribbon, onChange }) => {
  const updateRibbon = (patch: Partial<RibbonConfig>) => {
    onChange({
      ...ribbon,
      ...patch,
      tieVersion: ribbon.tieVersion + 1,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-xl font-semibold text-burgundy">Thắt ruy băng cho bó hoa</h2>
        <p className="text-xs text-burgundy/70">Chọn chất liệu, màu sắc và kiểu thắt nơ — nơ sẽ tự động thắt trên bó hoa</p>
      </div>

      {/* Ribbon Material */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-burgundy/80">Chất liệu ruy băng:</p>
        <div className="grid grid-cols-2 gap-2.5">
          {RIBBON_MATERIALS.map((mat) => {
            const active = ribbon.material === mat.id;
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => updateRibbon({ material: mat.id })}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? 'border-burgundy bg-white shadow-cozy ring-2 ring-dusty-pink/50'
                    : 'border-dusty-pink/40 bg-white/75 hover:bg-white'
                }`}
              >
                <p className="text-sm font-semibold text-burgundy">{mat.nameVi}</p>
                <p className="mt-0.5 text-xs text-burgundy/65">{mat.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ribbon Color */}
      <div className="rounded-2xl border border-dusty-pink/40 bg-white/80 p-3.5">
        <ColorPicker
          label="Màu ruy băng:"
          options={RIBBON_COLORS}
          selectedId={ribbon.colorId}
          onSelect={(colorId) => updateRibbon({ colorId })}
        />
      </div>

      {/* Bow Style */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-burgundy/80">
          <Sparkles className="h-3.5 w-3.5" /> Kiểu thắt nơ:
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {BOW_STYLES.map((bow) => {
            const active = ribbon.bowStyle === bow.id;
            return (
              <button
                key={bow.id}
                type="button"
                onClick={() => updateRibbon({ bowStyle: bow.id })}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? 'border-burgundy bg-burgundy text-cream shadow-sm'
                    : 'border-dusty-pink/40 bg-white/75 text-burgundy hover:bg-white'
                }`}
              >
                <p className="text-xs font-semibold">{bow.nameVi}</p>
                <p className={`mt-0.5 text-[11px] ${active ? 'text-cream/85' : 'text-burgundy/65'}`}>
                  {bow.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
