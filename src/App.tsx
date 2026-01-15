/**
 * MAIN APP COMPONENT
 * Orchestrazione principale dell'applicazione
 */

import { useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { GridCanvas } from './components/GridCanvas';
import { ShapeComponent } from './components/ShapeComponent';
import { ShapePalette } from './components/ShapePalette';
import { useGridManager } from './hooks/useGridManager';
import { SHAPE_DEFINITIONS, getShapeById } from './models/ShapeDefinitions';
import { GridConfig, PlacedShape } from './types';

// Configurazione della griglia
const GRID_CONFIG: GridConfig = {
  rows: 8,
  cols: 5,
  cellSize: 50,
  cellGap: 5 // Margine di 5px tra le celle
};

function App() {
  // Hook personalizzato per la gestione della griglia
  const {
    placedShapes,
    addShape,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleRemove,
    reset
  } = useGridManager({ config: GRID_CONFIG });

  // Dimensioni canvas (con gap)
  const cellGap = GRID_CONFIG.cellGap || 0;
  const totalCellSize = GRID_CONFIG.cellSize + cellGap;
  const canvasWidth = GRID_CONFIG.cols * totalCellSize - cellGap;
  const canvasHeight = GRID_CONFIG.rows * totalCellSize - cellGap;

  /**
   * Handler per aggiungere una nuova forma alla griglia
   * La forma viene posizionata in alto a sinistra per default
   */
  const handleAddShape = useCallback((shapeId: string) => {
    const shapeDef = getShapeById(shapeId);
    if (!shapeDef) return;

    // Crea un ID univoco per l'istanza
    const instanceId = `${shapeId}-${Date.now()}`;

    // Cerca una posizione libera partendo dall'alto a sinistra
    let placed = false;
    for (let row = 0; row < GRID_CONFIG.rows && !placed; row++) {
      for (let col = 0; col < GRID_CONFIG.cols && !placed; col++) {
        const newShape: PlacedShape = {
          id: instanceId,
          shapeId: shapeDef.id,
          position: { row, col },
          matrix: shapeDef.matrix,
          color: shapeDef.color
        };

        placed = addShape(newShape);
      }
    }

    if (!placed) {
      alert('Griglia piena! Nessuno spazio disponibile per questa forma.');
    }
  }, [addShape]);

  /**
   * Handler per resettare la griglia
   */
  const handleReset = useCallback(() => {
    if (placedShapes.length > 0) {
      if (window.confirm('Vuoi resettare la griglia?')) {
        reset();
      }
    }
  }, [placedShapes.length, reset]);

  /**
   * Handler per drag over sul canvas (necessario per permettere drop)
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  /**
   * Handler per drop di una forma dal pannello sulla griglia
   * Usa lo stesso algoritmo del click: cerca automaticamente prima posizione libera
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const shapeId = e.dataTransfer.getData('shapeId');
    if (!shapeId) return;

    // Riutilizza la stessa logica del click
    handleAddShape(shapeId);
  }, [handleAddShape]);

  return (
    <div style={styles.container}>
      {/* Pannello laterale con le forme */}
      <ShapePalette
        shapes={SHAPE_DEFINITIONS}
        onAddShape={handleAddShape}
      />

      {/* Area principale con canvas e controlli */}
      <div style={styles.mainArea}>
        {/* Header con titolo e controlli */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.appTitle}>Grid Editor</h1>
            <p style={styles.appSubtitle}>
              Editor 2D interattivo con drag & drop e snapping automatico
            </p>
          </div>
          <div style={styles.controls}>
            <button
              onClick={handleReset}
              style={styles.resetButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e74c3c';
              }}
            >
              Reset Griglia
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div style={styles.infoBar}>
          <div style={styles.infoItem}>
            <strong>Griglia:</strong> {GRID_CONFIG.rows}x{GRID_CONFIG.cols}
          </div>
          <div style={styles.infoItem}>
            <strong>Forme posizionate:</strong> {placedShapes.length}
          </div>
          {placedShapes.some(s => s.hasOverlap) && (
            <div style={{...styles.infoItem, color: '#dc2626', fontWeight: 'bold'}}>
              ⚠️ Attenzione: {placedShapes.filter(s => s.hasOverlap).length} forma/e sovrapposte!
            </div>
          )}
          <div style={styles.infoItem}>
            💡 <em>Passa il mouse su una forma per rimuoverla</em>
          </div>
        </div>

        {/* Canvas Konva */}
        <div 
          style={styles.canvasContainer}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Stage width={canvasWidth} height={canvasHeight}>
            {/* Layer 1: Griglia di sfondo */}
            <GridCanvas config={GRID_CONFIG} />

            {/* Layer 2: Forme draggabili */}
            <Layer>
              {placedShapes.map(shape => (
                <ShapeComponent
                  key={shape.id}
                  shape={shape}
                  config={GRID_CONFIG}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onRemove={handleRemove}
                />
              ))}
            </Layer>
          </Stage>
        </div>

         {/* Footer con note tecniche */}
         <div style={styles.footer}>
           <strong>Note tecniche:</strong> React + TypeScript + Konva.js | 
           Collision Detection | Grid Snapping | Modular Architecture
           <div style={{ marginTop: '8px' }}>
             <a href="/secondo-test" style={{ color: '#4ade80', textDecoration: 'none' }}>
               → Vai al Secondo Test
             </a>
           </div>
         </div>
      </div>
    </div>
  );
}

// Stili inline per l'applicazione
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden', // Previene scroll nella pagina Tetris
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: '20px 30px',
    backgroundColor: '#ffffff',
    borderBottom: '2px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#212529',
  },
  appSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#6c757d',
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  resetButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#ffffff',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  infoBar: {
    padding: '12px 30px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    gap: '30px',
    fontSize: '14px',
    borderBottom: '1px solid #dee2e6',
  },
  infoItem: {
    color: '#495057',
  },
  canvasContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: '#e9ecef',
  },
  footer: {
    padding: '12px 30px',
    backgroundColor: '#212529',
    color: '#ffffff',
    fontSize: '12px',
    textAlign: 'center' as const,
  }
};

export default App;

