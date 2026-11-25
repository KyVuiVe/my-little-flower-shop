import { FlowerColorId, FlowerId } from '../types/bouquet';

export interface FlowerMeta {
  id: FlowerId;
  nameEn: string;
  nameVi: string;
  meaning: string;
  defaultColor: FlowerColorId;
  role: 'focal' | 'secondary' | 'filler';
  stemHeight: number;
  headScale: number;
}

export const MAX_TOTAL_STEMS = 18;
export const MAX_PER_ITEM = 9;

export const FLOWERS: FlowerMeta[] = [
  {
    id: 'rose',
    nameEn: 'Rose',
    nameVi: 'Hoa hồng',
    meaning: 'Tình yêu nồng nàn & sự trân trọng',
    defaultColor: 'red',
    role: 'focal',
    stemHeight: 1.0,
    headScale: 1.05,
  },
  {
    id: 'tulip',
    nameEn: 'Tulip',
    nameVi: 'Hoa tulip',
    meaning: 'Lời tỏ tình dịu dàng & mùa xuân',
    defaultColor: 'pink',
    role: 'focal',
    stemHeight: 1.06,
    headScale: 0.96,
  },
  {
    id: 'sunflower',
    nameEn: 'Sunflower',
    nameVi: 'Hoa hướng dương',
    meaning: 'Ánh nắng ấm áp & niềm tin vững bền',
    defaultColor: 'yellow',
    role: 'focal',
    stemHeight: 1.08,
    headScale: 1.18,
  },
  {
    id: 'babys-breath',
    nameEn: "Baby's Breath",
    nameVi: 'Hoa baby',
    meaning: 'Sự tinh khôi & yêu thương bền lâu',
    defaultColor: 'white',
    role: 'filler',
    stemHeight: 1.02,
    headScale: 0.95,
  },
  {
    id: 'lily',
    nameEn: 'Lily',
    nameVi: 'Hoa ly',
    meaning: 'Thanh cao, tinh tế & hạnh phúc',
    defaultColor: 'white',
    role: 'focal',
    stemHeight: 1.1,
    headScale: 1.14,
  },
  {
    id: 'daisy',
    nameEn: 'Daisy',
    nameVi: 'Hoa cúc họa mi',
    meaning: 'Ngây thơ, trong trẻo & bình yên',
    defaultColor: 'white',
    role: 'secondary',
    stemHeight: 0.95,
    headScale: 0.9,
  },
  {
    id: 'peony',
    nameEn: 'Peony',
    nameVi: 'Hoa mẫu đơn',
    meaning: 'Viên mãn, lãng mạn & dịu ngọt',
    defaultColor: 'pink',
    role: 'focal',
    stemHeight: 0.98,
    headScale: 1.16,
  },
  {
    id: 'carnation',
    nameEn: 'Carnation',
    nameVi: 'Hoa cẩm chướng',
    meaning: 'Lòng biết ơn & yêu thương sâu sắc',
    defaultColor: 'orange',
    role: 'secondary',
    stemHeight: 0.96,
    headScale: 0.94,
  },
  {
    id: 'hydrangea',
    nameEn: 'Hydrangea',
    nameVi: 'Hoa cẩm tú cầu',
    meaning: 'Chân thành, thấu hiểu & gắn kết',
    defaultColor: 'pastel-blue',
    role: 'focal',
    stemHeight: 0.92,
    headScale: 1.24,
  },
  {
    id: 'lavender',
    nameEn: 'Lavender',
    nameVi: 'Hoa oải hương',
    meaning: 'Bình yên, thủy chung & hương thơm dịu nhẹ',
    defaultColor: 'purple',
    role: 'filler',
    stemHeight: 1.12,
    headScale: 0.92,
  },
];

export function getFlowerMeta(id: FlowerId): FlowerMeta {
  return FLOWERS.find((f) => f.id === id) ?? FLOWERS[0];
}
