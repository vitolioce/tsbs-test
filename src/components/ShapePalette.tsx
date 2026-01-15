/**
 * SHAPE PALETTE COMPONENT
 * Pannello laterale per selezionare e aggiungere forme alla griglia
 * Supporta drag & drop diretto
 */

import React from 'react';
import { ShapeDefinition } from '../types';

interface ShapePaletteProps {
  shapes: ShapeDefinition[];
  onAddShape: (shapeId: string) => void;
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({ shapes, onAddShape }) => {
  /**
   * Handler per inizio drag da pannello
   */
  const handleDragStart = (e: React.DragEvent, shapeId: string) => {
    e.dataTransfer.setData('shapeId', shapeId);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Aggiungi feedback visivo
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  /**
   * Handler per fine drag
   */
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  /**
   * Renderizza una preview SVG della forma
   */
  const renderShapePreview = (matrix: number[][], color: string) => {
    const cellSize = 20;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const width = cols * cellSize;
    const height = rows * cellSize;

    return (
      <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 1) {
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={color}
                  stroke="#333"
                  strokeWidth={1}
                  rx={2}
                />
              );
            }
            return null;
          })
        )}
      </svg>
    );
  };

  return (
    <div style={styles.palette}>
      <h2 style={styles.title}>Forme Disponibili</h2>
      <p style={styles.subtitle}>Clicca per aggiungere alla griglia</p>
      
      <div style={styles.shapeList}>
        {shapes.map(shape => (
          <div
            key={shape.id}
            style={styles.shapeCard}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, shape.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onAddShape(shape.id)}
            title="Click per aggiungere o trascina sulla griglia"
          >
            <div style={styles.preview}>
              {renderShapePreview(shape.matrix, shape.color)}
            </div>
            <div style={styles.shapeName}>{shape.name}</div>
          </div>
        ))}
      </div>

      <div style={styles.instructions}>
        <h3 style={styles.instructionsTitle}>Istruzioni</h3>
        <ul style={styles.instructionsList}>
          <li><strong>Click</strong> su una forma per aggiungerla</li>
          <li><strong>Trascina</strong> direttamente sulla griglia</li>
          <li><strong>Passa il mouse</strong> su una forma e clicca ❌ per rimuoverla</li>
          <li>🟢 Verde = posizione valida durante drag</li>
          <li>🔴 Rosso temporaneo = posizione non valida durante drag</li>
          <li>🔴 Rosso permanente = forme sovrapposte</li>
        </ul>
      </div>
    </div>
  );
};

// Stili inline per il componente
const styles = {
  palette: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRight: '2px solid #dee2e6',
    overflowY: 'auto' as const,
    height: '100vh',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
    color: '#212529',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6c757d',
    marginBottom: '20px',
  },
  shapeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  shapeCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'grab',
    transition: 'all 0.2s',
    userSelect: 'none' as const,
  },
  preview: {
    marginBottom: '8px',
  },
  shapeName: {
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
  },
  instructions: {
    marginTop: '30px',
    padding: '16px',
    backgroundColor: '#e7f1ff',
    borderRadius: '8px',
  },
  instructionsTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    marginBottom: '12px',
    color: '#0d6efd',
  },
  instructionsList: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#495057',
    paddingLeft: '20px',
    margin: 0,
  }
};

