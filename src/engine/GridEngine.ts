/**
 * GRID ENGINE
 * Gestisce la logica della griglia, collision detection e validazione posizionamento
 */

import { GridCell, Position, ShapeMatrix, ValidationResult, PlacedShape } from '../types';

export class GridEngine {
  private rows: number;
  private cols: number;
  private grid: GridCell[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
  }

  /**
   * Crea una griglia vuota
   */
  private createEmptyGrid(): GridCell[][] {
    return Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(null));
  }

  /**
   * Ottiene lo stato corrente della griglia
   */
  public getGrid(): GridCell[][] {
    return this.grid;
  }

  /**
   * Ottiene il valore di una cella specifica
   */
  public getCell(row: number, col: number): GridCell {
    if (this.isOutOfBounds(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  /**
   * Controlla se una posizione è fuori dai limiti della griglia
   */
  public isOutOfBounds(row: number, col: number): boolean {
    return row < 0 || row >= this.rows || col < 0 || col >= this.cols;
  }

  /**
   * Valida il posizionamento di una forma nella griglia
   * 
   * @param matrix - Matrice della forma
   * @param position - Posizione di partenza (angolo top-left)
   * @param excludeShapeId - ID della forma da escludere dal controllo collisioni (per il drag della stessa forma)
   * @returns Risultato della validazione
   */
  public validatePlacement(
    matrix: ShapeMatrix,
    position: Position,
    excludeShapeId?: string
  ): ValidationResult {
    const conflictingCells: Position[] = [];
    let hasOutOfBounds = false;

    // Itera su tutte le celle della forma
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        // Salta le celle vuote (0) nella matrice della forma
        if (matrix[r][c] === 0) continue;

        const gridRow = position.row + r;
        const gridCol = position.col + c;

        // Controlla se la cella è fuori dai limiti
        if (this.isOutOfBounds(gridRow, gridCol)) {
          hasOutOfBounds = true;
          conflictingCells.push({ row: gridRow, col: gridCol });
          continue;
        }

        // Controlla se la cella è già occupata
        const cellValue = this.grid[gridRow][gridCol];
        if (cellValue !== null && cellValue !== excludeShapeId) {
          conflictingCells.push({ row: gridRow, col: gridCol });
        }
      }
    }

    // Determina il risultato
    if (hasOutOfBounds) {
      return {
        valid: false,
        reason: 'out-of-bounds',
        conflictingCells
      };
    }

    if (conflictingCells.length > 0) {
      return {
        valid: false,
        reason: 'collision',
        conflictingCells
      };
    }

    return {
      valid: true,
      reason: 'valid'
    };
  }

  /**
   * Posiziona una forma nella griglia
   * 
   * @param shape - Forma da posizionare
   * @param force - Se true, posiziona anche se c'è sovrapposizione
   * @returns true se il posizionamento ha successo
   */
  public placeShape(shape: PlacedShape, force: boolean = false): boolean {
    const validation = this.validatePlacement(shape.matrix, shape.position);
    
    // Se non valido e non forzato, fallisce
    if (!validation.valid && !force) {
      return false;
    }

    // Se out-of-bounds, non posizionare mai (neanche con force)
    if (validation.reason === 'out-of-bounds') {
      return false;
    }

    // Prima rimuovi la forma se era già posizionata
    this.removeShape(shape.id);

    // Posiziona la nuova forma
    for (let r = 0; r < shape.matrix.length; r++) {
      for (let c = 0; c < shape.matrix[r].length; c++) {
        if (shape.matrix[r][c] === 1) {
          const gridRow = shape.position.row + r;
          const gridCol = shape.position.col + c;
          // In modalità force, sovrascrive anche celle occupate
          this.grid[gridRow][gridCol] = shape.id;
        }
      }
    }

    return true;
  }

  /**
   * Verifica se una forma specifica ha sovrapposizioni con altre forme
   * 
   * @param shape - Forma da verificare
   * @param allShapes - Tutte le forme posizionate
   * @returns true se ci sono sovrapposizioni
   */
  public checkShapeOverlap(shape: PlacedShape, allShapes: PlacedShape[]): boolean {
    // Ottieni le celle occupate da questa forma
    const shapeCells = new Set<string>();
    for (let r = 0; r < shape.matrix.length; r++) {
      for (let c = 0; c < shape.matrix[r].length; c++) {
        if (shape.matrix[r][c] === 1) {
          const gridRow = shape.position.row + r;
          const gridCol = shape.position.col + c;
          shapeCells.add(`${gridRow},${gridCol}`);
        }
      }
    }

    // Controlla sovrapposizioni con altre forme
    for (const otherShape of allShapes) {
      if (otherShape.id === shape.id) continue; // Salta se stessa

      for (let r = 0; r < otherShape.matrix.length; r++) {
        for (let c = 0; c < otherShape.matrix[r].length; c++) {
          if (otherShape.matrix[r][c] === 1) {
            const gridRow = otherShape.position.row + r;
            const gridCol = otherShape.position.col + c;
            const cellKey = `${gridRow},${gridCol}`;
            
            if (shapeCells.has(cellKey)) {
              return true; // Sovrapposizione trovata!
            }
          }
        }
      }
    }

    return false; // Nessuna sovrapposizione
  }

  /**
   * Rimuove una forma dalla griglia
   * 
   * @param shapeId - ID della forma da rimuovere
   */
  public removeShape(shapeId: string): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === shapeId) {
          this.grid[r][c] = null;
        }
      }
    }
  }

  /**
   * Resetta la griglia (rimuove tutte le forme)
   */
  public reset(): void {
    this.grid = this.createEmptyGrid();
  }

  /**
   * Ottiene tutte le celle occupate da una forma specifica
   * 
   * @param shapeId - ID della forma
   * @returns Array di posizioni occupate
   */
  public getShapeCells(shapeId: string): Position[] {
    const cells: Position[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === shapeId) {
          cells.push({ row: r, col: c });
        }
      }
    }
    return cells;
  }

  /**
   * Calcola la posizione snappata più vicina per il drag & drop
   * 
   * @param pixelX - Coordinata X in pixel
   * @param pixelY - Coordinata Y in pixel
   * @param cellSize - Dimensione di una cella in pixel
   * @returns Posizione snappata nella griglia
   */
  public snapToGrid(pixelX: number, pixelY: number, cellSize: number): Position {
    const col = Math.floor(pixelX / cellSize);
    const row = Math.floor(pixelY / cellSize);
    return { row, col };
  }

  /**
   * Converte posizione griglia in coordinate pixel
   * 
   * @param position - Posizione nella griglia
   * @param cellSize - Dimensione di una cella in pixel
   * @returns Coordinate pixel
   */
  public gridToPixel(position: Position, cellSize: number): { x: number; y: number } {
    return {
      x: position.col * cellSize,
      y: position.row * cellSize
    };
  }

  /**
   * Serializza lo stato della griglia per il salvataggio
   * NOTA: Può essere usato per implementare save/load
   */
  public serialize(): string {
    return JSON.stringify(this.grid);
  }

  /**
   * Ripristina lo stato della griglia da un salvataggio
   * NOTA: Può essere usato per implementare save/load
   */
  public deserialize(data: string): boolean {
    try {
      const parsedGrid = JSON.parse(data);
      if (Array.isArray(parsedGrid) && parsedGrid.length === this.rows) {
        this.grid = parsedGrid;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

