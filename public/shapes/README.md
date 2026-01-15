# Immagini Forme Complete

Questa cartella contiene le immagini **COMPLETE** per ogni forma Tetris.

⚠️ **IMPORTANTE**: Ogni file è un'**immagine UNICA** che rappresenta l'intera forma, NON singoli blocchi.

## 📐 Specifiche Dimensioni

Le immagini devono avere dimensioni basate sulla matrice della forma:

| Forma | Matrice | Dimensione Immagine (con gap=15px) |
|-------|---------|-------------------------------------|
| **I** | 1×4     | 320px × 65px (4 blocchi orizzontali)|
| **L** | 3×2     | 145px × 235px |
| **T** | 3×2     | 235px × 145px |
| **O** | 2×2     | 145px × 145px |
| **Z** | 2×2     | 145px × 145px |
| **S** | 2×2     | 145px × 145px |
| **J** | 3×2     | 235px × 145px |
| **U** | 3×2     | 235px × 145px |

### Formula Calcolo Dimensioni:
```
larghezza = (cols × 65) + ((cols - 1) × 15)
altezza = (rows × 65) + ((rows - 1) × 15)
```

Dove:
- `cellSize = 65px`
- `cellGap = 15px`
- `cols` = numero colonne della matrice
- `rows` = numero righe della matrice

## 🎨 Linee Guida Design

1. **L'immagine copre TUTTA la forma**, inclusi eventuali gap
2. Puoi disegnare **attraverso i gap** (es. ombre, texture continue)
3. Mantieni **trasparenza** nelle parti vuote della matrice
4. Usa **stili coerenti** tra tutte le forme

## 📂 File Richiesti

```
shapes/
├── shape-I.png    ← Barra orizzontale (cyan)
├── shape-L.png    ← Forma L (orange)
├── shape-T.png    ← Forma T (purple)
├── shape-O.png    ← Quadrato (yellow)
├── shape-Z.png    ← Forma Z (red)
├── shape-S.png    ← Forma S (green)
├── shape-J.png    ← Forma J (blue)
└── shape-U.png    ← Forma U (pink)
```

## 💡 Idee Creative

Dato che hai un'immagine unica per forma, puoi:
- ✅ Aggiungere **texture continue** che attraversano i gap
- ✅ Creare **ombre realistiche** che cadono tra i blocchi
- ✅ Usare **decorazioni** che unificano la forma
- ✅ Applicare **pattern grafici** complessi
- ✅ Disegnare **icone tematiche** (es. libri per biblioteca)

## 🖼️ Esempio: Forma O (2×2)

```
Dimensione: 145px × 145px

┌─────────────────┬───────────────────┐
│   Blocco 1      │   Gap (15px)     │   Blocco 2
│   (65×65)       │                  │   (65×65)
├─────────────────┴───────────────────┤
│            Gap (15px)               │
├─────────────────┬───────────────────┤
│   Blocco 3      │                  │   Blocco 4
│   (65×65)       │                  │   (65×65)
└─────────────────┴───────────────────┘

L'IMMAGINE COPRE TUTTO QUESTO SPAZIO!
```

## 🎯 Colori Standard

- **I** (Cyan): `#00f0f0`
- **L** (Orange): `#f0a000`
- **T** (Purple): `#a000f0`
- **O** (Yellow): `#f0f000`
- **Z** (Red): `#f00000`
- **S** (Green): `#00f000`
- **J** (Blue): `#0000f0`
- **U** (Pink): `#ff69b4`

## 🛠️ Strumenti Consigliati

- **Photoshop/GIMP**: Design professionale
- **Figma**: Collaborazione online
- **Illustrator**: Grafica vettoriale
- **Aseprite**: Pixel art
- **Photopea.com**: Editor gratuito online

## ⚙️ Tips Tecnici

1. **Formato**: PNG con trasparenza
2. **Risoluzione**: 2x dimensioni per Retina (opzionale)
3. **Compressione**: TinyPNG per ottimizzare
4. **Trasparenza**: Mantieni alpha channel per celle vuote
5. **Fallback**: Se immagine non caricata, app mostra rettangoli colorati

## 📝 Nota Sviluppatore

Le dimensioni sono calcolate automaticamente dal componente React basandosi su:
- `shape.matrix` (matrice della forma)
- `config.cellSize` (65px)
- `config.cellGap` (15px)

Non serve modificare codice per forme con dimensioni diverse!

