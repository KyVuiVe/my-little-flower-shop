import { BouquetDesign } from '../types/bouquet';

const DRAFT_KEY = 'mlfs_draft_bouquet_v1';
const CREATOR_TOKENS_KEY = 'mlfs_creator_tokens_v1';

export const DEFAULT_BOUQUET: BouquetDesign = {
  flowers: [
    { id: 'init-1', flowerId: 'rose', colorId: 'pink', quantity: 3 },
    { id: 'init-2', flowerId: 'tulip', colorId: 'white', quantity: 2 },
    { id: 'init-3', flowerId: 'babys-breath', colorId: 'white', quantity: 2 },
  ],
  wrappingLayers: [
    { id: 'layer-1', paperId: 'cream-white', tintHex: '', pattern: 'none' },
    { id: 'layer-2', paperId: 'pastel-pink', tintHex: '', pattern: 'dots' },
  ],
  wrappingStyle: 'korean',
  ribbon: {
    material: 'satin',
    colorId: 'pink',
    bowStyle: 'korean-ribbon',
    tieVersion: 1,
  },
  photos: [],
  letter: {
    recipientName: '',
    senderName: '',
    message: '',
    template: 'romantic',
    font: 'script',
    textColor: '#813C4A',
    stickers: [],
    signatureDataUrl: null,
  },
};

export function loadDraftDesign(): BouquetDesign | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BouquetDesign;
  } catch {
    return null;
  }
}

export function saveDraftDesign(design: BouquetDesign): boolean {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(design));
    return true;
  } catch {
    return false;
  }
}

export function clearDraftDesign(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore storage errors
  }
}

export function saveCreatorEditToken(giftId: string, editToken: string): void {
  try {
    const raw = window.localStorage.getItem(CREATOR_TOKENS_KEY);
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    map[giftId] = editToken;
    window.localStorage.setItem(CREATOR_TOKENS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getCreatorEditToken(giftId: string): string | null {
  try {
    const raw = window.localStorage.getItem(CREATOR_TOKENS_KEY);
    if (!raw) return null;
    const map: Record<string, string> = JSON.parse(raw);
    return map[giftId] ?? null;
  } catch {
    return null;
  }
}
