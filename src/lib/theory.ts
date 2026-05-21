export type ShapeName = 'C' | 'A' | 'G' | 'E' | 'D';
export type LabelMode = 'off' | 'notes' | 'degrees';
export type BoardTheme = 'rosewood' | 'maple' | 'ebony';
export type NoteKind = 'root' | 'chord' | 'scale';

export interface Shape {
  name: ShapeName;
  homePc: number;
  anchor: { string: number; row: number };
  grid: string[];
}

export interface PlacedNote {
  string: number;
  fret: number;
  kind: NoteKind;
  row: number;
  shapeName: ShapeName;
}

export interface PlacedShape {
  shapeName: ShapeName;
  notes: PlacedNote[];
  row0Fret: number;
}

export const NOTE_NAMES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NOTE_NAMES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// Standard tuning: low E → high E, open-string pitch classes (0=C)
export const TUNING = [4, 9, 2, 7, 11, 4];
export const STRING_LABELS = ['E','A','D','G','B','e'];
export const NUM_FRETS = 17;

export const SHAPES: Shape[] = [
  {
    name: 'C',
    homePc: 0,
    anchor: { string: 1, row: 3 },
    grid: ['BBBRBR', 'B...RB', '.BRB..', 'BRB.BB', '......'],
  },
  {
    name: 'A',
    homePc: 9,
    anchor: { string: 1, row: 1 },
    grid: ['.BBB..', 'BRB.BR', '...B..', 'BBRRRB', '....B.'],
  },
  {
    name: 'G',
    homePc: 7,
    anchor: { string: 0, row: 4 },
    grid: ['...B..', 'BBRRRB', '....B.', 'BRBB.B', 'RB..BR'],
  },
  {
    name: 'E',
    homePc: 4,
    anchor: { string: 0, row: 1 },
    grid: ['BBBB.B', 'RB..RR', '..BR..', 'BRRBBB', '......'],
  },
  {
    name: 'D',
    homePc: 2,
    anchor: { string: 2, row: 1 },
    grid: ['..BB..', 'BBRBBB', '......', 'BBBRBR', 'B...RB'],
  },
];

export const SHAPE_COLORS: Record<ShapeName, string> = {
  C: 'oklch(0.62 0.16 32)',
  A: 'oklch(0.68 0.14 85)',
  G: 'oklch(0.58 0.13 150)',
  E: 'oklch(0.55 0.14 240)',
  D: 'oklch(0.50 0.16 305)',
};

export function pcAt(string: number, fret: number): number {
  return ((TUNING[string] + fret) % 12 + 12) % 12;
}

export function placeShape(shape: Shape, keyPc: number): PlacedShape {
  const openPc = TUNING[shape.anchor.string];
  const anchorFret = ((keyPc - openPc) % 12 + 12) % 12;
  let row0Fret = anchorFret - shape.anchor.row;
  if (row0Fret <= 0) row0Fret += 12;

  const notes: PlacedNote[] = [];
  for (let row = 0; row < 5; row++) {
    for (let str = 0; str < 6; str++) {
      const c = shape.grid[row][str];
      if (c === '.') continue;
      const fret = row0Fret + row;
      if (fret < 0 || fret > NUM_FRETS) continue;
      let kind: NoteKind;
      if (c === 'R') {
        kind = pcAt(str, fret) === keyPc ? 'root' : 'chord';
      } else {
        kind = 'scale';
      }
      notes.push({ string: str, fret, kind, row, shapeName: shape.name });
    }
  }
  return { shapeName: shape.name, notes, row0Fret };
}

export function shapeFretRange(placed: PlacedShape): [number, number] | null {
  if (placed.notes.length === 0) return null;
  let lo = Infinity, hi = -Infinity;
  for (const n of placed.notes) {
    if (n.fret < lo) lo = n.fret;
    if (n.fret > hi) hi = n.fret;
  }
  return [lo, hi];
}

export function noteName(pc: number, useFlats = false): string {
  return (useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP)[((pc % 12) + 12) % 12];
}

export function scaleDegree(pc: number, keyPc: number): string {
  const ivl = ((pc - keyPc) % 12 + 12) % 12;
  const map: Record<number, string> = { 0:'1', 2:'2', 4:'3', 5:'4', 7:'5', 9:'6', 11:'7' };
  return map[ivl] ?? '';
}
