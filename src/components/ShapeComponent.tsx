/**
 * SHAPE COMPONENT
 * Renderizza una singola forma con drag & drop usando un'immagine unica per forma
 */

import React, { useRef, useState, useEffect } from 'react';
import { Group, Image, Rect } from 'react-konva';
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
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);

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
    // Cancella il timer del long press se inizia il drag
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
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
   * Handler per long press (mobile)
   * Inizia il timer per rilevare un tap lungo
   */
  const handleTouchStart = () => {
    setIsLongPressing(false);
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      // Rimuovi la forma dopo long press
      onRemove(shape.id);
      showNotification('🗑️ Forma rimossa con tap lungo', 'info', 2000);
    }, 600); // 600ms per il long press
  };

  /**
   * Handler per cancellare il long press se l'utente rilascia o muove
   */
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };

  /**
   * Cleanup del timer quando il componente viene smontato
   */
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Determina opacità e overlay in base allo stato drag, sovrapposizione e long press
  let opacity = 1;
  let overlayColor = null;

  if (isLongPressing) {
    // Durante long press: arancione per indicare rimozione imminente
    opacity = 0.7;
    overlayColor = 'rgba(255, 152, 0, 0.6)'; // Arancione trasparente
  } else if (isDragging) {
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
      onTouchMove={handleTouchEnd}
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

