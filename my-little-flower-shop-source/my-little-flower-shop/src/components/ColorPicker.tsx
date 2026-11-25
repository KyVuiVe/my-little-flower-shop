import React from 'react';
import { Check } from 'lucide-react';
import { ColorOption } from '../data/colors';

interface ColorPickerProps<T extends string> {
  options: ColorOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  label?: string;
}

export function ColorPicker<T extends string>({
  options,
  selectedId,
  onSelect,
  label,
}: ColorPickerProps<T>) {
  return (
    <div className="space-y-1.5">
      {label && <p className="text-xs font-medium text-burgundy/75">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((color) => {
          const active = color.id === selectedId;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelect(color.id)}
              title={color.nameVi}
              className={`group relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                active
                  ? 'border-burgundy bg-burgundy/10 font-semibold text-burgundy shadow-sm'
                  : 'border-dusty-pink/50 bg-white/80 text-burgundy/80 hover:border-burgundy/50'
              }`}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: color.hex }}
              >
                {active && (
                  <Check
                    className={`h-2.5 w-2.5 ${
                      color.id === 'white' || color.id === 'cream' || color.id === 'yellow'
                        ? 'text-burgundy'
                        : 'text-white'
                    }`}
                  />
                )}
              </span>
              <span>{color.nameVi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
