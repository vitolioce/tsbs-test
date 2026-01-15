/**
 * SHAPE COMPONENT
 * Renderizza una singola forma con drag & drop usando un'immagine unica per forma
 */

import React, { useRef, useState } from 'react';
import { Group, Image, Rect } from 'react-konva';
import Konva from 'konva';
import { PlacedShape, Position, GridConfig, ValidationResult } from '../types';
import useImage from 'use-image';

interface ShapeComponentProps {
  shape: PlacedShape;
  config: GridConfig;
  onDragStart: (shapeId: string) => void;
  onDragMove: (shapeId: string, position: Position) => ValidationResult;
  onDragEnd: (shapeId: string, position: Position) => void;
  onRemove: (shapeId: string) => void; // Nuovo: rimuove la forma
}

/**
 * Mappa shapeId → path immagine forma
 */
const getShapeImagePath = (shapeId: string): string => {
  const shapeMap: { [key: string]: string } = {
    'I': '/shapes/shape-I.png',
    'F': '/shapes/shape-F.png',
    'G': '/shapes/shape-G.png',
    'L': '/shapes/shape-L.png',
    'T': '/shapes/shape-T.png',
    'O': '/shapes/shape-O.png',
    'Z': '/shapes/shape-Z.png',
    'S': '/shapes/shape-S.png',
    'J': '/shapes/shape-J.png',
    'U': '/shapes/shape-U.png'
  };
  return shapeMap[shapeId] || '/shapes/shape-I.png';
};

export const ShapeComponent: React.FC<ShapeComponentProps> = ({
  shape,
  config,
  onDragStart,
  onDragMove,
  onDragEnd,
  onRemove
}) => {
  const { cellSize, cellGap = 0 } = config;
  const totalCellSize = cellSize + cellGap;
  const groupRef = useRef<Konva.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationState, setValidationState] = useState<ValidationResult>({
    valid: true,
    reason: 'valid'
  });

  // Carica l'immagine UNICA della forma
  const shapeImagePath = getShapeImagePath(shape.shapeId);
  const [shapeImage] = useImage(shapeImagePath);

  // Calcola dimensioni della forma (include gap tra i blocchi, ma non dopo l'ultimo)
  const matrixRows = shape.matrix.length;
  const matrixCols = shape.matrix[0].length;
  const shapeWidth = matrixCols * cellSize + (matrixCols - 1) * cellGap;
  const shapeHeight = matrixRows * cellSize + (matrixRows - 1) * cellGap;

  // Calcola posizione pixel iniziale (con gap)
  const startX = shape.position.col * totalCellSize;
  const startY = shape.position.row * totalCellSize;

  // Handler drag start
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart(shape.id);
  };

  // Handler drag move
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const x = node.x();
    const y = node.y();

    // Calcola posizione griglia (con gap)
    const col = Math.floor(x / totalCellSize);
    const row = Math.floor(y / totalCellSize);
    const gridPosition: Position = { row, col };

    // Valida posizionamento
    const validation = onDragMove(shape.id, gridPosition);
    setValidationState(validation);

    // Snap alla griglia durante il drag (con gap)
    node.x(col * totalCellSize);
    node.y(row * totalCellSize);
  };

  // Handler drag end
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const x = node.x();
    const y = node.y();

    // Calcola posizione finale (con gap)
    const col = Math.floor(x / totalCellSize);
    const row = Math.floor(y / totalCellSize);
    const gridPosition: Position = { row, col };

    onDragEnd(shape.id, gridPosition);
    setIsDragging(false);
    setValidationState({ valid: true, reason: 'valid' });
  };

  // Handler click destro: rimuove la forma
  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault(); // Previene menu contestuale browser
    
    // Conferma prima di rimuovere
    if (window.confirm('Vuoi rimuovere questa forma dalla griglia?')) {
      onRemove(shape.id);
    }
  };

  // Stato hover per mostrare pulsante rimozione
  const [isHovered, setIsHovered] = useState(false);

  // Determina opacità e overlay in base allo stato drag e sovrapposizione
  let opacity = 1;
  let overlayColor = null;

  if (isDragging) {
    // Durante drag: verde se valido, rosso se non valido
    opacity = 0.85;
    if (validationState.valid) {
      overlayColor = 'rgba(74, 222, 128, 0.3)'; // Verde trasparente
    } else {
      overlayColor = 'rgba(248, 113, 113, 0.3)'; // Rosso trasparente
    }
  } else if (shape.hasOverlap) {
    // Dopo drag: rosso permanente se c'è sovrapposizione
    overlayColor = 'rgba(248, 113, 113, 0.4)'; // Rosso trasparente
  }

  // Handler per rimozione diretta (click sul pulsante X)
  const handleRemoveClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Previene drag
    onRemove(shape.id);
  };

  return (
    <Group
      ref={groupRef}
      x={startX}
      y={startY}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Immagine unica della forma */}
      {shapeImage ? (
        <Image
          image={shapeImage}
          width={shapeWidth}
          height={shapeHeight}
          opacity={opacity}
        />
      ) : (
        // Fallback: renderizza blocchi colorati se immagine non caricata
        <>
          {shape.matrix.map((row, r) =>
            row.map((cell, c) => {
              if (cell === 1) {
                return (
                  <Rect
                    key={`${r}-${c}`}
                    x={c * totalCellSize}
                    y={r * totalCellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={shape.color}
                    stroke="#333"
                    strokeWidth={2}
                    opacity={opacity}
                    cornerRadius={2}
                  />
                );
              }
              return null;
            })
          )}
        </>
      )}

      {/* Overlay colorato per feedback durante drag o per sovrapposizione permanente */}
      {overlayColor && (
        <Rect
          x={0}
          y={0}
          width={shapeWidth}
          height={shapeHeight}
          fill={overlayColor}
        />
      )}

      {/* Pulsante rimozione (visibile solo in hover e non durante drag) */}
      {isHovered && !isDragging && (
        <Group
          x={shapeWidth - 20}
          y={-10}
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
        >
          {/* Cerchio rosso di sfondo */}
          <Rect
            x={0}
            y={0}
            width={24}
            height={24}
            fill="#ef4444"
            cornerRadius={12}
            shadowColor="black"
            shadowBlur={4}
            shadowOpacity={0.3}
            shadowOffset={{ x: 0, y: 2 }}
          />
          {/* Icona X */}
          <Rect
            x={6}
            y={11}
            width={12}
            height={2}
            fill="white"
            rotation={45}
            offsetX={0}
            offsetY={1}
          />
          <Rect
            x={6}
            y={11}
            width={12}
            height={2}
            fill="white"
            rotation={-45}
            offsetX={0}
            offsetY={1}
          />
        </Group>
      )}
    </Group>
  );
};

