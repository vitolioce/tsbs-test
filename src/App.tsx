/**
 * MAIN APP COMPONENT
 * Orchestrazione principale dell'applicazione
 */

import { useCallback, useMemo, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { GridCanvas } from './components/GridCanvas';
import { ShapeComponent } from './components/ShapeComponent';
import { ShapePalette } from './components/ShapePalette';
import { useGridManager } from './hooks/useGridManager';
import { useResponsive } from './hooks/useResponsive';
import { SHAPE_DEFINITIONS, getShapeById } from './models/ShapeDefinitions';
import { GridConfig, PlacedShape } from './types';
import { showNotification } from './utils/notifications';

// Configurazione base della griglia (celle)
const BASE_GRID_CONFIG = {
  rows: 8,
  cols: 5,
  cellGap: 10 // Margine di 5px tra le celle
};

function App() {
  // Hook per gestire la responsività
  const { isMobile, windowWidth, windowHeight } = useResponsive();
  
  // Stato per gestire apertura/chiusura menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Stato per gestire quale forma mostra il pulsante delete (mobile)
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // Calcola dimensioni celle dinamicamente in base allo schermo
  const gridConfig: GridConfig = useMemo(() => {
    // Calcola spazio disponibile considerando padding e sidebar
    const sidebarWidth = isMobile ? 0 : 250;
    const horizontalPadding = isMobile ? 20 : 60;
    const verticalPadding = isMobile ? 100 : 200;
    
    const availableWidth = windowWidth - sidebarWidth - horizontalPadding;
    const availableHeight = windowHeight - verticalPadding;
    
    // Calcola dimensione ottimale celle
    const cellSizeByWidth = (availableWidth - (BASE_GRID_CONFIG.cols - 1) * BASE_GRID_CONFIG.cellGap) / BASE_GRID_CONFIG.cols;
    const cellSizeByHeight = (availableHeight - (BASE_GRID_CONFIG.rows - 1) * BASE_GRID_CONFIG.cellGap) / BASE_GRID_CONFIG.rows;
    
    // Usa la dimensione più piccola per fittare tutto nello schermo
    const cellSize = Math.floor(Math.min(
      Math.max(cellSizeByWidth, 30), // min 30px
      Math.max(cellSizeByHeight, 30), // min 30px
      isMobile ? 50 : 70 // max 50px mobile, 70px desktop
    ));
    
    return {
      ...BASE_GRID_CONFIG,
      cellSize
    };
  }, [isMobile, windowWidth, windowHeight]);

  // Hook personalizzato per la gestione della griglia
  const {
    placedShapes,
    addShape,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleRemove,
    reset
  } = useGridManager({ config: gridConfig });

  // Dimensioni canvas (con gap)
  const cellGap = gridConfig.cellGap || 0;
  const totalCellSize = gridConfig.cellSize + cellGap;
  const canvasWidth = gridConfig.cols * totalCellSize - cellGap;
  const canvasHeight = gridConfig.rows * totalCellSize - cellGap;

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
    for (let row = 0; row < gridConfig.rows && !placed; row++) {
      for (let col = 0; col < gridConfig.cols && !placed; col++) {
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
      showNotification('❌ Griglia piena! Nessuno spazio disponibile per questa forma.', 'error', 4000);
    }
  }, [addShape]);

  /**
   * Handler per resettare la griglia
   */
  const handleReset = useCallback(() => {
    if (placedShapes.length > 0) {
      reset();
      showNotification('✅ Griglia resettata con successo', 'success', 2500);
    } else {
      showNotification('ℹ️ La griglia è già vuota', 'info', 2000);
    }
  }, [placedShapes.length, reset]);

  /**
   * Handler per deselezionare forme quando si clicca sul canvas vuoto
   */
  const handleCanvasClick = useCallback(() => {
    setSelectedShapeId(null);
  }, []);

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

  // Stili dinamici responsive
  const containerStyle = {
    ...styles.container,
    ...(isMobile ? styles.containerMobile : {})
  };

  const headerStyle = {
    ...styles.header,
    ...(isMobile ? styles.headerMobile : {})
  };

  const infoBarStyle = {
    ...styles.infoBar,
    ...(isMobile ? styles.infoBarMobile : {})
  };

  const canvasContainerStyle = {
    ...styles.canvasContainer,
    ...(isMobile ? styles.canvasContainerMobile : {})
  };

  return (
    <div style={containerStyle}>
      {/* Pannello laterale con le forme */}
      <ShapePalette
        shapes={SHAPE_DEFINITIONS}
        onAddShape={handleAddShape}
        isMobile={isMobile}
        isOpen={isMobile ? isMobileMenuOpen : true}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Area principale con canvas e controlli */}
      <div style={styles.mainArea}>
        {/* Header con titolo e controlli */}
        <div style={headerStyle}>
          <div style={styles.headerLeft}>
            {/* Hamburger menu solo su mobile */}
            {isMobile && (
              <button
                style={styles.hamburgerButton}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Apri menu forme"
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = '#0056b3';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#007bff';
                }}
              >
                ☰
              </button>
            )}
            <div>
              <h1 style={{...styles.appTitle, ...(isMobile ? styles.appTitleMobile : {})}}>
                Editor Griglia 2D
              </h1>
              {!isMobile && (
                <p style={styles.appSubtitle}>
                  Editor 2D interattivo con drag & drop e snapping automatico
                </p>
              )}
            </div>
          </div>
          <div style={styles.controls}>
            <button
              onClick={handleReset}
              style={{...styles.resetButton, ...(isMobile ? styles.resetButtonMobile : {})}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e74c3c';
              }}
            >
              {isMobile ? 'Reset' : 'Reset Griglia'}
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div style={infoBarStyle}>
          <div style={styles.infoItem}>
            <strong>Griglia:</strong> {gridConfig.rows}x{gridConfig.cols}
          </div>
          {!isMobile && (
            <div style={styles.infoItem}>
              <strong>Forme posizionate:</strong> {placedShapes.length}
            </div>
          )}
          {placedShapes.some(s => s.hasOverlap) && (
            <div style={{...styles.infoItem, color: '#dc2626', fontWeight: 'bold'}}>
              ⚠️ {isMobile ? '' : 'Attenzione: '}{placedShapes.filter(s => s.hasOverlap).length} sovrapposte!
            </div>
          )}
          <div style={styles.infoItem}>
            {isMobile ? (
              <>💡 <em>Tap su una forma per mostrare il pulsante ❌</em></>
            ) : (
              <>💡 <em>Passa il mouse su una forma per rimuoverla</em></>
            )}
          </div>
        </div>

        {/* Canvas Konva */}
        <div 
          style={canvasContainerStyle}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
        >
          <Stage width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick}>
            {/* Layer 1: Griglia di sfondo */}
            <GridCanvas config={gridConfig} />

            {/* Layer 2: Forme draggabili */}
            <Layer>
              {placedShapes.map(shape => (
                <ShapeComponent
                  key={shape.id}
                  shape={shape}
                  config={gridConfig}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onRemove={handleRemove}
                  isSelected={selectedShapeId === shape.id}
                  onSelect={() => setSelectedShapeId(shape.id)}
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
  containerMobile: {
    flexDirection: 'column' as const,
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
  headerMobile: {
    padding: '12px 15px',
    flexWrap: 'wrap' as const,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  hamburgerButton: {
    width: '40px',
    height: '40px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'background-color 0.2s',
  },
  appTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#212529',
  },
  appTitleMobile: {
    fontSize: '20px',
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
  resetButtonMobile: {
    padding: '8px 16px',
    fontSize: '12px',
  },
  infoBar: {
    padding: '12px 30px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    gap: '30px',
    fontSize: '14px',
    borderBottom: '1px solid #dee2e6',
    flexWrap: 'wrap' as const,
  },
  infoBarMobile: {
    padding: '10px 15px',
    gap: '15px',
    fontSize: '12px',
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
    overflow: 'auto' as const,
  },
  canvasContainerMobile: {
    padding: '10px',
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

