import { noteName } from '../lib/theory';

interface Props {
  keyPc: number;
  onKeyChange: (pc: number) => void;
  useFlats: boolean;
  onUseFlats: (v: boolean) => void;
}

export default function KeySelector({ keyPc, onKeyChange, useFlats, onUseFlats }: Props) {
  return (
    <section className="flex items-end gap-3.5 flex-wrap mb-7">
      {/* Key group */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2.5">
          Choose a key
        </div>
        <div className="key-row">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i}
              className={`w-[50px] h-[50px] rounded-xl border font-serif text-[22px] leading-none transition-all duration-150 cursor-pointer hover:-translate-y-px hover:border-ink${keyPc === i ? ' bg-ink text-surface border-ink' : ' bg-surface text-ink border-line'}`}
              onClick={() => onKeyChange(i)}
              aria-pressed={keyPc === i}
            >
              {noteName(i, useFlats)}
            </button>
          ))}
        </div>
      </div>

      {/* Sharps / Flats toggle */}
      <button
        className={`border text-[13px] font-semibold px-3.5 py-[9px] rounded-[10px] whitespace-nowrap transition-all duration-150 cursor-pointer${useFlats ? ' bg-ink text-surface border-ink' : ' bg-surface text-ink-soft border-line hover:text-ink hover:border-ink'}`}
        onClick={() => onUseFlats(!useFlats)}
      >
        {useFlats ? '♭ Flats' : '♯ Sharps'}
      </button>
    </section>
  );
}
