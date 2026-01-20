/**
 * SHAPE DEFINITIONS
 * Definizioni delle forme geometriche stile Tetris
 * Ogni forma è rappresentata come matrice 2D
 */

import { ShapeDefinition, ShapeMatrix } from '../types';

/**
 * Forma I (barra orizzontale)
 * ■ ■ ■ ■
 */
const I_SHAPE: ShapeMatrix = [
  [1, 1, 1, 1]
];

/**
 * Forma L (orizzontale)
 * ■ ■ ■
 * ■ □ □
 */
const L_SHAPE: ShapeMatrix = [
  [1, 1, 1],
  [1, 0, 0]
];

/**
 * Forma T
 * ■ ■ ■
 * □ ■ □
 */
/* const T_SHAPE: ShapeMatrix = [
  [1, 1, 1],
  [0, 1, 0]
]; */

/**
 * Forma O (quadrato)
 * ■ ■
 * ■ ■
 */
const O_SHAPE: ShapeMatrix = [
  [1, 1],
  [1, 1]
];

/**
 * Forma Z
 * ■ ■ □
 * □ ■ ■
 */
const Z_SHAPE: ShapeMatrix = [
  [1, 1],
  [0, 1]
];

/**
 * Forma S (inversa di Z)
 * □ ■ ■
 * ■ ■ □
 */
/* const S_SHAPE: ShapeMatrix = [
  [1, 1],
  [1, 0]
]; */

/**
 * Forma J (L invertita orizzontale)
 * ■ □ □
 * ■ ■ ■
 */
const J_SHAPE: ShapeMatrix = [
  [1, 0, 0],
  [1, 1, 1]
];

/**
 * Forma U
 * ■ □ ■
 * ■ ■ ■
 */
/* const U_SHAPE: ShapeMatrix = [
  [1, 0, 1],
  [1, 1, 1]
]; */

const F_SHAPE: ShapeMatrix = [
  [1],
  [1]
];

const G_SHAPE: ShapeMatrix = [
  [1]
];

const Q_SHAPE: ShapeMatrix = [
  [0, 1, 0],
  [1, 1, 1],
  [1, 1, 1]
];

/**
 * Catalogo completo delle forme disponibili
 */
export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    id: 'I',
    name: 'Gems',
    matrix: I_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'F',
    name: 'Oscar',
    matrix: F_SHAPE,
    color: '#00ff00' // Green
  },
  {
    id: 'Q',
    name: 'Potion',
    matrix: Q_SHAPE,
    color: '#f5d2f2' // Red
  },
  {
    id: 'G',
    name: 'G-Shape',
    matrix: G_SHAPE,
    color: '#0000ff' // Blue
  },
  {
    id: 'L',
    name: 'L-Shape',
    matrix: L_SHAPE,
    color: '#f0a000' // Orange
  },
  /* {
    id: 'T',
    name: 'T-Shape',
    matrix: T_SHAPE,
    color: '#a000f0' // Purple
  }, */
  {
    id: 'O',
    name: 'O-Shape',
    matrix: O_SHAPE,
    color: '#f0f000' // Yellow
  },
  {
    id: 'Z',
    name: 'Z-Shape',
    matrix: Z_SHAPE,
    color: '#f00000' // Red
  },
  /* {
    id: 'S',
    name: 'S-Shape',
    matrix: S_SHAPE,
    color: '#00f000' // Green
  }, */
  {
    id: 'J',
    name: 'J-Shape',
    matrix: J_SHAPE,
    color: '#0000f0' // Blue
  },
  /* {
    id: 'U',
    name: 'U-Shape',
    matrix: U_SHAPE,
    color: '#ff69b4' // Pink
  }, */
  
];

/**
 * Utility: Ottiene una shape definition per ID
 */
export function getShapeById(id: string): ShapeDefinition | undefined {
  return SHAPE_DEFINITIONS.find(shape => shape.id === id);
}

/**
 * Utility: Ruota una matrice di 90° in senso orario
 * NOTA: Questa funzione può essere usata per implementare la rotazione dei pezzi
 * 
 * @param matrix - Matrice da ruotare
 * @returns Nuova matrice ruotata
 */
export function rotateMatrix(matrix: ShapeMatrix): ShapeMatrix {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: ShapeMatrix = [];

  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(matrix[row][col]);
    }
    rotated.push(newRow);
  }

  return rotated;
}

