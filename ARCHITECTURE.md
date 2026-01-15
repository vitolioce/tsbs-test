# 🏛️ Architettura - Tetris Grid Editor

Questo documento descrive in dettaglio l'architettura dell'applicazione, le decisioni di design e i pattern utilizzati.

---

## 📐 Panoramica

L'applicazione è strutturata secondo il principio di **Separation of Concerns**, dividendo chiaramente:

1. **Logica di business** (GridEngine)
2. **Modelli dati** (ShapeDefinitions, Types)
3. **Presentazione** (React Components)
4. **State Management** (Custom Hooks)

```
┌─────────────────────────────────────────┐
│         UI Layer (React + Konva)        │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   App    │  │  Shape   │  │ Palette││
│  │          │  │Component │  │        ││
│  └────┬─────┘  └────┬─────┘  └────┬───┘│
└───────┼─────────────┼─────────────┼────┘
        │             │             │
┌───────▼─────────────▼─────────────▼────┐
│      State Management Layer            │
│  ┌──────────────────────────────────┐  │
│  │     useGridManager Hook          │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│         Business Logic Layer           │
│  ┌──────────────────────────────────┐  │
│  │         GridEngine               │  │
│  │  • Collision Detection           │  │
│  │  • Validation Logic              │  │
│  │  • Grid State Management         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│           Data Models                  │
│  ┌──────────────────────────────────┐  │
│  │     ShapeDefinitions             │  │
│  │     TypeScript Interfaces        │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## 🧱 Layer 1: Data Models

### Types (`src/types/index.ts`)

Definisce tutte le interfacce TypeScript per garantire type safety.

**Principali tipi**:
- `Position`: coordinate griglia (row, col)
- `ShapeMatrix`: matrice 2D della forma
- `ShapeDefinition`: template di una forma
- `PlacedShape`: istanza posizionata nella griglia
- `ValidationResult`: risultato validazione posizionamento

### Shape Definitions (`src/models/ShapeDefinitions.ts`)

**Responsabilità**:
- Catalogo delle 7 forme Tetris
- Ogni forma è una matrice 2D (1 = cella piena, 0 = vuota)
- Associazione colori
- Utility per rotazione

**Pattern utilizzato**: **Factory Pattern** (getShapeById)

```typescript
// Esempio: Forma L
const L_SHAPE: ShapeMatrix = [
  [1, 0],  // ■ □
  [1, 0],  // ■ □
  [1, 1]   // ■ ■
];
```

---

## 🎮 Layer 2: Business Logic

### GridEngine (`src/engine/GridEngine.ts`)

**Classe fondamentale** che gestisce tutta la logica della griglia.

#### Struttura Dati Interna

```typescript
private grid: GridCell[][];  // Matrice 10x10
// Ogni cella contiene:
// - null = vuota
// - string = ID della forma che occupa la cella
```

#### Metodi Principali

##### 1. `validatePlacement()`

**Algoritmo di validazione**:
```
1. Itera su ogni cella della forma (matrice)
2. Per ogni cella piena (valore = 1):
   a. Calcola posizione assoluta nella griglia
   b. Controlla se è fuori dai limiti → OUT_OF_BOUNDS
   c. Controlla se la cella è occupata → COLLISION
3. Se tutti i controlli passano → VALID
```

**Complessità**: O(n×m) dove n×m = dimensione forma

##### 2. `placeShape()`

**Flusso**:
```
1. Valida posizionamento
2. Se valido:
   a. Rimuove forma se esistente (stesso ID)
   b. Scrive ID forma in ogni cella occupata
3. Ritorna success/failure
```

##### 3. `snapToGrid()`

Converte coordinate pixel in posizione griglia:
```typescript
col = Math.floor(pixelX / cellSize)
row = Math.floor(pixelY / cellSize)
```

#### Estensibilità

Il GridEngine supporta:
- **Serializzazione**: `serialize()` / `deserialize()`
- **Query**: `getShapeCells()` per undo/redo
- **Reset**: `reset()` per pulizia completa

---

## 🔄 Layer 3: State Management

### useGridManager Hook (`src/hooks/useGridManager.ts`)

**Pattern**: **Custom Hook** per logica riutilizzabile

**Stato gestito**:
```typescript
- placedShapes: PlacedShape[]     // Forme correnti
- draggingShapeId: string | null  // Forma in drag
```

**Responsabilità**:
1. **Sincronizzazione** tra stato React e GridEngine
2. **Handler eventi** drag & drop
3. **Operazioni CRUD** su forme
4. **Export/Import** stato (per save/undo)

#### Flusso Drag & Drop

```
┌──────────────┐
│  DRAG START  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ 1. Setta draggingShapeId │
│ 2. Rimuove da GridEngine │ ← Temporaneo
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│  DRAG MOVE   │ ← Loop continuo
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│ 1. Calcola nuova posizione │
│ 2. Valida con GridEngine   │
│ 3. Ritorna ValidationResult│
└──────┬─────────────────────┘
       │
       ▼
