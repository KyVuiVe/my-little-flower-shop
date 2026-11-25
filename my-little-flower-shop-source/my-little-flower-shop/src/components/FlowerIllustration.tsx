import React from 'react';
import { getFlowerColor } from '../data/colors';
import { FlowerColorId, FlowerId } from '../types/bouquet';

interface FlowerIllustrationProps {
  flowerId: FlowerId;
  colorId: FlowerColorId;
  size?: number;
  className?: string;
}

export const FlowerHeadSvg: React.FC<{ flowerId: FlowerId; colorId: FlowerColorId }> = ({
  flowerId,
  colorId,
}) => {
  const c = getFlowerColor(colorId);

  switch (flowerId) {
    case 'rose':
      return (
        <g>
          <circle cx="0" cy="0" r="23" fill={c.darkHex} opacity="0.9" />
          <ellipse cx="-9" cy="-6" rx="13" ry="10.5" fill={c.hex} stroke={c.darkHex} strokeWidth="0.9" transform="rotate(-20 -9 -6)" />
          <ellipse cx="9" cy="-6" rx="13" ry="10.5" fill={c.hex} stroke={c.darkHex} strokeWidth="0.9" transform="rotate(20 9 -6)" />
          <ellipse cx="0" cy="7.5" rx="15" ry="10.5" fill={c.hex} stroke={c.darkHex} strokeWidth="0.9" />
          <ellipse cx="-5.5" cy="-2" rx="9.5" ry="7.5" fill={c.lightHex} />
          <ellipse cx="5.5" cy="-1" rx="8.5" ry="7.5" fill={c.lightHex} />
          <path d="M -6 -2 C -4 -9, 6 -9, 7 -2 C 7 4, -2 7, -6 2 C -9 -2, -3 -6, 2 -4" fill="none" stroke={c.darkHex} strokeWidth="2" strokeLinecap="round" />
          <circle cx="0" cy="-1" r="3.8" fill={c.darkHex} opacity="0.72" />
        </g>
      );

    case 'tulip':
      return (
        <g>
          <path d="M -16 -3 C -19 -18, -11 -27, -2 -20 C -1 -8, -4 8, -1 16 C -10 16, -15 9, -16 -3 Z" fill={c.hex} stroke={c.darkHex} strokeWidth="1.3" />
          <path d="M 16 -3 C 19 -18, 11 -27, 2 -20 C 1 -8, 4 8, 1 16 C 10 16, 15 9, 16 -3 Z" fill={c.hex} stroke={c.darkHex} strokeWidth="1.3" />
          <path d="M -10 -5 C -11 -19, -5 -28, 0 -29 C 5 -28, 11 -19, 10 -5 C 9 9, 5 17, 0 17 C -5 17, -9 9, -10 -5 Z" fill={c.lightHex} stroke={c.darkHex} strokeWidth="1.3" />
          <path d="M 0 -24 C 0 -10, 0 4, 0 15" fill="none" stroke={c.darkHex} strokeWidth="0.9" opacity="0.35" />
        </g>
      );

    case 'sunflower':
      return (
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-20" rx="5.5" ry="11.5" fill={i % 2 === 0 ? c.hex : c.lightHex} stroke={c.darkHex} strokeWidth="0.9" transform={`rotate(${(i * 360) / 14})`} />
          ))}
          <circle cx="0" cy="0" r="12" fill="#634029" stroke="#472B1A" strokeWidth="1.5" />
          <circle cx="-4" cy="-3" r="1.5" fill="#A87A52" />
          <circle cx="4" cy="-2" r="1.5" fill="#A87A52" />
          <circle cx="0" cy="4" r="1.5" fill="#A87A52" />
        </g>
      );

    case 'babys-breath':
      return (
        <g>
          <path d="M 0 15 L 0 -12 M 0 4 L -14 -8 M 0 4 L 14 -8" stroke="#7F9872" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
          {[
            [0, -16, 6.2], [-13, -12, 5.8], [13, -12, 5.8], [-8, -22, 5.4], [8, -22, 5.4],
            [-17, -3, 5.2], [17, -3, 5.2], [-7, -6, 5.6], [7, -6, 5.6], [0, -4, 6.0],
            [-10, 4, 5.0], [10, 4, 5.0], [0, 6, 5.2],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={c.hex} stroke={c.darkHex} strokeWidth="1.15" />
              <circle cx={cx} cy={cy} r={r * 0.36} fill="#F2C85B" />
            </g>
          ))}
        </g>
      );

    case 'lily':
      return (
        <g>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path key={deg} d="M 0 0 C -8 -9, -7 -23, 0 -27 C 7 -23, 8 -9, 0 0 Z" fill={deg % 120 === 0 ? c.hex : c.lightHex} stroke={c.darkHex} strokeWidth="1.2" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="4.5" fill="#E6C25A" />
          {[-7, 0, 7].map((dx, i) => (
            <g key={i}>
              <line x1="0" y1="0" x2={dx} y2={dx === 0 ? -12 : -10} stroke="#9C7A3C" strokeWidth="1.2" />
              <circle cx={dx} cy={dx === 0 ? -12 : -10} r="2.2" fill="#C97336" />
            </g>
          ))}
        </g>
      );

    case 'daisy':
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-15.5" rx="4.6" ry="10.2" fill={c.hex} stroke={c.darkHex} strokeWidth="1.1" transform={`rotate(${i * 30})`} />
          ))}
          <circle cx="0" cy="0" r="8.2" fill="#F2C85B" stroke="#C9972E" strokeWidth="1.3" />
          <circle cx="-2" cy="-2" r="2" fill="#FFF2BE" opacity="0.8" />
        </g>
      );

    case 'peony':
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle key={deg} cx="0" cy="-12" r="11" fill={c.hex} stroke={c.darkHex} strokeWidth="1.0" transform={`rotate(${deg})`} />
          ))}
          {[22, 82, 142, 202, 262, 322].map((deg) => (
            <circle key={deg} cx="0" cy="-6.5" r="8.8" fill={c.lightHex} stroke={c.darkHex} strokeWidth="0.7" opacity="0.94" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="6.2" fill={c.accentHex} />
          <circle cx="0" cy="0" r="3.2" fill="#F2C963" />
        </g>
      );

    case 'carnation':
      return (
        <g>
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d="M 0 0 L -7 -20 L -2 -17 L 0 -22 L 3 -17 L 7 -20 Z" fill={i % 2 === 0 ? c.hex : c.lightHex} stroke={c.darkHex} strokeWidth="0.95" transform={`rotate(${i * 36})`} />
          ))}
          <circle cx="0" cy="0" r="7" fill={c.darkHex} opacity="0.32" />
          <circle cx="0" cy="0" r="4.5" fill={c.lightHex} />
        </g>
      );

    case 'hydrangea':
      return (
        <g>
          <circle cx="0" cy="0" r="21" fill={c.darkHex} opacity="0.22" />
          {[[-10, -9], [10, -10], [0, -14], [-14, 2], [13, 2], [-7, 11], [8, 10], [0, 0], [0, -4]].map(([bx, by], idx) => (
            <g key={idx} transform={`translate(${bx}, ${by})`}>
              {[0, 90, 180, 270].map((d) => (
                <ellipse key={d} cx="0" cy="-4.8" rx="4.0" ry="4.9" fill={idx % 2 === 0 ? c.hex : c.lightHex} stroke={c.darkHex} strokeWidth="0.85" transform={`rotate(${d})`} />
              ))}
              <circle cx="0" cy="0" r="1.6" fill="#FFF6D6" />
            </g>
          ))}
        </g>
      );

    case 'lavender':
      return (
        <g>
          <line x1="0" y1="20" x2="0" y2="-26" stroke="#7F9872" strokeWidth="2" strokeLinecap="round" />
          {[-26, -21, -16, -11, -6, -1, 4, 9].map((y, idx) => (
            <g key={idx}>
              <ellipse cx="-5.5" cy={y} rx="5.2" ry="3.6" fill={c.hex} stroke={c.darkHex} strokeWidth="0.85" transform={`rotate(-24 -5.5 ${y})`} />
              <ellipse cx="5.5" cy={y + 1.5} rx="5.2" ry="3.6" fill={c.lightHex} stroke={c.darkHex} strokeWidth="0.85" transform={`rotate(24 5.5 ${y + 1.5})`} />
              <ellipse cx="0" cy={y - 1.5} rx="4.2" ry="3.4" fill={c.hex} stroke={c.darkHex} strokeWidth="0.75" />
            </g>
          ))}
          <ellipse cx="0" cy="-29" rx="3.8" ry="4.8" fill={c.lightHex} stroke={c.darkHex} strokeWidth="0.85" />
        </g>
      );
  }
};

export const FlowerIllustration: React.FC<FlowerIllustrationProps> = ({
  flowerId,
  colorId,
  size = 64,
  className = '',
}) => (
  <svg width={size} height={size} viewBox="-36 -36 72 72" className={className} aria-hidden="true">
    <FlowerHeadSvg flowerId={flowerId} colorId={colorId} />
  </svg>
);
