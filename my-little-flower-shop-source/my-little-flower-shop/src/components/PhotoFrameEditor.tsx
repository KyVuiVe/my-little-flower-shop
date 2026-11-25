import React from 'react';
import { Trash2 } from 'lucide-react';
import { PhotoFrameId, PhotoMemory } from '../types/bouquet';

interface PhotoFrameEditorProps {
  photo: PhotoMemory;
  onUpdate: (patch: Partial<PhotoMemory>) => void;
  onDelete: () => void;
}

const FRAMES: { id: PhotoFrameId; label: string }[] = [
  { id: 'polaroid', label: 'Khung Polaroid' },
  { id: 'film', label: 'Khung Film 35mm' },
  { id: 'heart', label: 'Hình trái tim' },
];

export const PhotoFrameEditor: React.FC<PhotoFrameEditorProps> = ({
  photo,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="space-y-3 rounded-2xl border border-dusty-pink/50 bg-white/90 p-4 shadow-paper">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-burgundy">Chỉnh sửa Photocard đang chọn</span>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-full bg-burgundy/10 px-2.5 py-1 text-xs font-medium text-burgundy hover:bg-burgundy/20"
        >
          <Trash2 className="h-3.5 w-3.5" /> Xóa ảnh
        </button>
      </div>

      {/* Frame selector */}
      <div className="flex flex-wrap gap-2">
        {FRAMES.map((frame) => (
          <button
            key={frame.id}
            type="button"
            onClick={() => onUpdate({ frame: frame.id })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              photo.frame === frame.id
                ? 'border-burgundy bg-burgundy text-cream'
                : 'border-dusty-pink/50 bg-cream/60 text-burgundy hover:bg-cream'
            }`}
          >
            {frame.label}
          </button>
        ))}
      </div>

      {/* Caption */}
      <div>
        <label className="mb-1 block text-xs font-medium text-burgundy/80">
          Dòng chữ ngắn dưới ảnh (tối đa 24 ký tự)
        </label>
        <input
          type="text"
          maxLength={24}
          value={photo.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="Ví dụ: Ngày ta gặp nhau ♥"
          className="w-full rounded-xl border border-dusty-pink/60 bg-cream/40 px-3 py-2 text-xs text-burgundy focus:border-burgundy focus:outline-none"
        />
      </div>

      {/* Crop & Placement Sliders */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Thu phóng ảnh trong khung ({photo.zoom.toFixed(1)}x)</span>
          <input
            type="range"
            min={1}
            max={2.2}
            step={0.1}
            value={photo.zoom}
            onChange={(e) => onUpdate({ zoom: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>

        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Kích thước photocard ({Math.round(photo.scale * 100)}%)</span>
          <input
            type="range"
            min={0.75}
            max={1.35}
            step={0.05}
            value={photo.scale}
            onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>

        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Vị trí ngang trên bó hoa ({photo.posX}%)</span>
          <input
            type="range"
            min={20}
            max={80}
            step={1}
            value={photo.posX}
            onChange={(e) => onUpdate({ posX: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>

        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Vị trí dọc trên bó hoa ({photo.posY}%)</span>
          <input
            type="range"
            min={24}
            max={66}
            step={1}
            value={photo.posY}
            onChange={(e) => onUpdate({ posY: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>

        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Căn ảnh ngang ({photo.offsetX})</span>
          <input
            type="range"
            min={-40}
            max={40}
            step={2}
            value={photo.offsetX}
            onChange={(e) => onUpdate({ offsetX: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>

        <label className="space-y-1 text-xs text-burgundy/80">
          <span>Độ nghiêng photocard ({photo.rotation}°)</span>
          <input
            type="range"
            min={-25}
            max={25}
            step={1}
            value={photo.rotation}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            className="w-full accent-burgundy"
          />
        </label>
      </div>
    </div>
  );
};
