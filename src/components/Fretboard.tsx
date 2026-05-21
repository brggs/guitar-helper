import {
  SHAPES, NUM_FRETS, STRING_LABELS,
  placeShape, shapeFretRange,
  pcAt, noteName, scaleDegree,
  type ShapeName, type LabelMode, type BoardTheme,
} from '../lib/theory';

interface Props {
  keyPc: number;
  useFlats: boolean;
  activeShapes: ShapeName[];
  shapeColors: Record<ShapeName, string>;
  labelMode: LabelMode;
  showRootsOnly: boolean;
  boardTheme: BoardTheme;
  vertical?: boolean;
}

const THEMES: Record<BoardTheme, Record<string, string>> = {
  rosewood: { board: '#3b2418', fretWire: '#9a8a73', inlay: '#d9cdb4', string: '#cfc8b7', nut: '#e8e2d2' },
  ebony:    { board: '#15110d', fretWire: '#6e6356', inlay: '#888073', string: '#cfc8b7', nut: '#e8e2d2' },
  maple:    { board: '#d6b582', fretWire: '#4b3a23', inlay: '#7a5a36', string: '#1a1410', nut: '#2a1d10' },
};

const FRET_MARKERS = new Set([3,5,7,9,15]);
const DOUBLE_MARKERS = new Set([12]);

