import Fretboard from './Fretboard';
import { SHAPES, noteName, type ShapeName, type LabelMode } from '../lib/theory';

interface Props {
  keyPc: number;
  useFlats: boolean;
  visibleShapes: ShapeName[];
  shapeColors: Record<ShapeName, string>;
  labelMode: LabelMode;
  showRootsOnly: boolean;
  vertical: boolean;
  onSoloShape: (name: ShapeName) => void;
}

export default function FretboardSection({
  keyPc, useFlats, visibleShapes, shapeColors,
  labelMode, showRootsOnly, vertical, onSoloShape,
}: Props) {
  const keyName = noteName(keyPc, useFlats);

  return (
    <section className="bg-surface border border-line rounded-2xl pt-5 px-3 pb-4 mb-6">
      {/* Fretboard */}
      <div className={`fretboard-scroll${vertical ? ' is-vertical' : ''}`}>
        <Fretboard
          keyPc={keyPc}
          useFlats={useFlats}
          activeShapes={visibleShapes}
          shapeColors={shapeColors}
          labelMode={labelMode}
          showRootsOnly={showRootsOnly}
          boardTheme="rosewood"
          vertical={vertical}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-8 px-4 pt-4 pb-1 flex-wrap">
        {/* Notes group */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mr-1">
            Notes
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] text-ink-soft whitespace-nowrap">
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-accent-red" style={{ boxShadow: '0 0 0 2px #111' }} />
            Root <b>{keyName}</b>
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] text-ink-soft whitespace-nowrap">
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-accent-red" />
            Chord tone
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] text-ink-soft whitespace-nowrap">
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#111]" />
            Scale note
          </span>
        </div>

        {/* Shapes group */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mr-1">
            Shapes
          </span>
          {SHAPES.map(s => {
            const isVisible = visibleShapes.includes(s.name);
            return (
              <span
                key={s.name}
                className={`inline-flex items-center gap-2 cursor-pointer px-2.5 py-1 rounded-full border border-line font-serif text-[16px] text-ink transition-all duration-150 hover:border-ink${!isVisible ? ' opacity-35' : ''}`}
                onClick={() => onSoloShape(s.name)}
              >
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ background: shapeColors[s.name] }}
                />
                {s.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
