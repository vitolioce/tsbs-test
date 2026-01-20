/**
 * SHAPE COMPONENT
 * Renderizza una singola forma con drag & drop usando un'immagine unica per forma
 */

import React, { useRef, useState, useEffect } from 'react';
import { Group, Image, Rect, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { PlacedShape, Position, GridConfig, ValidationResult } from '../types';
import useImage from 'use-image';
import { showNotification } from '../utils/notifications';

interface ShapeComponentProps {
  shape: PlacedShape;
  config: GridConfig;
  onDragStart: (shapeId: string) => void;
  onDragMove: (shapeId: string, position: Position) => ValidationResult;
  onDragEnd: (shapeId: string, position: Position) => void;
  onRemove: (shapeId: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
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
    'U': '/shapes/shape-U.png',
    'Q': '/shapes/shape-Q.png'
  };
  return shapeMap[shapeId] || '/shapes/shape-I.png';
};

export const ShapeComponent: React.FC<ShapeComponentProps> = ({
  shape,
  config,
  onDragStart,
  onDragMove,
  onDragEnd,
  onRemove,
  isSelected = false,
  onSelect
}) => {
  const { cellSize, cellGap = 0 } = config;
  const totalCellSize = cellSize + cellGap;
  const groupRef = useRef<Konva.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationState, setValidationState] = useState<ValidationResult>({
    valid: true,
    reason: 'valid'
  });
  const tapStartTimeRef = useRef<number>(0);
  const tapStartPosRef = useRef<{ x: number; y: number } | null>(null);

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

  // Effetto per sincronizzare la posizione del nodo Konva con lo stato
  // Necessario quando la forma viene riposizionata automaticamente
  useEffect(() => {
    if (groupRef.current && !isDragging) {
      const currentX = groupRef.current.x();
      const currentY = groupRef.current.y();
      
      // Se la posizione del nodo è diversa da quella dello stato, resetta
      if (currentX !== startX || currentY !== startY) {
        groupRef.current.x(startX);
        groupRef.current.y(startY);
        groupRef.current.getLayer()?.batchDraw();
      }
    }
  }, [shape.position.row, shape.position.col, startX, startY, isDragging]);

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

    // Importante: setta isDragging a false PRIMA di chiamare onDragEnd
    // così l'effetto di sincronizzazione può funzionare correttamente
    setIsDragging(false);
    setValidationState({ valid: true, reason: 'valid' });
    
    // Chiama onDragEnd che potrebbe modificare la posizione dello stato
    onDragEnd(shape.id, gridPosition);
  };

  // Handler click destro: rimuove la forma
  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault(); // Previene menu contestuale browser
    
    // Rimuove la forma direttamente
    onRemove(shape.id);
    showNotification('🗑️ Forma rimossa dalla griglia', 'info', 2000);
  };

  // Stato hover per mostrare pulsante rimozione (solo desktop)
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handler per tap (mobile)
   * Registra l'inizio del tap e la posizione
   */
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    tapStartTimeRef.current = Date.now();
    const touch = e.evt.touches[0];
    if (touch) {
      tapStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  /**
   * Handler per fine tap (mobile)
   * Se è un tap rapido e senza movimento significativo, seleziona la forma
   */
  const handleTouchEnd = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const tapDuration = Date.now() - tapStartTimeRef.current;
    const touch = e.evt.changedTouches[0];
    
    // Calcola se c'è stato movimento significativo
    let isSignificantMove = false;
    if (touch && tapStartPosRef.current) {
      const deltaX = Math.abs(touch.clientX - tapStartPosRef.current.x);
      const deltaY = Math.abs(touch.clientY - tapStartPosRef.current.y);
      isSignificantMove = deltaX > 10 || deltaY > 10; // Tolleranza 10px
    }
    
    // Se è un tap rapido (< 300ms) e senza movimento, seleziona/deseleziona la forma
    if (tapDuration < 300 && !isSignificantMove && !isDragging && onSelect) {
      e.cancelBubble = true; // Previene la propagazione
      onSelect();
    }
  };

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

  // Handler per rimozione diretta (click/tap sul pulsante X)
  const handleRemoveClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true; // Previene drag e propagazione
    onRemove(shape.id);
    showNotification('🗑️ Forma rimossa dalla griglia', 'info', 2000);
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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

      {/* Pulsante rimozione */}
      {/* Desktop: visibile in hover | Mobile: visibile dopo tap (isSelected) */}
      {(isHovered || isSelected) && !isDragging && (
        <Group
          x={shapeWidth / 2 - 22}
          y={shapeHeight / 2 - 22}
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
        >
          {/* Cerchio rosso di sfondo (più grande su mobile) */}
          <Circle
            x={22}
            y={22}
            radius={22}
            fill="#ef4444"
            shadowColor="black"
            shadowBlur={6}
            shadowOpacity={0.4}
            shadowOffset={{ x: 0, y: 2 }}
            opacity={isSelected ? 1 : 0.9}
          />
          {/* Icona X - linea diagonale da alto-sinistra a basso-destra */}
          <Line
            points={[12, 12, 32, 32]}
            stroke="white"
            strokeWidth={3}
            lineCap="round"
          />
          {/* Icona X - linea diagonale da alto-destra a basso-sinistra */}
          <Line
            points={[32, 12, 12, 32]}
            stroke="white"
            strokeWidth={3}
            lineCap="round"
          />
        </Group>
      )}
    </Group>
  );
};

