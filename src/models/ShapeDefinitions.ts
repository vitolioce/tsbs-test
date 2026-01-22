/**
 * SHAPE DEFINITIONS
 * Definizioni delle forme geometriche stile Tetris
 * Ogni forma è rappresentata come matrice 2D
 */

import { ShapeDefinition, ShapeMatrix } from '../types';

const C_SHAPE: ShapeMatrix = [
  [1, 1],
  [1, 0],
  [1, 1]
];

const A_SHAPE: ShapeMatrix = [
  [1, 1]
];

const O_SHAPE: ShapeMatrix = [
  [1, 1],
  [1, 1]
];

const F_SHAPE: ShapeMatrix = [
  [1],
  [1]
];

const G_SHAPE: ShapeMatrix = [
  [1]
];

const L_SHAPE: ShapeMatrix = [
  [1, 0],
  [1, 0],
  [1, 1]
];

/**
 * Forma I (barra orizzontale)
 * ■ ■ ■ ■
 */
/* const I_SHAPE: ShapeMatrix = [
  [1, 1, 1, 1]
]; */



/**
 * Forma L (orizzontale)
 * ■ ■ ■
 * ■ □ □
 */
/* const L_SHAPE: ShapeMatrix = [
  [1, 1, 1],
  [1, 0, 0]
];
 */
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
 * Forma Z
 * ■ ■ □
 * □ ■ ■
 */
/* const Z_SHAPE: ShapeMatrix = [
  [1, 1],
  [0, 1]
]; */

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
/* const J_SHAPE: ShapeMatrix = [
  [1, 0, 0],
  [1, 1, 1]
]; */

/**
 * Forma U
 * ■ □ ■
 * ■ ■ ■
 */
/* const U_SHAPE: ShapeMatrix = [
  [1, 0, 1],
  [1, 1, 1]
]; */




/**
 * Catalogo completo delle forme disponibili
 */
export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    id: 'G1',
    name: 'Tartaruga',
    matrix: G_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'L1',
    name: 'Candela',
    matrix: L_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'A1',
    name: 'Chiave',
    matrix: A_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'G2',
    name: 'Scudo',
    matrix: G_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'O1',
    name: 'Stendardo',
    matrix: O_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'F1',
    name: 'calice',
    matrix: F_SHAPE,
    color: '#00ff00' // Green
  },
  {
    id: 'C1',
    name: 'Bandiera',
    matrix: C_SHAPE,
    color: '#00f0f0' // Cyan
  },
  {
    id: 'F2',
    name: 'Medaglia',
    matrix: F_SHAPE,
    color: '#00ff00' // Green
  }
  
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

