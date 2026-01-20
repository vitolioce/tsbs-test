/**
 * CUSTOM HOOK: useGridManager
 * Gestisce lo stato della griglia e delle forme posizionate
 */

import { useState, useCallback, useRef } from 'react';
import { GridEngine } from '../engine/GridEngine';
import { PlacedShape, Position, ValidationResult, GridConfig } from '../types';
import { showNotification } from '../utils/notifications';

interface UseGridManagerProps {
  config: GridConfig;
}

export const useGridManager = ({ config }: UseGridManagerProps) => {
  const { rows, cols } = config;
  
  // Istanza del GridEngine
  const gridEngineRef = useRef<GridEngine>(new GridEngine(rows, cols));
  const gridEngine = gridEngineRef.current;

  // Stato delle forme posizionate
  const [placedShapes, setPlacedShapes] = useState<PlacedShape[]>([]);

  // ID della forma attualmente in drag
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);

  /**
   * Verifica e aggiorna lo stato di sovrapposizione di tutte le forme
   * DEFINITA PER PRIMA perché usata da addShape, removeShape, etc.
   */
  const updateOverlapStatus = useCallback((shapes: PlacedShape[]): PlacedShape[] => {
    return shapes.map(shape => ({
      ...shape,
      hasOverlap: gridEngine.checkShapeOverlap(shape, shapes)
    }));
  }, [gridEngine]);

  /**
   * Aggiunge una nuova forma alla scena
   */
  const addShape = useCallback((shape: PlacedShape) => {
    const success = gridEngine.placeShape(shape);
    if (success) {
      const newShapes = [...placedShapes, shape];
      // Verifica sovrapposizioni dopo aggiunta
      const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
      setPlacedShapes(shapesWithOverlapStatus);
    }
    return success;
  }, [gridEngine, placedShapes, updateOverlapStatus]);

  /**
   * Rimuove una forma dalla scena
   */
  const removeShape = useCallback((shapeId: string) => {
    gridEngine.removeShape(shapeId);
    const newShapes = placedShapes.filter(s => s.id !== shapeId);
    // Ricontrolla sovrapposizioni dopo rimozione
    const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
    setPlacedShapes(shapesWithOverlapStatus);
  }, [gridEngine, placedShapes, updateOverlapStatus]);

  /**
   * Handler: Inizio drag
   */
  const handleDragStart = useCallback((shapeId: string) => {
    setDraggingShapeId(shapeId);
    // Rimuove temporaneamente la forma dalla griglia
    gridEngine.removeShape(shapeId);
  }, [gridEngine]);

  /**
   * Handler: Durante drag (validazione)
   */
  const handleDragMove = useCallback((shapeId: string, position: Position): ValidationResult => {
    const shape = placedShapes.find(s => s.id === shapeId);
    if (!shape) {
      return { valid: false, reason: 'collision' };
    }

    // Valida il nuovo posizionamento
    return gridEngine.validatePlacement(shape.matrix, position, shapeId);
  }, [gridEngine, placedShapes]);

  /**
   * Cerca la prima posizione valida disponibile per una forma
   */
  const findFirstAvailablePosition = useCallback((shape: PlacedShape): Position | null => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const testPosition: Position = { row, col };
        const validation = gridEngine.validatePlacement(shape.matrix, testPosition);
        if (validation.valid) {
          return testPosition;
        }
      }
    }
    return null; // Nessuna posizione disponibile
  }, [gridEngine, rows, cols]);

  /**
   * Handler: Fine drag (posizionamento)
   * Se la forma è fuori griglia (anche parzialmente), cerca una posizione valida o la rimuove
   */
  const handleDragEnd = useCallback((shapeId: string, position: Position) => {
    setDraggingShapeId(null);

    const shape = placedShapes.find(s => s.id === shapeId);
    if (!shape) return;

    // Crea una nuova shape con la posizione aggiornata
    const updatedShape: PlacedShape = {
      ...shape,
      position
    };

    // Valida posizionamento
    const validation = gridEngine.validatePlacement(updatedShape.matrix, position);
    
    // Se la forma è fuori dai limiti (anche parzialmente)
    if (validation.reason === 'out-of-bounds') {
      
      // Cerca la prima posizione valida disponibile
      const availablePosition = findFirstAvailablePosition(shape);
      
      if (availablePosition) {
        // Posizione trovata! Riposiziona la forma
        const repositionedShape: PlacedShape = {
          ...shape,
          position: availablePosition
        };
        
        gridEngine.placeShape(repositionedShape, true);
        
        const newShapes = placedShapes.map(s => 
          s.id === shapeId ? repositionedShape : s
        );
        
        const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
        setPlacedShapes(shapesWithOverlapStatus);
        
        // Notifica l'utente
        showNotification('⚠️ Forma riposizionata nella prima posizione disponibile', 'warning', 3000);
      } else {
        // Nessuna posizione disponibile: elimina la forma
        const newShapes = placedShapes.filter(s => s.id !== shapeId);
        const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
        setPlacedShapes(shapesWithOverlapStatus);
        
        // Notifica l'utente
        showNotification('⚠️ Forma rimossa: griglia piena e nessuna posizione disponibile', 'error', 4000);
      }
      return;
    }
    
    // Posizionamento normale (anche con sovrapposizione)
    const placed = gridEngine.placeShape(updatedShape, true); // force = true
    
    if (placed) {
      // Aggiorna la lista delle forme
      const newShapes = placedShapes.map(s => 
        s.id === shapeId ? updatedShape : s
      );
      
      // Verifica sovrapposizioni di TUTTE le forme
      const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
      
      setPlacedShapes(shapesWithOverlapStatus);
    } else {
      // Fallback: ripristina posizione originale
      gridEngine.placeShape(shape);
    }
  }, [gridEngine, placedShapes, updateOverlapStatus, findFirstAvailablePosition, rows, cols]);

  /**
   * Resetta tutta la griglia
   */
  const reset = useCallback(() => {
    gridEngine.reset();
    setPlacedShapes([]);
  }, [gridEngine]);

  /**
   * Esporta lo stato corrente (per save/undo)
   */
  const exportState = useCallback(() => {
    return {
      grid: gridEngine.serialize(),
      shapes: JSON.stringify(placedShapes)
    };
  }, [gridEngine, placedShapes]);

  /**
   * Importa uno stato salvato (per load/redo)
   */
  const importState = useCallback((gridData: string, shapesData: string) => {
    try {
      gridEngine.deserialize(gridData);
      const shapes = JSON.parse(shapesData) as PlacedShape[];
      setPlacedShapes(shapes);
      return true;
    } catch {
      return false;
    }
  }, [gridEngine]);

  /**
   * Handler: Rimuove una forma (per click destro)
   */
  const handleRemove = useCallback((shapeId: string) => {
    gridEngine.removeShape(shapeId);
    const newShapes = placedShapes.filter(s => s.id !== shapeId);
    // Ricontrolla sovrapposizioni dopo rimozione
    const shapesWithOverlapStatus = updateOverlapStatus(newShapes);
    setPlacedShapes(shapesWithOverlapStatus);
  }, [gridEngine, placedShapes, updateOverlapStatus]);

  return {
    placedShapes,
    addShape,
    removeShape,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleRemove,
    reset,
    exportState,
    importState,
    draggingShapeId
  };
};

