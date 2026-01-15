/**
 * GRID CANVAS COMPONENT
 * Renderizza la griglia base con Konva
 */

import React from 'react';
import { Layer, Rect } from 'react-konva';
import { GridConfig } from '../types';

interface GridCanvasProps {
  config: GridConfig;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({ config }) => {
  const { rows, cols, cellSize, cellGap = 0 } = config;
  const totalCellSize = cellSize + cellGap;
  const gridWidth = cols * totalCellSize - cellGap;
  const gridHeight = rows * totalCellSize - cellGap;

  // Genera le celle individuali con gap
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push(
        <Rect
          key={`cell-${row}-${col}`}
          x={col * totalCellSize}
          y={row * totalCellSize}
          width={cellSize}
          height={cellSize}
          fill="#ffffff"
          stroke="#ddd"
          strokeWidth={1}
          cornerRadius={2}
        />
      );
    }
  }

  return (
    <Layer>
      {/* Sfondo griglia */}
      <Rect
        x={0}
        y={0}
        width={gridWidth + cellGap}
        height={gridHeight + cellGap}
        fill="#e9ecef"
      />
      
      {/* Celle della griglia */}
      {cells}
    </Layer>
  );
};

