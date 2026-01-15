# 🎮 Tetris Grid Editor

**Editor 2D interattivo** per posizionare forme geometriche stile Tetris all'interno di una griglia bidimensionale tramite **drag & drop** con **snapping automatico**.

![React](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Konva](https://img.shields.io/badge/Konva-9.2-green)

---

## 📋 Indice

- [Funzionalità](#-funzionalità)
- [Architettura](#-architettura)
- [Installazione](#-installazione)
- [Utilizzo](#-utilizzo)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Estensioni Future](#-estensioni-future)
- [Tecnologie](#-tecnologie)

---

## ✨ Funzionalità

### Core Features

- ✅ **Griglia 2D (10x10)** con visualizzazione chiara
- ✅ **7 Forme Tetris** (I, L, T, O, Z, S, J)
- ✅ **Drag & Drop fluido** con mouse
- ✅ **Snapping automatico** alle celle della griglia
- ✅ **Collision Detection** in tempo reale
- ✅ **Validazione posizionamento**:
  - Impedisce uscita dai limiti della griglia
  - Impedisce sovrapposizione con altre forme
- ✅ **Feedback visivo**:
  - 🟢 Verde = posizione valida durante il drag
  - 🔴 Rosso = posizione non valida (collisione/fuori griglia)
- ✅ **Reset griglia** con conferma

### UX/UI

- 🎨 Design pulito e moderno
- 📐 Layout responsive con canvas centrato
- 🎯 Pannello laterale per selezione forme
- 📊 Info bar con statistiche in tempo reale
- 🖱️ Interazione intuitiva

---

## 🏗️ Architettura

L'applicazione segue una **architettura modulare** con separazione chiara delle responsabilità:

### 1. **GridEngine** (`src/engine/GridEngine.ts`)

**Responsabilità**: Gestione completa della logica della griglia

- Rappresentazione matriciale dello stato (10x10)
- Collision detection
- Validazione posizionamento
- Conversione coordinate pixel ↔ griglia
- Snapping automatico
- Serializzazione/deserializzazione (per save/load)

**Metodi principali**:
```typescript
validatePlacement(matrix, position, excludeShapeId?): ValidationResult
placeShape(shape): boolean
removeShape(shapeId): void
snapToGrid(pixelX, pixelY, cellSize): Position
```

### 2. **ShapeModel** (`src/models/ShapeDefinitions.ts`)

**Responsabilità**: Definizione delle forme geometriche

- Matrice 2D per ogni forma (1 = cella occupata, 0 = vuota)
- Colori associati
- Utility per rotazione (implementabile)

**Esempio definizione forma**:
```typescript
const L_SHAPE: ShapeMatrix = [
  [1, 0],
  [1, 0],
  [1, 1]
];
```

### 3. **React Components**

#### `App.tsx` - Orchestrazione principale
- State management generale
- Coordinazione tra componenti
- Handler per aggiunta/rimozione forme

#### `GridCanvas.tsx` - Rendering griglia
- Layer Konva con sfondo
- Linee verticali e orizzontali
- Rendering ottimizzato

#### `ShapeComponent.tsx` - Forma draggabile
- Gestione drag & drop
- Feedback visivo in tempo reale
- Handler eventi Konva

#### `ShapePalette.tsx` - Pannello laterale
- Catalogo forme disponibili
- Preview SVG delle forme
- Istruzioni d'uso

### 4. **Custom Hook** (`useGridManager.ts`)

**Responsabilità**: Centralizzazione logica state management

- Gestione stato forme posizionate
- Handler drag start/move/end
- Reset griglia
- Export/import stato (per undo/redo)

---

## 🚀 Installazione

### Prerequisiti

- Node.js >= 16
- npm o yarn

### Step 1: Installare dipendenze

```bash
npm install
```

### Step 2: Avviare dev server

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### Step 3: Build per produzione

```bash
npm run build
```

Output in `dist/`

---

## 🎯 Utilizzo

### 1. Aggiungere una forma

- Clicca su una delle forme nel pannello laterale
- La forma viene aggiunta automaticamente nella prima posizione libera

### 2. Spostare una forma

- Clicca e trascina una forma sul canvas
- Durante il drag:
  - 🟢 **Verde** = puoi rilasciare qui (posizione valida)
  - 🔴 **Rosso** = non puoi rilasciare (collisione o fuori griglia)
- La forma si snappa automaticamente alla griglia

### 3. Reset

- Clicca sul pulsante "Reset Griglia" per rimuovere tutte le forme
- Ti verrà chiesta conferma

---

## 📁 Struttura del Progetto

```
tetris-grid-editor/
├── src/
│   ├── components/
│   │   ├── GridCanvas.tsx         # Rendering griglia base
│   │   ├── ShapeComponent.tsx     # Forma draggabile
│   │   └── ShapePalette.tsx       # Pannello selezione forme
│   ├── engine/
│   │   └── GridEngine.ts          # Logica griglia e collision detection
│   ├── models/
│   │   └── ShapeDefinitions.ts    # Definizioni forme Tetris
│   ├── hooks/
│   │   └── useGridManager.ts      # Custom hook per state management
│   ├── types/
│   │   └── index.ts               # TypeScript types & interfaces
│   ├── App.tsx                    # Componente principale
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Stili globali
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔮 Estensioni Future

Il codice è strutturato per facilitare l'aggiunta di nuove funzionalità:

### 1. **Rotazione Pezzi** 🔄

La funzione `rotateMatrix()` è già implementata in `ShapeDefinitions.ts`.

**Come implementare**:
- Aggiungere handler per tastiera (es. tasto 'R')
- Chiamare `rotateMatrix()` sulla matrice corrente
- Validare la nuova posizione con `GridEngine.validatePlacement()`

### 2. **Undo/Redo** ↩️

Il `GridEngine` supporta già serializzazione.

**Come implementare**:
- Creare stack per history (array di stati)
- Usare `exportState()` per salvare ogni azione
- Usare `importState()` per ripristinare stati precedenti

### 3. **Salvataggio Stato** 💾

**Come implementare**:
```typescript
// Salva
const state = exportState();
localStorage.setItem('gridState', JSON.stringify(state));

// Carica
const saved = JSON.parse(localStorage.getItem('gridState'));
importState(saved.grid, saved.shapes);
```

### 4. **Griglia Dinamica** 📏

**Come implementare**:
- Aggiungere input per dimensioni griglia
- Ricreare `GridEngine` con nuove dimensioni
- Validare forme esistenti nella nuova griglia

### 5. **Forme Personalizzate** ✏️

**Come implementare**:
- Creare editor visuale per matrice
- Aggiungere nuova `ShapeDefinition` al catalogo
- Color picker per personalizzazione colore

### 6. **Multi-selezione** 🔲

**Come implementare**:
- Tenere array di `selectedShapeIds`
- Muovere tutte le forme selezionate insieme
- Validare il gruppo come un'unica entità

---

## 🛠️ Tecnologie

- **React 18.2** - UI Library (Functional Components + Hooks)
- **TypeScript 5.3** - Type Safety
- **Konva.js 9.2** - Canvas 2D rendering engine
- **react-konva 18.2** - React bindings per Konva
- **Vite 5** - Build tool & dev server

---

## 📝 Note Tecniche

### Performance

- Rendering ottimizzato con Konva Layers
- Snapping real-time durante drag senza lag
- Validazione efficiente O(n×m) dove n×m = dimensione forma

### Collision Detection

L'algoritmo di collision detection itera solo sulle celle occupate dalla forma:

```typescript
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (matrix[r][c] === 1) {
      // Controlla solo le celle piene
      const gridCell = grid[position.row + r][position.col + c];
      if (gridCell !== null) {
        // Collisione rilevata
      }
    }
  }
}
```

### State Management

Utilizza React hooks nativi (`useState`, `useCallback`, `useRef`) senza librerie esterne per massima semplicità e performance.

---

## 👨‍💻 Sviluppo

### Comandi disponibili

```bash
npm run dev      # Avvia dev server con hot reload
npm run build    # Build per produzione
npm run preview  # Preview build di produzione
```

### TypeScript

Il progetto usa **strict mode** per massima type safety:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

---

## 📄 Licenza

MIT - Usa liberamente per scopi educativi e commerciali.

---

## 🎓 Autore

Sviluppato come **demo tecnica** per mostrare competenze in:
- React/TypeScript
- Applicazioni 2D interattive
- Game-like interfaces
- Clean Architecture
- UX/UI Design

---

**Buon divertimento con il Tetris Grid Editor! 🎮**

