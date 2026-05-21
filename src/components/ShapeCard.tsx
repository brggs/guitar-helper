import ShapeBox from './ShapeBox';
import { placeShape, type Shape } from '../lib/theory';

interface Props {
  shape: Shape;
  color: string;
  keyPc: number;
  isSolo: boolean;
  isActive: boolean;
  onSolo: () => void;
  onToggle: () => void;
}

export default function ShapeCard({ shape, color, keyPc, isSolo, isActive, onSolo, onToggle }: Props) {
  const placed = placeShape(shape, keyPc);
  const lo = placed.row0Fret;
  const hi = lo + 4;
  const fretLabel = lo === 0 ? 'Open' : `Fret ${lo}`;
  const rangeLabel = `Frets ${lo}–${hi}`;

  const cardStyle: React.CSSProperties = {
    ['--shape-accent' as string]: color,
  };
  if (isSolo) {
    cardStyle.boxShadow = `0 0 0 2px ${color}, 0 8px 24px -10px rgba(0,0,0,0.18)`;
    cardStyle.borderColor = 'transparent';
  }

  return (
    <div
      className={`bg-surface border border-line rounded-[14px] p-4 flex flex-col gap-2.5 transition-all duration-150 relative${!isActive && !isSolo ? ' opacity-45 hover:opacity-85' : ''}`}
      style={cardStyle}
    >
      {/* Fret position */}
      <div className="flex justify-between items-baseline px-1 pt-0.5 gap-2">
        <span
          className="font-serif italic text-[15px]"
          style={{ color }}
        >
          {fretLabel}
        </span>
      </div>

      {/* Shape diagram */}
      <ShapeBox
        shape={shape}
        color={color}
        active={true}
        onClick={onSolo}
      />

      {/* Range */}
      <div className="text-center font-mono text-[11px] font-semibold text-muted tracking-[0.04em] -mt-1">
        {rangeLabel}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-2 px-1">
        <button
          className={`rounded-full px-3 py-[5px] text-xs font-semibold border transition-all duration-150${isSolo ? ' text-white border-transparent' : ' border-line text-ink-soft hover:border-ink hover:text-ink'}`}
          style={isSolo ? { background: color, borderColor: color } : undefined}
          onClick={onSolo}
        >
          {isSolo ? 'Soloing' : 'Solo'}
        </button>
        <label className="flex items-center gap-1.5 text-xs text-ink-soft cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={onToggle}
            style={{ accentColor: 'var(--color-ink)', cursor: 'pointer' }}
          />
          <span>show</span>
        </label>
      </div>
    </div>
  );
}
