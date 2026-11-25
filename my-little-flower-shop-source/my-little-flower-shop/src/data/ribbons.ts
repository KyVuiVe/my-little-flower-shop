import { BowStyleId, RibbonMaterialId } from '../types/bouquet';

export interface RibbonMaterialMeta {
  id: RibbonMaterialId;
  nameVi: string;
  description: string;
  sheenOpacity: number;
  strokeDash?: string;
}

export interface BowStyleMeta {
  id: BowStyleId;
  nameVi: string;
  description: string;
}

export const RIBBON_MATERIALS: RibbonMaterialMeta[] = [
  { id: 'satin', nameVi: 'Ruy băng Satin', description: 'Bóng mượt nhẹ, phản chiếu ánh nắng dịu', sheenOpacity: 0.45 },
  { id: 'organza', nameVi: 'Ruy băng Voan', description: 'Trong mỏng bay bổng, mềm mại tinh khôi', sheenOpacity: 0.25 },
  { id: 'lace', nameVi: 'Ruy băng Ren', description: 'Họa tiết ren vintage lãng mạn, duyên dáng', sheenOpacity: 0.15, strokeDash: '4 3' },
  { id: 'velvet', nameVi: 'Ruy băng Nhung', description: 'Dày dặn, ấm áp và sang trọng cổ điển', sheenOpacity: 0.1 },
];

export const BOW_STYLES: BowStyleMeta[] = [
  { id: 'classic-bow', nameVi: 'Nơ cổ điển', description: 'Hai cánh nơ tròn đều, gọn gàng' },
  { id: 'double-loop', nameVi: 'Nơ hai tầng', description: 'Nơ kép bồng bềnh nổi bật' },
  { id: 'long-tails', nameVi: 'Nơ đuôi dài thướt tha', description: 'Dải ruy băng buông dài mềm mại' },
  { id: 'korean-ribbon', nameVi: 'Nơ rủ Hàn Quốc', description: 'Nút thắt nhẹ nhàng, dây uốn lượn tự nhiên' },
];