export default function Fretboard({
  keyPc, useFlats, activeShapes, shapeColors,
  labelMode, showRootsOnly, boardTheme, vertical = false,
}: Props) {
  const theme = THEMES[boardTheme];
  const FRETS = NUM_FRETS;

  // Geometry constants
  const padL      = vertical ? 32 : 56;
  const padR      = vertical ? 52 : 24;
  const padT      = vertical ? 38 : 28;
  const padB      = vertical ? 14 : 36;
  const fretW     = vertical ? 0  : 68;
  const stringH   = vertical ? 0  : 34;
  const stringColW = vertical ? 38 : 0;
  const fretRowH   = vertical ? 48 : 0;
  const innerW    = vertical ? 6 * stringColW            : (FRETS + 1) * fretW;
  const innerH    = vertical ? (FRETS + 1) * fretRowH    : 5 * stringH;
  const W         = padL + innerW + padR;
  const H         = padT + innerH + padB;

  // Position helpers — orientation-aware
  const noteX = (str: number, fret: number) =>
    vertical ? padL + (str + 0.5) * stringColW
             : padL + (fret + 0.5) * fretW;

  const noteY = (str: number, fret: number) =>
    vertical ? padT + (fret + 0.5) * fretRowH
             : padT + (5 - str) * stringH;

  const fretLine = (f: number) => vertical
    ? { x1: padL,         y1: padT + f * fretRowH, x2: padL + innerW,  y2: padT + f * fretRowH }
    : { x1: padL + f * fretW, y1: padT,            x2: padL + f * fretW, y2: padT + innerH };

  const stringLine = (str: number) => vertical
    ? { x1: padL + (str + 0.5) * stringColW, y1: padT,   x2: padL + (str + 0.5) * stringColW, y2: padT + innerH }
    : { x1: padL, y1: padT + (5 - str) * stringH,        x2: padL + innerW, y2: padT + (5 - str) * stringH };

  const inlayXY = (f: number) => vertical
    ? { cx: padL + innerW / 2,           cy: padT + (f + 0.5) * fretRowH }
    : { cx: padL + (f + 0.5) * fretW,   cy: padT + innerH / 2 };

  const inlayDouble = (f: number) => vertical
    ? [
        { cx: padL + innerW * 0.32, cy: padT + (f + 0.5) * fretRowH },
        { cx: padL + innerW * 0.68, cy: padT + (f + 0.5) * fretRowH },
      ]
    : [
        { cx: padL + (f + 0.5) * fretW, cy: padT + stringH * 1.5 },
        { cx: padL + (f + 0.5) * fretW, cy: padT + stringH * 3.5 },
      ];

  const nutRect = vertical
    ? { x: padL - 2,  y: padT - 3, width: innerW + 4, height: 6 }
    : { x: padL - 3,  y: padT - 2, width: 6, height: innerH + 4 };

  const stringLabelXY = (str: number) => vertical
    ? { x: padL + (str + 0.5) * stringColW, y: padT - 14, textAnchor: 'middle' as const }
    : { x: padL - 14, y: padT + (5 - str) * stringH + 4, textAnchor: 'middle' as const };

  const fretNumXY = (f: number) => vertical
    ? { x: padL - 12, y: padT + (f + 0.5) * fretRowH + 4, textAnchor: 'middle' as const }
    : { x: padL + (f + 0.5) * fretW, y: padT + innerH + 18, textAnchor: 'middle' as const };

  // Build note map: "string_fret" → [{shapeName, kind}]
  const placed = SHAPES.map(s => placeShape(s, keyPc));
  const noteMap = new Map<string, Array<{ shapeName: ShapeName; kind: string }>>();
  for (const p of placed) {
    if (!activeShapes.includes(p.shapeName)) continue;
    for (const n of p.notes) {
      const k = `${n.string}_${n.fret}`;
      if (!noteMap.has(k)) noteMap.set(k, []);
      noteMap.get(k)!.push({ shapeName: p.shapeName, kind: n.kind });
    }
  }

  const kindRank = (k: string) => k === 'root' ? 0 : k === 'chord' ? 1 : 2;

  const renderDot = (str: number, fret: number, entries: Array<{ shapeName: ShapeName; kind: string }>) => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => kindRank(a.kind) - kindRank(b.kind));
    const top = sorted[0];
    if (showRootsOnly && top.kind !== 'root') return null;

    const colors = entries.map(e => shapeColors[e.shapeName]);
    const isRoot  = top.kind === 'root';
    const isChord = top.kind === 'chord';
    const R  = isRoot ? 14 : isChord ? 12 : 11;
    const cx = noteX(str, fret);
    const cy = noteY(str, fret);

    const slices = colors.length === 1
      ? [<circle key="c" cx={cx} cy={cy} r={R} fill={colors[0]} />]
      : colors.map((fill, i) => {
          const n  = colors.length;
          const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
          const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
          const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
          const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
          return (
            <path key={i}
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${(a1 - a0) > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`}
              fill={fill}
            />
          );
        });

    const ring = isRoot
      ? <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="#fff" strokeWidth="2" />
      : null;

    let label = null;
    if (labelMode !== 'off') {
      const pc   = pcAt(str, fret);
      const text = labelMode === 'degrees' ? scaleDegree(pc, keyPc) : noteName(pc, useFlats);
      label = (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fontFamily="'JetBrains Mono', monospace"
          fontSize={isRoot ? 11 : 10} fontWeight="700" fill="#fff" pointerEvents="none">
          {text}
        </text>
      );
    }

    return (
      <g key={`${str}-${fret}`}>
        {slices}
        {ring}
        {label}
      </g>
    );
  };

  const dots: React.ReactNode[] = [];
  for (const [k, entries] of noteMap.entries()) {
    const [strStr, fretStr] = k.split('_');
    dots.push(renderDot(parseInt(strStr), parseInt(fretStr), entries));
  }

  return (
    <div style={vertical ? undefined : { minWidth: 1380 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={vertical ? W : '100%'}
        height={vertical ? H : undefined}
        style={{ display: 'block' }}
      >
        {/* Board */}
        <rect x={padL} y={padT} width={innerW} height={innerH} fill={theme.board} />

        {/* Single inlay markers */}
        {[...FRET_MARKERS].map(f => {
          const { cx, cy } = inlayXY(f);
          return <circle key={`m-${f}`} cx={cx} cy={cy} r="6" fill={theme.inlay} opacity="0.35" />;
        })}
        {/* Double inlay markers */}
        {[...DOUBLE_MARKERS].map(f =>
          inlayDouble(f).map((pt, idx) => (
            <circle key={`dm-${f}-${idx}`} cx={pt.cx} cy={pt.cy} r="6" fill={theme.inlay} opacity="0.35" />
          ))
        )}

        {/* Fret wires */}
        {Array.from({ length: FRETS + 1 }, (_, f) => f + 1).map(f => {
          const { x1, y1, x2, y2 } = fretLine(f);
          return <line key={`fl-${f}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.fretWire} strokeWidth="1.5" />;
        })}

        {/* Nut */}
        <rect {...nutRect} fill={theme.nut} />

        {/* Strings — str 0 = low E (thickest), str 5 = high e (thinnest) */}
        {[0,1,2,3,4,5].map(str => {
          const { x1, y1, x2, y2 } = stringLine(str);
          return (
            <line key={`s-${str}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={theme.string} strokeWidth={1 + (5 - str) * 0.4} />
          );
        })}

        {/* String labels */}
        {[0,1,2,3,4,5].map(str => {
          const { x, y, textAnchor } = stringLabelXY(str);
          return (
            <text key={`sl-${str}`} x={x} y={y} textAnchor={textAnchor}
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="600" fill="#666">
              {STRING_LABELS[str]}
            </text>
          );
        })}

        {/* Fret numbers */}
        {Array.from({ length: FRETS + 1 }, (_, f) => f).map(f => {
          const isMarker = FRET_MARKERS.has(f) || DOUBLE_MARKERS.has(f);
          const { x, y, textAnchor } = fretNumXY(f);
          return (
            <text key={`fn-${f}`} x={x} y={y} textAnchor={textAnchor}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11" fontWeight={isMarker ? '700' : '500'}
              fill={isMarker ? '#111' : '#888'}>
              {f}
            </text>
          );
        })}

        {/* Shape brackets */}
        {placed.map((p, i) => {
          if (!activeShapes.includes(p.shapeName)) return null;
          const range = shapeFretRange(p);
          if (!range) return null;
          const [lo, hi] = range;
          const color = shapeColors[p.shapeName];
          if (vertical) {
            const y0 = padT + lo * fretRowH;
            const y1 = padT + (hi + 1) * fretRowH;
            const x  = padL + innerW + 14;
            return (
              <g key={`br-${i}`}>
                <line x1={x} y1={y0 + 4} x2={x} y2={y1 - 4} stroke={color} strokeWidth="3" strokeLinecap="round" />
                <text x={x + 8} y={(y0 + y1) / 2}
                  textAnchor="start" dominantBaseline="central"
                  fontFamily='"DM Serif Display", serif'
                  fontSize="14" fontWeight="700" fill={color}>
                  {p.shapeName}
                </text>
              </g>
            );
          }
          const x0 = padL + lo * fretW;
          const x1 = padL + (hi + 1) * fretW;
          const y  = padT - 14;
          return (
            <g key={`br-${i}`}>
              <line x1={x0 + 4} y1={y} x2={x1 - 4} y2={y} stroke={color} strokeWidth="3" strokeLinecap="round" />
              <text x={(x0 + x1) / 2} y={y - 5}
                textAnchor="middle" fontFamily='"DM Serif Display", serif'
                fontSize="14" fontWeight="700" fill={color}>
                {p.shapeName}
              </text>
            </g>
          );
        })}

        {/* Notes */}
        {dots}
      </svg>
    </div>
  );
}