┌──────────────┐
│   DRAG END   │
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│ 1. Se valido: posiziona    │
│ 2. Se non valido: ripristina│
│ 3. Reset draggingShapeId   │
└────────────────────────────┘
```

---

## 🎨 Layer 4: Presentation

### React Components

#### App.tsx (Orchestratore)

**Responsabilità**:
- Inizializza configurazione griglia
- Coordina tutti i sub-component
- Gestisce eventi UI (reset, add shape)

**Pattern**: **Container Component**

#### GridCanvas.tsx

**Responsabilità**: Rendering statico della griglia

**Tecniche Konva**:
- `Layer` per organizzazione
- `Rect` per sfondo
- `Line` per linee griglia

**Ottimizzazione**: Rendering one-time, no re-render

#### ShapeComponent.tsx

**Responsabilità**: Rendering + interazione singola forma

**Features**:
- Drag & drop nativo Konva
- Feedback visivo real-time
- Snapping automatico

**Stato locale**:
```typescript
isDragging: boolean         // Per stile visivo
validationState: ValidationResult  // Per colore
```

**Color Logic**:
```typescript
if (isDragging) {
  if (valid) → Verde (#4ade80)
  else → Rosso (#f87171)
} else {
  → Colore originale forma
}
```

#### ShapePalette.tsx

**Responsabilità**: UI per selezione forme

**Features**:
- Preview SVG (no Konva, più leggero)
- Click handler per aggiunta
- Istruzioni utente

---

## 🔑 Pattern e Principi

### 1. Single Responsibility Principle (SRP)

Ogni modulo ha una responsabilità chiara:
- `GridEngine` → Solo logica griglia
- `ShapeComponent` → Solo rendering + drag
- `useGridManager` → Solo state management

### 2. Separation of Concerns

- **Logica** separata da **Presentazione**
- GridEngine non conosce React
- Components non contengono logica di validazione

### 3. Dependency Injection

I componenti ricevono handler come props:
```typescript
<ShapeComponent
  onDragStart={handleDragStart}
  onDragMove={handleDragMove}
  onDragEnd={handleDragEnd}
/>
```

### 4. Immutability

Stato React sempre immutabile:
```typescript
// ✅ Corretto
setPlacedShapes(prev => [...prev, newShape])

// ❌ Sbagliato
placedShapes.push(newShape)
```

### 5. Type Safety

TypeScript strict mode per prevenire errori:
- Nessun `any`
- Tutte le interfacce esplicite
- Return types dichiarati

---

## 🚀 Performance

### Ottimizzazioni Implementate

1. **useCallback** per memoizzazione handler
   ```typescript
   const handleDragEnd = useCallback(() => {
     // ...
   }, [dependencies])
   ```

2. **Konva Layers** per rendering efficiente
   - Layer 1: Griglia (statico)
   - Layer 2: Forme (dinamico)

3. **Validazione incrementale**
   - Solo celle occupate dalla forma
   - Early return su out-of-bounds

4. **Key stabili** per riconciliazione React
   ```typescript
   key={shape.id}  // ID univoco timestamp-based
   ```

### Metriche

- **Drag responsiveness**: < 16ms per frame (60 FPS)
- **Validazione**: O(n×m) per forma
- **Re-render**: Solo componenti modificati

---

## 🔮 Estensibilità

### Come Aggiungere Rotazione

1. **Modello**: Usa `rotateMatrix()` esistente
2. **Hook**: Aggiungi `rotateShape(shapeId)`
3. **UI**: Ascolta tasto 'R' o aggiungi button
4. **Validazione**: Riusa `validatePlacement()`

```typescript
const rotateShape = (shapeId: string) => {
  const shape = placedShapes.find(s => s.id === shapeId);
  const rotatedMatrix = rotateMatrix(shape.matrix);
  
  // Valida nuova orientazione
  const validation = gridEngine.validatePlacement(
    rotatedMatrix, 
    shape.position
  );
  
  if (validation.valid) {
    // Aggiorna shape
  }
}
```

### Come Aggiungere Undo/Redo

1. **State**: Aggiungi stack history
   ```typescript
   const [history, setHistory] = useState<State[]>([])
   const [historyIndex, setHistoryIndex] = useState(0)
   ```

2. **Hook**: Implementa `undo()` / `redo()`
   ```typescript
   const undo = () => {
     const prevState = history[historyIndex - 1];
     importState(prevState.grid, prevState.shapes);
     setHistoryIndex(prev => prev - 1);
   }
   ```

3. **UI**: Aggiungi buttons + keyboard shortcuts

### Come Salvare/Caricare Stato

```typescript
// Salva
const saveState = () => {
  const state = exportState();
  localStorage.setItem('tetris-state', JSON.stringify(state));
}

// Carica
const loadState = () => {
  const json = localStorage.getItem('tetris-state');
  const state = JSON.parse(json);
  importState(state.grid, state.shapes);
}
```

---

## 🧪 Testing Strategy (Future)

### Unit Tests

- **GridEngine**: Validazione, collision detection
- **ShapeDefinitions**: Rotazione matrici
- **Utilities**: Conversione coordinate

### Integration Tests

- **useGridManager**: Flusso completo drag & drop
- **App**: Aggiunta/rimozione forme

### E2E Tests

- User flow completo
- Drag & drop su browser reale

---

## 📚 Riferimenti

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Konva.js Docs](https://konvajs.org/docs/)
- [react-konva GitHub](https://github.com/konvajs/react-konva)

---

**Questa architettura garantisce**: Manutenibilità, Scalabilità, Testabilità, Performance.

