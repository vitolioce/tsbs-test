/**
 * TYPES & INTERFACES
 * Definizioni TypeScript per l'intera applicazione
 */

/**
 * Posizione 2D nella griglia (coordinate intere)
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Coordinate pixel assolute sul canvas
 */
export interface PixelPosition {
  x: number;
  y: number;
}

/**
 * Matrice 2D che rappresenta una forma
 * 1 = cella occupata, 0 = cella vuota
 */
export type ShapeMatrix = number[][];

/**
 * Definizione di una forma geometrica Tetris
 */
export interface ShapeDefinition {
  id: string;
  name: string;
  matrix: ShapeMatrix;
  color: string;
}

/**
 * Instanza di una forma posizionata nella griglia
 */
export interface PlacedShape {
  id: string; // ID univoco dell'instanza
  shapeId: string; // ID del tipo di forma
  position: Position; // Posizione nella griglia
  matrix: ShapeMatrix;
  color: string;
  hasOverlap?: boolean; // Indica se la forma si sovrappone con altre
}

/**
 * Stato della cella nella griglia
 * null = vuota, string = ID della forma che occupa la cella
 */
export type GridCell = string | null;

/**
 * Risultato della validazione di posizionamento
 */
export interface ValidationResult {
  valid: boolean;
  reason?: 'out-of-bounds' | 'collision' | 'valid';
  conflictingCells?: Position[];
}

/**
 * Configurazione della griglia
 */
export interface GridConfig {
  rows: number;
  cols: number;
  cellSize: number;
  cellGap?: number; // Spazio tra le celle in pixel (opzionale, default 0)
}

