import React, { useRef, useState } from 'react';
import { Camera, ImagePlus, ShieldCheck } from 'lucide-react';
import { readLocalImageFile } from '../lib/imageProcessor';
import { PhotoMemory } from '../types/bouquet';
import { PhotoFrameEditor } from './PhotoFrameEditor';

interface PhotoUploaderProps {
  photos: PhotoMemory[];
  onChange: (photos: PhotoMemory[]) => void;
}

const MAX_PHOTOS = 4;

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(photos[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPhoto = photos.find((p) => p.id === selectedId) ?? photos[0] ?? null;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const remaining = MAX_PHOTOS - photos.length;
      const files = Array.from(fileList).slice(0, Math.max(0, remaining));
      const newPhotos: PhotoMemory[] = [];
      for (let i = 0; i < files.length; i += 1) {
        const dataUrl = await readLocalImageFile(files[i]);
        const idx = photos.length + i;
        newPhotos.push({
          id: `mem-${Date.now()}-${i}`,
          imageUrl: dataUrl,
          frame: idx % 3 === 0 ? 'polaroid' : idx % 3 === 1 ? 'film' : 'heart',
          caption: 'Kỷ niệm đẹp ♥',
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
          posX: 30 + (idx % 2) * 40,
          posY: 36 + Math.floor(idx / 2) * 18,
          scale: 1,
          rotation: idx % 2 === 0 ? -8 : 8,
        });
      }
      const next = [...photos, ...newPhotos];
      onChange(next);
      if (newPhotos[0]) setSelectedId(newPhotos[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xử lý ảnh.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-xl font-semibold text-burgundy">Gắn ảnh kỷ niệm lên bó hoa</h2>
        <p className="text-xs text-burgundy/70">
          Tải ảnh từ thiết bị (JPG, PNG, WEBP) để tạo những tấm photocard xinh xắn cắm cùng hoa
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-2xl bg-sage-green/20 px-3.5 py-2.5 text-xs text-burgundy/85">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-green" />
        <span>
          Ảnh của bạn được xử lý trực tiếp trên trình duyệt và <strong>không tự động tải lên máy chủ</strong>.
          Ảnh chỉ được lưu khi bạn bấm “Send Your Gift” ở bước cuối.
        </span>
      </div>

      {/* Upload Dropzone */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={loading || photos.length >= MAX_PHOTOS}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-cream shadow-cozy transition hover:bg-burgundy/90 disabled:opacity-45"
        >
          <ImagePlus className="h-4 w-4" />
          {loading ? 'Đang xử lý ảnh...' : `Tải ảnh lên (${photos.length}/${MAX_PHOTOS})`}
        </button>
        {photos.length > 0 && (
          <span className="text-xs text-burgundy/65">Nhấn vào từng ảnh bên dưới để cắt & đổi khung</span>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>
      )}

      {/* Thumbnails */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-dusty-pink bg-white/55 py-8 text-center">
          <Camera className="mb-2 h-8 w-8 text-dusty-pink" />
          <p className="text-sm font-medium text-burgundy">Chưa có tấm ảnh kỷ niệm nào</p>
          <p className="mt-1 text-xs text-burgundy/65">
            Bước này là tùy chọn — bạn có thể gắn ảnh Polaroid, Film hoặc Trái tim lên bó hoa!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {photos.map((photo, idx) => {
            const active = selectedPhoto?.id === photo.id;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedId(photo.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-1 transition ${
                  active ? 'border-burgundy bg-white shadow-cozy' : 'border-dusty-pink/40 bg-white/70'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Ảnh ${idx + 1}`}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <span className="mt-1 block max-w-[64px] truncate text-[10px] font-medium text-burgundy">
                  {photo.caption || `Ảnh #${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Photo Editor */}
      {selectedPhoto && (
        <PhotoFrameEditor
          photo={selectedPhoto}
          onUpdate={(patch) =>
            onChange(photos.map((p) => (p.id === selectedPhoto.id ? { ...p, ...patch } : p)))
          }
          onDelete={() => {
            const next = photos.filter((p) => p.id !== selectedPhoto.id);
            onChange(next);
            setSelectedId(next[0]?.id ?? null);
          }}
        />
      )}
    </div>
  );
};
