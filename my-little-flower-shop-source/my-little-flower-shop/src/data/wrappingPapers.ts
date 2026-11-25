import { WrappingPaperId } from '../types/bouquet';

export interface WrappingPaperMeta {
  id: WrappingPaperId;
  nameVi: string;
  description: string;
  baseHex: string;
  edgeHex: string;
  opacity: number;
  defaultPattern: 'none' | 'dots' | 'floral' | 'stripes' | 'lace-edge';
}

export const WRAPPING_PAPERS: WrappingPaperMeta[] = [
  {
    id: 'kraft',
    nameVi: 'Giấy kraft nâu',
    description: 'Mộc mạc, ấm áp phong cách tiệm hoa thủ công',
    baseHex: '#C9A47E',
    edgeHex: '#9E7852',
    opacity: 0.98,
    defaultPattern: 'none',
  },
  {
    id: 'cream-white',
    nameVi: 'Giấy trắng kem',
    description: 'Nhẹ nhàng, làm nổi bật mọi sắc hoa',
    baseHex: '#FFF6EA',
    edgeHex: '#E5D3BC',
    opacity: 0.97,
    defaultPattern: 'none',
  },
  {
    id: 'pastel-pink',
    nameVi: 'Giấy hồng pastel',
    description: 'Ngọt ngào, mềm mại chuẩn stationery Hàn Quốc',
    baseHex: '#F4CDD2',
    edgeHex: '#D99DA5',
    opacity: 0.96,
    defaultPattern: 'dots',
  },
  {
    id: 'burgundy-wine',
    nameVi: 'Giấy đỏ rượu vang',
    description: 'Sang trọng, sâu lắng và quyến rũ',
    baseHex: '#813C4A',
    edgeHex: '#59232F',
    opacity: 0.98,
    defaultPattern: 'none',
  },
  {
    id: 'translucent',
    nameVi: 'Giấy trong suốt',
    description: 'Giấy bóng kính mờ tạo hiệu ứng sương sớm',
    baseHex: '#FFFFFF',
    edgeHex: '#E9DFD4',
    opacity: 0.56,
    defaultPattern: 'lace-edge',
  },
  {
    id: 'floral-pattern',
    nameVi: 'Giấy họa tiết hoa',
    description: 'In hoa nhí dịu dàng như trang sổ lưu bút',
    baseHex: '#F9EBDD',
    edgeHex: '#DDBBA5',
    opacity: 0.97,
    defaultPattern: 'floral',
  },
  {
    id: 'vintage',
    nameVi: 'Giấy vintage',
    description: 'Sắc giấy báo cũ hoài niệm, lãng mạn',
    baseHex: '#E5D3B3',
    edgeHex: '#B69E77',
    opacity: 0.97,
    defaultPattern: 'stripes',
  },
  {
    id: 'korean-style',
    nameVi: 'Giấy phong cách Hàn Quốc',
    description: 'Hai mặt viền kem mịn, gấp nếp bồng bềnh',
    baseHex: '#E8E3DA',
    edgeHex: '#B6B9A9',
    opacity: 0.96,
    defaultPattern: 'lace-edge',
  },
];

export const PAPER_TINT_SWATCHES = [
  { nameVi: 'Mặc định', hex: '' },
  { nameVi: 'Kem sữa', hex: '#FFF4E4' },
  { nameVi: 'Hồng phấn', hex: '#F3C7CE' },
  { nameVi: 'Xanh xô thơm', hex: '#C6D2BC' },
  { nameVi: 'Vàng bơ', hex: '#F5DFA8' },
  { nameVi: 'Nâu cacao', hex: '#C29D7B' },
  { nameVi: 'Đỏ rượu', hex: '#813C4A' },
  { nameVi: 'Oải hương', hex: '#DDD0EE' },
];

export const PAPER_PATTERNS = [
  { id: 'none' as const, nameVi: 'Trơn mịn' },
  { id: 'dots' as const, nameVi: 'Chấm bi nhỏ' },
  { id: 'floral' as const, nameVi: 'Hoa nhí' },
  { id: 'stripes' as const, nameVi: 'Sọc vintage' },
  { id: 'lace-edge' as const, nameVi: 'Viền ren' },
];

export function getWrappingPaper(id: WrappingPaperId): WrappingPaperMeta {
  return WRAPPING_PAPERS.find((p) => p.id === id) ?? WRAPPING_PAPERS[1];
}
