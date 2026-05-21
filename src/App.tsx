import { useState, useMemo, useEffect } from 'react';
import { SHAPES, SHAPE_COLORS, noteName, type ShapeName, type LabelMode } from './lib/theory';
import ShapeCard from './components/ShapeCard';
import KeySelector from './components/KeySelector';
import FretboardSection from './components/FretboardSection';

export default function App() {
  const [keyPc, setKeyPc]           = useState(0);
  const [activeShapes, setActiveShapes] = useState<ShapeName[]>(['C','A','G','E','D']);
  const [soloShape, setSoloShape]   = useState<ShapeName | null>(null);
  const [labelMode, setLabelMode]   = useState<LabelMode>('notes');
  const [showRootsOnly, setShowRootsOnly] = useState(false);
  const [useFlats, setUseFlats]     = useState(false);
  const [isNarrow, setIsNarrow]     = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 700,
  );

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visibleShapes = useMemo(
    () => soloShape ? [soloShape] : activeShapes,
    [soloShape, activeShapes],
  );

  const toggleShape = (name: ShapeName) => {
    setActiveShapes(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );
  };

  const toggleSolo = (name: ShapeName) => {
    setSoloShape(prev => prev === name ? null : name);
  };

  const keyName = noteName(keyPc, useFlats);

  return (
    <div className="max-w-[1480px] mx-auto px-8 pt-10 pb-20">
      {/* Header — brand + key display */}
      <header className="flex justify-between items-end gap-6 pb-7 mb-8 border-b border-line max-[1100px]:flex-col max-[1100px]:items-start">
        <div className="flex gap-4 items-center">
          <div className="shrink-0">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="4" y="4" width="28" height="28" rx="4" fill="#111" />
              <line x1="9" y1="10" x2="27" y2="10" stroke="#fff" strokeWidth="1.2" />
              <line x1="9" y1="14" x2="27" y2="14" stroke="#fff" strokeWidth="1.2" />
              <line x1="9" y1="18" x2="27" y2="18" stroke="#fff" strokeWidth="1.2" />
              <line x1="9" y1="22" x2="27" y2="22" stroke="#fff" strokeWidth="1.2" />
              <line x1="9" y1="26" x2="27" y2="26" stroke="#fff" strokeWidth="1.2" />
              <circle cx="14" cy="14" r="2.4" fill="#e85a3c" />
              <circle cx="22" cy="22" r="2.4" fill="#e85a3c" />
            </svg>
          </div>
          <div>
            <h1 className="m-0 font-serif font-normal text-[36px] leading-none tracking-[-0.01em]">
              CAGED Scale Shapes
            </h1>
            <p className="mt-1.5 text-ink-soft text-[14px]">
              Five shapes of the major scale across the neck.
            </p>
          </div>
        </div>

        {/* Key display */}
        <div className="flex items-baseline gap-3 px-[22px] pt-2.5 pb-3.5 bg-surface border border-line rounded-xl">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Key</span>
          <span className="font-serif text-[44px] leading-none text-ink">{keyName}</span>
          <span className="font-serif italic text-[18px] text-ink-soft">major</span>
        </div>
      </header>

      {/* Key selector — above shapes */}
      <KeySelector
        keyPc={keyPc}
        onKeyChange={setKeyPc}
        useFlats={useFlats}
        onUseFlats={setUseFlats}
      />

      {/* Shapes grid */}
      <div className="shapes-grid mb-9">
        {SHAPES.map(s => (
          <ShapeCard
            key={s.name}
            shape={s}
            color={SHAPE_COLORS[s.name]}
            keyPc={keyPc}
            isSolo={soloShape === s.name}
            isActive={activeShapes.includes(s.name)}
            onSolo={() => toggleSolo(s.name)}
            onToggle={() => toggleShape(s.name)}
          />
        ))}
      </div>

      {/* Fretboard toolbar */}
      <section className="fretboard-toolbar">
        {/* Show segmented control */}
        <div className="inline-flex items-center border border-line rounded-[10px] bg-surface p-[3px]">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted px-2">
            Show
          </span>
          {([
            { v: 'off'     as LabelMode, l: 'Off' },
            { v: 'notes'   as LabelMode, l: 'Notes' },
            { v: 'degrees' as LabelMode, l: 'Degrees' },
          ]).map(o => (
            <button
              key={o.v}
              className={`border-none text-[13px] font-semibold px-3 py-1.5 rounded-[7px] whitespace-nowrap transition-all duration-150 cursor-pointer${labelMode === o.v ? ' bg-ink text-surface' : ' bg-transparent text-ink-soft hover:text-ink'}`}
              onClick={() => setLabelMode(o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>

        {/* Roots only */}
        <button
          className={`border text-[13px] font-semibold px-3.5 py-[9px] rounded-[10px] whitespace-nowrap transition-all duration-150 cursor-pointer${showRootsOnly ? ' bg-ink text-surface border-ink' : ' bg-surface text-ink-soft border-line hover:text-ink hover:border-ink'}`}
          onClick={() => setShowRootsOnly(!showRootsOnly)}
        >
          Roots only
        </button>

        {/* Clear solo */}
        {soloShape && (
          <button
            className="border text-[13px] font-semibold px-3.5 py-[9px] rounded-[10px] whitespace-nowrap transition-all duration-150 cursor-pointer bg-transparent border-accent-red text-accent-red"
            onClick={() => setSoloShape(null)}
          >
            Clear solo
          </button>
        )}
      </section>

      {/* Fretboard + legend */}
      <FretboardSection
        keyPc={keyPc}
        useFlats={useFlats}
        visibleShapes={visibleShapes}
        shapeColors={SHAPE_COLORS}
        labelMode={labelMode}
        showRootsOnly={showRootsOnly}
        vertical={isNarrow}
        onSoloShape={toggleSolo}
      />

      <footer className="mt-4 text-center text-muted text-[13px]">
        <p>Tap a shape to solo it on the fretboard. Tap a key to transpose all five shapes.</p>
      </footer>
    </div>
  );
}
