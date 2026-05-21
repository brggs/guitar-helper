import type { Shape } from '../lib/theory';

interface Props {
  shape: Shape;
  color: string;
  active?: boolean;
  onClick?: () => void;
}

export default function ShapeBox({ shape, color, active = false, onClick }: Props) {
  const W = 188, H = 290;
  const padX = 14, padTop = 18, padBottom = 56;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;
  const cellW = innerW / 5;
  const cellH = innerH / 5;
  const dotR = Math.min(cellW, cellH) * 0.32;
  const TOP_BAR_H = 8;
  const stroke = '#111';

  const stringX = (s: number) => padX + (s / 5) * innerW;
  const rowY = (r: number) => padTop + (r + 0.5) * cellH;
  const fretLineY = (r: number) => padTop + r * cellH;

  return (
    <div
      className={`w-full${active ? ' is-active' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default', ['--shape-accent' as string]: color }}
      onClick={onClick}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Color accent ribbon */}
        <rect x={padX} y={4} width={innerW} height={6} fill={color} rx="2" />
        {/* Nut bar */}
        <rect x={padX - 2} y={padTop - TOP_BAR_H} width={innerW + 4} height={TOP_BAR_H} fill={stroke} />
        {/* Box outline */}
        <rect x={padX} y={padTop} width={innerW} height={innerH} fill="none" stroke={stroke} strokeWidth="3" />
        {/* Fret lines */}
        {[1,2,3,4].map(r => (
          <line key={r} x1={padX} y1={fretLineY(r)} x2={padX + innerW} y2={fretLineY(r)} stroke={stroke} strokeWidth="3" />
        ))}
        {/* Strings */}
        {[0,1,2,3,4,5].map(s => (
          <line key={s} x1={stringX(s)} y1={padTop} x2={stringX(s)} y2={padTop + innerH} stroke={stroke} strokeWidth="2" />
        ))}
        {/* Dots */}
        {shape.grid.map((rowStr, r) =>
          [...rowStr].map((c, s) => {
            if (c === '.') return null;
            const fill = c === 'R' ? 'var(--color-accent-red)' : '#111';
            return (
              <circle key={`${r}-${s}`} cx={stringX(s)} cy={rowY(r)} r={dotR} fill={fill} />
            );
          })
        )}
        {/* Shape letter */}
        <text
          x={W / 2}
          y={H - 14}
          textAnchor="middle"
          fontFamily='"DM Serif Display", serif'
          fontWeight="700"
          fontSize="40"
          fill="#111"
        >
          {shape.name}
        </text>
      </svg>
    </div>
  );
}
