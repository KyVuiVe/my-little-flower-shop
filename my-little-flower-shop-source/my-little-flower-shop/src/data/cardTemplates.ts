import { CardTemplateId, StickerId } from '../types/bouquet';

export interface CardTemplateMeta {
  id: CardTemplateId;
  nameVi: string;
  bgClass: string;
  borderHex: string;
  accentHex: string;
  envelopeHex: string;
  envelopeFlapHex: string;
  defaultTextColor: string;
  subtitle: string;
}

export const CARD_TEMPLATES: CardTemplateMeta[] = [
  {
    id: 'romantic',
    nameVi: 'Romantic',
    bgClass: 'bg-gradient-to-br from-[#FFF5F7] via-[#FFF9F2] to-[#FCE8EC]',
    borderHex: '#E9B8BE',
    accentHex: '#C76878',
    envelopeHex: '#F3CFD4',
    envelopeFlapHex: '#E9B8BE',
    defaultTextColor: '#813C4A',
    subtitle: 'Hoa hồng phấn & viền trái tim ngọt ngào',
  },
  {
    id: 'vintage',
    nameVi: 'Vintage',
    bgClass: 'bg-gradient-to-br from-[#F7EEDB] via-[#FBF5E8] to-[#EFE0C3]',
    borderHex: '#B69A72',
    accentHex: '#8C6B43',
    envelopeHex: '#DFCAA7',
    envelopeFlapHex: '#CEB48B',
    defaultTextColor: '#5B412A',
    subtitle: 'Giấy thư cổ điển & tem bưu điện hoài niệm',
  },
  {
    id: 'minimalist',
    nameVi: 'Minimalist',
    bgClass: 'bg-[#FFFDF9]',
    borderHex: '#D8CFC4',
    accentHex: '#A8B59B',
    envelopeHex: '#EFE8DD',
    envelopeFlapHex: '#E3D9CA',
    defaultTextColor: '#4A3A3A',
    subtitle: 'Tối giản, thanh thoát với khoảng thở tinh tế',
  },
  {
    id: 'cute',
    nameVi: 'Cute',
    bgClass: 'bg-gradient-to-br from-[#FFF8E7] via-[#FFFDF7] to-[#FCEEF2]',
    borderHex: '#F5DFA8',
    accentHex: '#E298A6',
    envelopeHex: '#F9E5B7',
    envelopeFlapHex: '#F5D692',
    defaultTextColor: '#7A3E4C',
    subtitle: 'Scrapbook dễ thương cùng ngôi sao pastel',
  },
  {
    id: 'elegant',
    nameVi: 'Elegant',
    bgClass: 'bg-gradient-to-br from-[#FFF9F2] via-[#FFFFFF] to-[#F4ECE4]',
    borderHex: '#813C4A',
    accentHex: '#C5A059',
    envelopeHex: '#813C4A',
    envelopeFlapHex: '#682D39',
    defaultTextColor: '#5C2430',
    subtitle: 'Viền đôi ánh kim sang trọng và trang nhã',
  },
];

export const LETTER_STICKERS: { id: StickerId; label: string; emoji: string }[] = [
  { id: 'heart', label: 'Trái tim', emoji: '💗' },
  { id: 'flower', label: 'Hoa nhỏ', emoji: '🌸' },
  { id: 'star', label: 'Ngôi sao', emoji: '⭐' },
  { id: 'ribbon', label: 'Nơ hồng', emoji: '🎀' },
  { id: 'sparkle', label: 'Lấp lánh', emoji: '✨' },
  { id: 'butterfly', label: 'Bướm nhỏ', emoji: '🦋' },
];

export function getCardTemplate(id: CardTemplateId): CardTemplateMeta {
  return CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
}
