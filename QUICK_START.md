# 🚀 Quick Start Guide

Guida rapida per avviare il progetto in **meno di 2 minuti**.

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** versione 16 o superiore
- **npm** (incluso con Node.js) o **yarn**

Per verificare:
```bash
node --version  # Dovrebbe mostrare v16.x.x o superiore
npm --version   # Dovrebbe mostrare 8.x.x o superiore
```

---

## ⚡ Installazione Rapida

### Step 1: Installa le dipendenze

Nella cartella del progetto, esegui:

```bash
npm install
```

Questo installerà:
- React 18.2
- TypeScript 5.3
- Konva.js 9.2
- react-konva 18.2
- Vite 5.0

**Tempo stimato**: 1-2 minuti

---

### Step 2: Avvia il server di sviluppo

```bash
npm run dev
```

Dovresti vedere output simile a:

```
  VITE v5.0.8  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### Step 3: Apri il browser

Vai su:
```
http://localhost:5173
```

**🎉 Done!** L'applicazione è pronta.

---

## 🎯 Primo Utilizzo

### Aggiungere una forma

1. Guarda il pannello laterale a sinistra
2. Clicca su una delle 7 forme (I, L, T, O, Z, S, J)
3. La forma appare automaticamente nella griglia

### Muovere una forma

1. Clicca su una forma nella griglia
2. Trascinala con il mouse
3. Durante il drag:
   - 🟢 **Verde** = posizione valida
   - 🔴 **Rosso** = collisione o fuori griglia
4. Rilascia il mouse per confermare

### Reset griglia

1. Clicca sul pulsante rosso **"Reset Griglia"** in alto a destra
2. Conferma l'azione
3. La griglia viene svuotata

---

## 🛠️ Comandi Disponibili

```bash
# Sviluppo con hot reload
npm run dev

# Build per produzione (output in dist/)
npm run build

# Preview della build di produzione
npm run preview
```

---

## 📂 Struttura File Principale

```
src/
├── App.tsx                    # ← Componente principale
├── components/
│   ├── GridCanvas.tsx         # Griglia di sfondo
│   ├── ShapeComponent.tsx     # Forme draggabili
│   └── ShapePalette.tsx       # Pannello selezione
├── engine/
│   └── GridEngine.ts          # ← Logica della griglia
├── models/
│   └── ShapeDefinitions.ts    # Definizioni forme Tetris
└── types/
    └── index.ts               # TypeScript types
```

---

## 🐛 Problemi Comuni

### Porta 5173 già in uso

**Soluzione**: Vite utilizzerà automaticamente la prossima porta disponibile (5174, 5175, ecc.)

### Errore "Cannot find module"

**Soluzione**: Reinstalla le dipendenze
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload non funziona

**Soluzione**: Riavvia il dev server
```bash
# Ctrl+C per fermare
npm run dev
```

---

## 🎓 Prossimi Passi

1. ✅ Familiarizza con l'interfaccia
2. 📖 Leggi il **README.md** per dettagli completi
3. 🏗️ Consulta **ARCHITECTURE.md** per capire la struttura
4. 💻 Inizia a modificare il codice!

---

## 📞 Supporto

- Leggi la [documentazione completa](./README.md)
- Controlla l'[architettura](./ARCHITECTURE.md)
- Guarda il [changelog](./CHANGELOG.md)

---

**Buon coding! 🚀**

