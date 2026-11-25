import { getFlowerMeta } from '../data/flowers';
import { getWrappingStyle } from '../data/wrappingStyles';
import { BouquetDesign, FlowerColorId, FlowerId } from '../types/bouquet';

export interface StemPlacement {
  key: string;
  flowerId: FlowerId;
  colorId: FlowerColorId;
  x: number;
  y: number;
  angle: number;
  scale: number;
  zIndex: number;
}

/**
 * Deterministically computes natural flower head coordinates in a 420x520 SVG viewport
 * based on the selected flowers and wrapping style geometry.
 */
export function computeStemPlacements(design: BouquetDesign): StemPlacement[] {
  const style = getWrappingStyle(design.wrappingStyle);
  const expanded: { key: string; flowerId: FlowerId; colorId: FlowerColorId; role: string; stemHeight: number; headScale: number }[] = [];

  design.flowers.forEach((item) => {
    const meta = getFlowerMeta(item.flowerId);
    for (let i = 0; i < item.quantity; i += 1) {
      expanded.push({
        key: `${item.id}-${i}`,
        flowerId: item.flowerId,
        colorId: item.colorId,
        role: meta.role,
        stemHeight: meta.stemHeight,
        headScale: meta.headScale,
      });
    }
  });

  if (expanded.length === 0) return [];

  const roleWeight: Record<string, number> = { filler: 0, secondary: 1, focal: 2 };
  expanded.sort((a, b) => roleWeight[a.role] - roleWeight[b.role]);

  const total = expanded.length;
  const halfTop = style.coneWidthTop / 2;
  const safeMaxRx = Math.max(28, halfTop * 0.72);
  const minX = 210 - safeMaxRx;
  const maxX = 210 + safeMaxRx;
  const minY = style.id === 'minimalist' ? 168 : 158;
  const maxY = 258;

  const rowCount = total <= 4 ? 1 : total <= 10 ? 2 : 3;
  const rows: typeof expanded[] = Array.from({ length: rowCount }, () => []);
  expanded.forEach((stem, idx) => {
    const rIdx = Math.min(rowCount - 1, Math.floor((idx * rowCount) / total));
    rows[rIdx].push(stem);
  });

  const placed: StemPlacement[] = [];
  rows.forEach((rowItems, rIdx) => {
    const count = rowItems.length;
    const rowWidthFactor = rowCount === 1 ? 0.72 : rIdx === 0 ? 0.94 : rIdx === 1 ? 0.82 : 0.64;
    const rowRx = safeMaxRx * rowWidthFactor;
    const rowBaseY = rowCount === 1 ? 216 : 186 + rIdx * 32;

    rowItems.forEach((stem, i) => {
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
      const slightWave = Math.sin(i * 1.9 + rIdx * 2.1) * 4;
      const x = Math.max(minX, Math.min(maxX, 210 + t * rowRx + slightWave));

      const domeCurve = Math.pow(t, 2) * (style.id === 'round' ? 18 : 24);
      const heightLift = (stem.stemHeight - 1) * 34;
      const y = Math.max(minY, Math.min(maxY, rowBaseY + domeCurve - heightLift));

      const angle = t * Math.min(style.fanAngle * 0.65, 22);
      const densityScale = total > 14 ? 0.76 : total > 10 ? 0.82 : total > 6 ? 0.9 : 0.96;
      const scale = Math.min(1.06, stem.headScale * densityScale);

      placed.push({
        key: stem.key,
        flowerId: stem.flowerId,
        colorId: stem.colorId,
        x,
        y,
        angle,
        scale,
        zIndex: rIdx * 100 + roleWeight[stem.role] * 10 + Math.round(y),
      });
    });
  });

  return placed.sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Exports the live SVG bouquet element into a high-resolution PNG image with cozy cream backdrop.
 */
export async function exportSvgToPng(
  svgElement: SVGSVGElement,
  filename = 'my-little-flower-shop-bouquet.png',
  recipientName?: string,
  senderName?: string
): Promise<void> {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '840');
  clone.setAttribute('height', '1040');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Không thể xuất ảnh bó hoa.'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1240;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Trình duyệt không hỗ trợ Canvas.');

    // Warm cream background + delicate frame
    ctx.fillStyle = '#FFF5E9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#E9B8BE';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    ctx.fillStyle = '#813C4A';
    ctx.font = 'italic 32px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('My Little Flower Shop', canvas.width / 2, 84);

    ctx.drawImage(img, 80, 100, 840, 1040);

    if (recipientName || senderName) {
      ctx.fillStyle = '#813C4A';
      ctx.font = '24px sans-serif';
      const footer = [
        recipientName ? `Gửi đến: ${recipientName}` : '',
        senderName ? `Từ: ${senderName}` : '',
      ]
        .filter(Boolean)
        .join('  •  ');
      ctx.fillText(footer, canvas.width / 2, 1184);
    }

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
}
