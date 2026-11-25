export type FlowerId =
  | 'rose'
  | 'tulip'
  | 'sunflower'
  | 'babys-breath'
  | 'lily'
  | 'daisy'
  | 'peony'
  | 'carnation'
  | 'hydrangea'
  | 'lavender';

export type FlowerColorId =
  | 'red'
  | 'pink'
  | 'white'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pastel-blue';

export type WrappingPaperId =
  | 'kraft'
  | 'cream-white'
  | 'pastel-pink'
  | 'burgundy-wine'
  | 'translucent'
  | 'floral-pattern'
  | 'vintage'
  | 'korean-style';

export type WrappingStyleId =
  | 'korean'
  | 'classic'
  | 'vintage'
  | 'minimalist'
  | 'round'
  | 'natural'
  | 'luxury';

export type RibbonMaterialId = 'satin' | 'organza' | 'lace' | 'velvet';
export type RibbonColorId = 'red' | 'white' | 'pink' | 'cream' | 'brown' | 'pastel-blue';
export type BowStyleId = 'classic-bow' | 'double-loop' | 'long-tails' | 'korean-ribbon';

export type PhotoFrameId = 'polaroid' | 'film' | 'heart';
export type CardTemplateId = 'romantic' | 'vintage' | 'minimalist' | 'cute' | 'elegant';
export type CardFontId = 'sans' | 'serif' | 'script';
export type StickerId = 'heart' | 'flower' | 'star' | 'ribbon' | 'sparkle' | 'butterfly';

export interface SelectedFlower {
  id: string;
  flowerId: FlowerId;
  colorId: FlowerColorId;
  quantity: number;
}

export interface WrappingLayer {
  id: string;
  paperId: WrappingPaperId;
  tintHex: string;
  pattern: 'none' | 'dots' | 'floral' | 'stripes' | 'lace-edge';
}

export interface RibbonConfig {
  material: RibbonMaterialId;
  colorId: RibbonColorId;
  bowStyle: BowStyleId;
  tieVersion: number;
}

export interface PhotoMemory {
  id: string;
  /** Local data URL before sharing, or Supabase Storage public URL after sharing */
  imageUrl: string;
  frame: PhotoFrameId;
  caption: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  /** Placement on bouquet SVG (percentage 0-100) */
  posX: number;
  posY: number;
  scale: number;
  rotation: number;
}

export interface LetterSticker {
  id: string;
  type: StickerId;
  x: number;
  y: number;
}

export interface LetterConfig {
  recipientName: string;
  senderName: string;
  message: string;
  template: CardTemplateId;
  font: CardFontId;
  textColor: string;
  stickers: LetterSticker[];
  signatureDataUrl: string | null;
}

export interface BouquetDesign {
  flowers: SelectedFlower[];
  wrappingLayers: WrappingLayer[];
  wrappingStyle: WrappingStyleId;
  ribbon: RibbonConfig;
  photos: PhotoMemory[];
  letter: LetterConfig;
}

export interface SharedGiftRecord {
  id: string;
  bouquet_config: Omit<BouquetDesign, 'photos' | 'letter'>;
  letter_config: LetterConfig;
  photo_memories: PhotoMemory[];
  recipient_name: string;
  sender_name: string;
  thank_you_message?: string | null;
  thank_you_reaction?: string | null;
  thank_you_at?: string | null;
  created_at: string;
  expires_at: string;
}

export type ShopStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;
