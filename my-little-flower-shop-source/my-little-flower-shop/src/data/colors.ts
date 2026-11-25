import { FlowerColorId, RibbonColorId } from '../types/bouquet';

export interface ColorOption<T extends string = string> {
  id: T;
  nameVi: string;
  hex: string;
  lightHex: string;
  darkHex: string;
  accentHex: string;
}

export const FLOWER_COLORS: ColorOption<FlowerColorId>[] = [
  { id: 'red', nameVi: 'Đỏ', hex: '#D94B5A', lightHex: '#F38B96', darkHex: '#8E2431', accentHex: '#FDE2E4' },
  { id: 'pink', nameVi: 'Hồng', hex: '#E9A5B2', lightHex: '#FAD6DE', darkHex: '#B86475', accentHex: '#FFF0F3' },
  { id: 'white', nameVi: 'Trắng', hex: '#FFFDF9', lightHex: '#FFFFFF', darkHex: '#BDA996', accentHex: '#F5DFA8' },
  { id: 'yellow', nameVi: 'Vàng', hex: '#F2C963', lightHex: '#FCE8A6', darkHex: '#C6922B', accentHex: '#7A4E2D' },
  { id: 'purple', nameVi: 'Tím', hex: '#B493D6', lightHex: '#DFCCF2', darkHex: '#77569C', accentHex: '#F3EBFA' },
  { id: 'orange', nameVi: 'Cam', hex: '#F0945D', lightHex: '#FCC59F', darkHex: '#BD5E2A', accentHex: '#FFF1E6' },
  { id: 'pastel-blue', nameVi: 'Xanh pastel', hex: '#9EC5E8', lightHex: '#D1E7FA', darkHex: '#5F8BB5', accentHex: '#EDF6FE' },
];

export const RIBBON_COLORS: ColorOption<RibbonColorId>[] = [
  { id: 'red', nameVi: 'Đỏ', hex: '#B83B4A', lightHex: '#DE6A78', darkHex: '#7C202C', accentHex: '#FADADD' },
  { id: 'white', nameVi: 'Trắng', hex: '#FFFDF9', lightHex: '#FFFFFF', darkHex: '#DFD5C8', accentHex: '#F5EFE6' },
  { id: 'pink', nameVi: 'Hồng', hex: '#E9B8BE', lightHex: '#F7D8DC', darkHex: '#C4818B', accentHex: '#FFF2F4' },
  { id: 'cream', nameVi: 'Kem', hex: '#F5E6D3', lightHex: '#FFF6EB', darkHex: '#CBB59B', accentHex: '#FFF9F0' },
  { id: 'brown', nameVi: 'Nâu', hex: '#9C735B', lightHex: '#C29A82', darkHex: '#694836', accentHex: '#E9D6C8' },
  { id: 'pastel-blue', nameVi: 'Xanh pastel', hex: '#A5C8E1', lightHex: '#CFE5F5', darkHex: '#6A94B2', accentHex: '#EDF6FC' },
];

export const LETTER_TEXT_COLORS = [
  { id: 'burgundy', nameVi: 'Đỏ rượu', hex: '#813C4A' },
  { id: 'espresso', nameVi: 'Nâu mực', hex: '#4A342E' },
  { id: 'sage-dark', nameVi: 'Xanh rêu', hex: '#495A42' },
  { id: 'navy', nameVi: 'Xanh mực', hex: '#2F435A' },
  { id: 'rose-ink', nameVi: 'Hồng trầm', hex: '#A55365' },
];

export function getFlowerColor(id: FlowerColorId): ColorOption<FlowerColorId> {
  return FLOWER_COLORS.find((c) => c.id === id) ?? FLOWER_COLORS[0];
}

export function getRibbonColor(id: RibbonColorId): ColorOption<RibbonColorId> {
  return RIBBON_COLORS.find((c) => c.id === id) ?? RIBBON_COLORS[2];
}
