import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BouquetDesign, PhotoMemory, SharedGiftRecord } from '../types/bouquet';
import { dataUrlToBlob } from './imageProcessor';
import { getCreatorEditToken, saveCreatorEditToken } from './storage';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const EXPIRY_DAYS = Number(import.meta.env.VITE_GIFT_EXPIRY_DAYS ?? 30);

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_ANON_KEY.includes('your-supabase-anon-key')
);

let supabaseClient: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

// In-memory store strictly for same-session Demo Mode when Supabase is not configured yet
const demoGiftMemoryStore = new Map<string, SharedGiftRecord>();

export interface CreateGiftResult {
  id: string;
  shareUrl: string;
  mode: 'supabase' | 'demo';
  expiresAt: string;
  editToken: string;
}

async function uploadMemoriesToSupabase(
  client: SupabaseClient,
  giftId: string,
  photos: PhotoMemory[]
): Promise<PhotoMemory[]> {
  const uploaded: PhotoMemory[] = [];
  for (const photo of photos) {
    if (photo.imageUrl.startsWith('http')) {
      uploaded.push(photo);
      continue;
    }
    const blob = dataUrlToBlob(photo.imageUrl);
    const filePath = `${giftId}/${crypto.randomUUID()}.jpg`;
    const { error } = await client.storage.from('gift-memories').upload(filePath, blob, {
      contentType: blob.type || 'image/jpeg',
      upsert: false,
    });
    if (error) {
      throw new Error(`Không thể tải ảnh lên Supabase Storage: ${error.message}`);
    }
    const { data } = client.storage.from('gift-memories').getPublicUrl(filePath);
    uploaded.push({ ...photo, imageUrl: data.publicUrl });
  }
  return uploaded;
}

export async function createSharedGift(design: BouquetDesign): Promise<CreateGiftResult> {
  const giftId = crypto.randomUUID();
  const editToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const origin = window.location.origin;

  const client = getSupabase();
  if (!client) {
    // Demo mode (in-memory only; explicitly warns user that cross-device links require Supabase)
    const demoRecord: SharedGiftRecord = {
      id: giftId,
      bouquet_config: {
        flowers: design.flowers,
        wrappingLayers: design.wrappingLayers,
        wrappingStyle: design.wrappingStyle,
        ribbon: design.ribbon,
      },
      letter_config: design.letter,
      photo_memories: design.photos,
      recipient_name: design.letter.recipientName,
      sender_name: design.letter.senderName,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    };
    demoGiftMemoryStore.set(giftId, demoRecord);
    saveCreatorEditToken(giftId, editToken);
    return {
      id: giftId,
      shareUrl: `${origin}/gift/${giftId}`,
      mode: 'demo',
      expiresAt,
      editToken,
    };
  }

  const uploadedPhotos = await uploadMemoriesToSupabase(client, giftId, design.photos);
  const { error } = await client.from('bouquet_gifts').insert({
    id: giftId,
    edit_token: editToken,
    bouquet_config: {
      flowers: design.flowers,
      wrappingLayers: design.wrappingLayers,
      wrappingStyle: design.wrappingStyle,
      ribbon: design.ribbon,
    },
    letter_config: design.letter,
    photo_memories: uploadedPhotos,
    recipient_name: design.letter.recipientName,
    sender_name: design.letter.senderName,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(`Không thể lưu món quà lên Supabase: ${error.message}`);
  }

  saveCreatorEditToken(giftId, editToken);
  return {
    id: giftId,
    shareUrl: `${origin}/gift/${giftId}`,
    mode: 'supabase',
    expiresAt,
    editToken,
  };
}

export async function fetchSharedGift(giftId: string): Promise<{ gift: SharedGiftRecord | null; mode: 'supabase' | 'demo' }> {
  const client = getSupabase();
  if (!client) {
    return { gift: demoGiftMemoryStore.get(giftId) ?? null, mode: 'demo' };
  }

  const { data, error } = await client.rpc('get_gift_by_id', { p_gift_id: giftId });
  if (error) {
    throw new Error(`Không thể tải món quà: ${error.message}`);
  }
  const row = Array.isArray(data) ? data[0] : data;
  return { gift: (row as SharedGiftRecord | undefined) ?? null, mode: 'supabase' };
}

export async function sendThankYouReply(
  giftId: string,
  reaction: string,
  message: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) {
    const existing = demoGiftMemoryStore.get(giftId);
    if (!existing) return false;
    existing.thank_you_reaction = reaction;
    existing.thank_you_message = message;
    existing.thank_you_at = new Date().toISOString();
    return true;
  }

  const { data, error } = await client.rpc('submit_gift_thank_you', {
    p_gift_id: giftId,
    p_reaction: reaction,
    p_message: message,
  });
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function deleteMyGift(giftId: string): Promise<boolean> {
  const editToken = getCreatorEditToken(giftId);
  if (!editToken) return false;
  const client = getSupabase();
  if (!client) {
    return demoGiftMemoryStore.delete(giftId);
  }
  const { data, error } = await client.rpc('delete_gift_with_token', {
    p_gift_id: giftId,
    p_edit_token: editToken,
  });
  if (error) throw new Error(error.message);
  return Boolean(data);
}
