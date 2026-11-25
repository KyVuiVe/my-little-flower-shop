import { WrappingStyleId } from '../types/bouquet';

export interface WrappingStyleMeta {
  id: WrappingStyleId;
  nameEn: string;
  nameVi: string;
  description: string;
  /** Layout geometry parameters that transform the bouquet shape */
  spreadX: number;
  spreadY: number;
  fanAngle: number;
  collarScaleX: number;
  collarHeight: number;
  coneWidthTop: number;
  coneWidthBottom: number;
  foldStyle: 'ruffled' | 'cone' | 'asymmetric' | 'sleek' | 'dome' | 'airy' | 'grand';
}

export const WRAPPING_STYLES: WrappingStyleMeta[] = [
  {
    id: 'korean',
    nameEn: 'Korean Style',
    nameVi: 'Phong cách Hàn Quốc',
    description: 'Nhiều nếp gấp bồng bềnh xếp tầng nhẹ nhàng, dáng xòe rộng thanh thoát',
    spreadX: 1.08,
    spreadY: 1.0,
    fanAngle: 34,
    collarScaleX: 1.15,
    collarHeight: 1.12,
    coneWidthTop: 158,
    coneWidthBottom: 38,
    foldStyle: 'ruffled',
  },
  {
    id: 'classic',
    nameEn: 'Classic Bouquet',
    nameVi: 'Bó hoa cổ điển',
    description: 'Dáng nón cân đối, gọn gàng và trang nhã vượt thời gian',
    spreadX: 0.94,
    spreadY: 0.96,
    fanAngle: 26,
    collarScaleX: 0.98,
    collarHeight: 1.0,
    coneWidthTop: 136,
    coneWidthBottom: 30,
    foldStyle: 'cone',
  },
  {
    id: 'vintage',
    nameEn: 'Vintage Style',
    nameVi: 'Phong cách Vintage',
    description: 'Gấp chéo bất đối xứng hoài niệm như tiệm hoa góc phố châu Âu',
    spreadX: 1.02,
    spreadY: 1.05,
    fanAngle: 30,
    collarScaleX: 1.06,
    collarHeight: 1.18,
    coneWidthTop: 146,
    coneWidthBottom: 34,
    foldStyle: 'asymmetric',
  },
  {
    id: 'minimalist',
    nameEn: 'Minimalist',
    nameVi: 'Tối giản',
    description: 'Đường cắt gọn thanh lịch, để hoa tự tỏa sáng đầy tinh tế',
    spreadX: 0.82,
    spreadY: 1.08,
    fanAngle: 18,
    collarScaleX: 0.84,
    collarHeight: 0.92,
    coneWidthTop: 112,
    coneWidthBottom: 28,
    foldStyle: 'sleek',
  },
  {
    id: 'round',
    nameEn: 'Round Bouquet',
    nameVi: 'Bó tròn',
    description: 'Bó tròn đầy đặn, hoa quây quần thành vòm mềm mại ngọt ngào',
    spreadX: 1.0,
    spreadY: 0.84,
    fanAngle: 22,
    collarScaleX: 1.1,
    collarHeight: 0.9,
    coneWidthTop: 150,
    coneWidthBottom: 34,
    foldStyle: 'dome',
  },
  {
    id: 'natural',
    nameEn: 'Natural Bouquet',
    nameVi: 'Tự nhiên, phóng khoáng',
    description: 'Cành hoa vươn cao tự do như vừa hái từ khu vườn nắng sớm',
    spreadX: 1.22,
    spreadY: 1.14,
    fanAngle: 44,
    collarScaleX: 1.04,
    collarHeight: 0.95,
    coneWidthTop: 154,
    coneWidthBottom: 36,
    foldStyle: 'airy',
  },
  {
    id: 'luxury',
    nameEn: 'Luxury Bouquet',
    nameVi: 'Sang trọng',
    description: 'Phom dáng lớn, lớp giấy xòe vương miện nổi bật đầy ấn tượng',
    spreadX: 1.18,
    spreadY: 1.04,
    fanAngle: 38,
    collarScaleX: 1.28,
    collarHeight: 1.22,
    coneWidthTop: 176,
    coneWidthBottom: 42,
    foldStyle: 'grand',
  },
];

export function getWrappingStyle(id: WrappingStyleId): WrappingStyleMeta {
  return WRAPPING_STYLES.find((s) => s.id === id) ?? WRAPPING_STYLES[0];
}
