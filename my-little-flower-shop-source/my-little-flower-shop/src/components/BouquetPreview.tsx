import React, { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRibbonColor } from '../data/colors';
import { getWrappingPaper } from '../data/wrappingPapers';
import { getWrappingStyle } from '../data/wrappingStyles';
import { computeStemPlacements } from '../lib/bouquetRenderer';
import { BouquetDesign } from '../types/bouquet';
import { FlowerHeadSvg } from './FlowerIllustration';

interface BouquetPreviewProps {
  design: BouquetDesign;
  compact?: boolean;
  revealAnimation?: boolean;
  className?: string;
}

export const BouquetPreview = forwardRef<SVGSVGElement, BouquetPreviewProps>(
  ({ design, compact = false, revealAnimation = false, className = '' }, ref) => {
    const placements = useMemo(() => computeStemPlacements(design), [design]);
    const style = getWrappingStyle(design.wrappingStyle);
    const ribbonColor = getRibbonColor(design.ribbon.colorId);

    const layers = design.wrappingLayers.length > 0
      ? design.wrappingLayers
      : [{ id: 'fallback', paperId: 'cream-white' as const, tintHex: '', pattern: 'none' as const }];

    const halfTop = style.coneWidthTop / 2;
    const halfBot = style.coneWidthBottom / 2;

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          ref={ref}
          viewBox="0 0 420 520"
          className={`w-full ${compact ? 'max-w-[260px]' : 'max-w-[380px]'} h-auto drop-shadow-[0_14px_24px_rgba(129,60,74,0.14)] select-none`}
          role="img"
          aria-label="Bó hoa đang thiết kế tại My Little Flower Shop"
        >
          <defs>
            <radialGradient id="bouquetGlow" cx="50%" cy="42%" r="48%">
              <stop offset="0%" stopColor="#F5DFA8" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#FFF5E9" stopOpacity="0" />
            </radialGradient>

            <pattern id="pat-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="1.6" fill="#813C4A" fillOpacity="0.16" />
            </pattern>
            <pattern id="pat-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#7A5A3E" strokeWidth="1.4" strokeOpacity="0.15" />
            </pattern>
            <pattern id="pat-floral" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r="2.2" fill="#D98B96" fillOpacity="0.28" />
              <circle cx="11" cy="7" r="2" fill="#E9B8BE" fillOpacity="0.32" />
              <circle cx="15" cy="11" r="2" fill="#E9B8BE" fillOpacity="0.32" />
              <circle cx="11" cy="15" r="2" fill="#E9B8BE" fillOpacity="0.32" />
              <circle cx="7" cy="11" r="2" fill="#E9B8BE" fillOpacity="0.32" />
            </pattern>
            <pattern id="pat-lace-edge" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.45" />
            </pattern>
          </defs>

          {/* Warm sunlight halo */}
          <circle cx="210" cy="225" r="195" fill="url(#bouquetGlow)" />

          {/* BACK WRAPPING PAPER LAYERS */}
          {layers.map((layer, index) => {
            const meta = getWrappingPaper(layer.paperId);
            const fillHex = layer.tintHex || meta.baseHex;
            const spread = (layers.length - index) * 16 * style.collarScaleX + 12;
            const lift = (layers.length - index) * 18 * style.collarHeight + 10;
            const skew = style.foldStyle === 'asymmetric' ? (index % 2 === 0 ? -12 : 14) : 0;

            const backPath =
              style.foldStyle === 'ruffled' || style.foldStyle === 'grand'
                ? `M ${210 - halfTop - spread + skew} ${250 - lift}
                   Q ${210 - halfTop * 0.45} ${120 - lift}, 210 ${155 - lift}
                   Q ${210 + halfTop * 0.45} ${120 - lift}, ${210 + halfTop + spread + skew} ${250 - lift}
                   L ${210 + halfBot + 8} 445
                   L ${210 - halfBot - 8} 445 Z`
                : style.foldStyle === 'dome'
                ? `M ${210 - halfTop - spread} ${265 - lift * 0.7}
                   Q 210 ${110 - lift * 0.7}, ${210 + halfTop + spread} ${265 - lift * 0.7}
                   L ${210 + halfBot + 6} 442
                   L ${210 - halfBot - 6} 442 Z`
                : `M ${210 - halfTop - spread + skew} ${238 - lift}
                   L ${210 - 20 + skew * 0.4} ${145 - lift}
                   L ${210 + halfTop + spread + skew} ${238 - lift}
                   L ${210 + halfBot + 6} 445
                   L ${210 - halfBot - 6} 445 Z`;

            return (
              <g key={layer.id} opacity={meta.opacity}>
                <path d={backPath} fill={fillHex} stroke={meta.edgeHex} strokeWidth="2" strokeLinejoin="round" />
                {layer.pattern !== 'none' && (
                  <path d={backPath} fill={`url(#pat-${layer.pattern})`} />
                )}
              </g>
            );
          })}

          {/* TUCKED GREENERY STRICTLY INSIDE PAPER COLLAR */}
          {placements.length >= 2 && (
            <g opacity="0.82">
              {(placements.length >= 5
                ? [-Math.min(halfTop * 0.56, 46), -Math.min(halfTop * 0.56, 46) * 0.42, Math.min(halfTop * 0.56, 46) * 0.42, Math.min(halfTop * 0.56, 46)]
                : [-Math.min(halfTop * 0.56, 46) * 0.65, Math.min(halfTop * 0.56, 46) * 0.65]
              ).map((dx, i) => (
                <g key={i} transform={`translate(${210 + dx}, 236) rotate(${dx * 0.42})`}>
                  <ellipse cx="-7" cy="-24" rx="6.5" ry="11" fill="#A8B59B" stroke="#7E9472" strokeWidth="0.8" transform="rotate(-22 -7 -24)" />
                  <ellipse cx="7" cy="-18" rx="6.5" ry="11" fill="#95A888" stroke="#7E9472" strokeWidth="0.8" transform="rotate(22 7 -18)" />
                  <ellipse cx="0" cy="-34" rx="5.5" ry="9.5" fill="#B5C2A9" stroke="#7E9472" strokeWidth="0.8" />
                </g>
              ))}
            </g>
          )}

          {/* STEMS */}
          <g>
            {placements.map((stem) => (
              <path
                key={`stem-${stem.key}`}
                d={`M ${stem.x} ${stem.y + 8} Q ${(stem.x + 210) / 2} 305, ${210 + (stem.x - 210) * 0.1} 355`}
                stroke="#6E8B63"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>

          {/* FLOWER HEADS */}
          <g>
            {placements.map((stem, idx) => (
              <motion.g
                key={stem.key}
                initial={revealAnimation ? { opacity: 0, scale: 0.3 } : { opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: revealAnimation ? 0.55 : 0.3,
                  delay: revealAnimation ? idx * 0.05 : 0,
                  type: 'spring',
                  stiffness: 240,
                  damping: 18,
                }}
                style={{ originX: `${stem.x}px`, originY: `${stem.y}px` }}
              >
                <g transform={`translate(${stem.x}, ${stem.y}) rotate(${stem.angle}) scale(${stem.scale})`}>
                  <FlowerHeadSvg flowerId={stem.flowerId} colorId={stem.colorId} />
                </g>
              </motion.g>
            ))}
          </g>

          {/* EMPTY STATE PROMPT INSIDE BOUQUET */}
          {placements.length === 0 && (
            <g>
              <circle cx="210" cy="215" r="56" fill="#FFF5E9" fillOpacity="0.85" stroke="#E9B8BE" strokeDasharray="5 5" strokeWidth="2" />
              <text x="210" y="212" textAnchor="middle" fill="#813C4A" fontSize="13" fontWeight="600">
                Chọn hoa ở quầy
              </text>
              <text x="210" y="230" textAnchor="middle" fill="#813C4A" fontSize="11" opacity="0.75">
                để bắt đầu cắm bó hoa
              </text>
            </g>
          )}

          {/* FRONT WRAPPING PAPER FOLD (CONE) */}
          {(() => {
            const frontLayer = layers[layers.length - 1];
            const meta = getWrappingPaper(frontLayer.paperId);
            const fillHex = frontLayer.tintHex || meta.baseHex;
            const leftFlap = `M ${210 - halfTop * 0.92} 266 L 210 342 L ${210 - halfBot} 450 L ${210 - halfTop * 0.56} 348 Z`;
            const rightFlap = `M ${210 + halfTop * 0.92} 266 L 210 342 L ${210 + halfBot} 450 L ${210 + halfTop * 0.56} 348 Z`;
            const centerCone = `M ${210 - halfTop * 0.72} 296 Q 210 326, ${210 + halfTop * 0.72} 296 L ${210 + halfBot} 452 Q 210 462, ${210 - halfBot} 452 Z`;

            return (
              <g opacity={Math.min(0.98, meta.opacity + 0.05)}>
                <path d={leftFlap} fill={fillHex} stroke={meta.edgeHex} strokeWidth="1.8" strokeLinejoin="round" />
                <path d={rightFlap} fill={fillHex} stroke={meta.edgeHex} strokeWidth="1.8" strokeLinejoin="round" />
                <path d={centerCone} fill={fillHex} stroke={meta.edgeHex} strokeWidth="2" strokeLinejoin="round" />
                {frontLayer.pattern !== 'none' && (
                  <path d={centerCone} fill={`url(#pat-${frontLayer.pattern})`} />
                )}
              </g>
            );
          })()}

          {/* ATTACHED PHOTOCARD MEMORIES */}
          {design.photos.map((photo) => {
            const px = (photo.posX / 100) * 420;
            const py = (photo.posY / 100) * 520;
            const clipId = `photo-clip-${photo.id}`;
            return (
              <g
                key={photo.id}
                transform={`translate(${px}, ${py}) rotate(${photo.rotation}) scale(${photo.scale})`}
              >
                {/* Wooden stick holding the photocard into the bouquet */}
                <line x1="0" y1="24" x2="0" y2="62" stroke="#B78F64" strokeWidth="2.5" strokeLinecap="round" />

                {photo.frame === 'polaroid' && (
                  <g>
                    <rect x="-32" y="-36" width="64" height="78" rx="4" fill="#FFFDF9" stroke="#E2D3C2" strokeWidth="1.4" />
                    <clipPath id={clipId}>
                      <rect x="-26" y="-30" width="52" height="50" rx="2" />
                    </clipPath>
                    <image
                      href={photo.imageUrl}
                      x={-26 + photo.offsetX * 0.3}
                      y={-30 + photo.offsetY * 0.3}
                      width={52 * photo.zoom}
                      height={50 * photo.zoom}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#${clipId})`}
                    />
                    <text x="0" y="34" textAnchor="middle" fill="#813C4A" fontSize="7.5" fontFamily="'Dancing Script', cursive">
                      {(photo.caption || 'Kỷ niệm đẹp').slice(0, 18)}
                    </text>
                  </g>
                )}

                {photo.frame === 'film' && (
                  <g>
                    <rect x="-35" y="-34" width="70" height="72" rx="3" fill="#2F2625" stroke="#504240" strokeWidth="1.2" />
                    {[-26, -14, -2, 10, 22].map((sy) => (
                      <g key={sy}>
                        <rect x="-32" y={sy} width="4" height="6" rx="1" fill="#FFF5E9" opacity="0.85" />
                        <rect x="28" y={sy} width="4" height="6" rx="1" fill="#FFF5E9" opacity="0.85" />
                      </g>
                    ))}
                    <clipPath id={clipId}>
                      <rect x="-24" y="-26" width="48" height="44" rx="1" />
                    </clipPath>
                    <image
                      href={photo.imageUrl}
                      x={-24 + photo.offsetX * 0.3}
                      y={-26 + photo.offsetY * 0.3}
                      width={48 * photo.zoom}
                      height={44 * photo.zoom}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#${clipId})`}
                    />
                    <text x="0" y="30" textAnchor="middle" fill="#F5DFA8" fontSize="6.5">
                      {(photo.caption || 'FILM 35MM').slice(0, 16)}
                    </text>
                  </g>
                )}

                {photo.frame === 'heart' && (
                  <g>
                    <clipPath id={clipId}>
                      <path d="M 0 26 C -34 4, -36 -26, -15 -30 C -4 -32, 0 -22, 0 -17 C 0 -22, 4 -32, 15 -30 C 36 -26, 34 4, 0 26 Z" />
                    </clipPath>
                    <path
                      d="M 0 29 C -37 6, -39 -29, -16 -33 C -4 -35, 0 -24, 0 -19 C 0 -24, 4 -35, 16 -33 C 39 -29, 37 6, 0 29 Z"
                      fill="#FFFDF9"
                      stroke="#E9B8BE"
                      strokeWidth="2"
                    />
                    <image
                      href={photo.imageUrl}
                      x={-36 + photo.offsetX * 0.3}
                      y={-34 + photo.offsetY * 0.3}
                      width={72 * photo.zoom}
                      height={66 * photo.zoom}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#${clipId})`}
                    />
                    {photo.caption && (
                      <text x="0" y="40" textAnchor="middle" fill="#813C4A" fontSize="7.5" fontWeight="600">
                        {photo.caption.slice(0, 18)}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* RIBBON & BOW WITH TYING ANIMATION */}
          <motion.g
            key={`ribbon-${design.ribbon.material}-${design.ribbon.colorId}-${design.ribbon.bowStyle}-${design.ribbon.tieVersion}`}
            initial={{ scale: 0.72, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            style={{ originX: '210px', originY: '372px' }}
          >
            {/* Waistband */}
            <rect
              x={210 - halfBot - 18}
              y="362"
              width={(halfBot + 18) * 2}
              height="18"
              rx="8"
              fill={ribbonColor.hex}
              stroke={ribbonColor.darkHex}
              strokeWidth="1.5"
              strokeDasharray={design.ribbon.material === 'lace' ? '4 2' : undefined}
              opacity={design.ribbon.material === 'organza' ? 0.78 : 0.98}
            />

            {/* Ribbon tails */}
            <path
              d={
                design.ribbon.bowStyle === 'long-tails'
                  ? 'M 204 378 Q 180 432, 166 488 L 182 480 Q 194 432, 210 380 Z'
                  : 'M 204 378 Q 186 416, 178 446 L 192 438 Q 200 412, 210 380 Z'
              }
              fill={ribbonColor.hex}
              stroke={ribbonColor.darkHex}
              strokeWidth="1.2"
              opacity={design.ribbon.material === 'organza' ? 0.76 : 0.96}
            />
            <path
              d={
                design.ribbon.bowStyle === 'long-tails'
                  ? 'M 216 378 Q 244 432, 256 490 L 240 482 Q 228 432, 210 380 Z'
                  : 'M 216 378 Q 236 416, 244 446 L 230 438 Q 222 412, 210 380 Z'
              }
              fill={ribbonColor.hex}
              stroke={ribbonColor.darkHex}
              strokeWidth="1.2"
              opacity={design.ribbon.material === 'organza' ? 0.76 : 0.96}
            />

            {/* Bow loops */}
            <path
              d="M 208 372 C 176 346, 152 362, 162 384 C 170 400, 194 388, 208 376 Z"
              fill={ribbonColor.hex}
              stroke={ribbonColor.darkHex}
              strokeWidth="1.4"
              opacity={design.ribbon.material === 'organza' ? 0.8 : 0.98}
            />
            <path
              d="M 212 372 C 244 346, 268 362, 258 384 C 250 400, 226 388, 212 376 Z"
              fill={ribbonColor.hex}
              stroke={ribbonColor.darkHex}
              strokeWidth="1.4"
              opacity={design.ribbon.material === 'organza' ? 0.8 : 0.98}
            />

            {design.ribbon.bowStyle === 'double-loop' && (
              <>
                <path
                  d="M 208 372 C 184 356, 168 368, 174 381 C 180 392, 198 383, 208 375 Z"
                  fill={ribbonColor.lightHex}
                  stroke={ribbonColor.darkHex}
                  strokeWidth="1"
                />
                <path
                  d="M 212 372 C 236 356, 252 368, 246 381 C 240 392, 222 383, 212 375 Z"
                  fill={ribbonColor.lightHex}
                  stroke={ribbonColor.darkHex}
                  strokeWidth="1"
                />
              </>
            )}

            {/* Satin sheen highlight */}
            {design.ribbon.material === 'satin' && (
              <ellipse cx="186" cy="368" rx="10" ry="3.5" fill="#FFFFFF" opacity="0.38" transform="rotate(-14 186 368)" />
            )}

            {/* Center knot */}
            <rect
              x="201"
              y="363"
              width="18"
              height="18"
              rx="7"
              fill={ribbonColor.darkHex}
              stroke={ribbonColor.lightHex}
              strokeWidth="1.2"
            />
          </motion.g>
        </svg>
      </div>
    );
  }
);

BouquetPreview.displayName = 'BouquetPreview';
