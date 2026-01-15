# Changelog

Tutte le modifiche notevoli al progetto saranno documentate in questo file.

Il formato si basa su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [1.0.0] - 2026-01-12

### ✨ Aggiunto

- **Core Features**
  - Griglia 2D (10x10) interattiva con Konva.js
  - 7 forme Tetris complete (I, L, T, O, Z, S, J)
  - Sistema drag & drop fluido con snapping automatico
  - Collision detection in tempo reale
  - Validazione posizionamento (out-of-bounds + sovrapposizione)
  
- **Feedback Visivo**
  - Colore verde per posizioni valide durante drag
  - Colore rosso per posizioni non valide
  - Animazioni smooth per interazioni
  
- **UI/UX**
  - Pannello laterale per selezione forme
  - Preview SVG di ogni forma
  - Info bar con statistiche real-time
  - Pulsante reset con conferma
  - Design moderno e responsive

- **Architettura**
  - GridEngine per logica griglia
  - ShapeDefinitions per modelli dati
  - useGridManager custom hook per state management
  - Componenti React modulari e riutilizzabili
  - TypeScript strict mode per type safety

- **Documentazione**
  - README.md completo con guida utilizzo
  - ARCHITECTURE.md con spiegazione dettagliata
  - Commenti inline nel codice
  - Esempi per estensioni future

### 🎯 Future Roadmap (Non implementato)

- [ ] Rotazione pezzi (tasto R)
- [ ] Undo/Redo con stack history
- [ ] Save/Load stato in localStorage
- [ ] Griglia dinamica (dimensioni configurabili)
- [ ] Forme personalizzate con editor visuale
- [ ] Multi-selezione forme
- [ ] Export/Import come JSON/PNG
- [ ] Mobile touch support
- [ ] Keyboard shortcuts avanzati
- [ ] Modalità dark mode
- [ ] Tutorial interattivo

---

## Versioni Future

### [1.1.0] - Planned

**Focus**: Miglioramenti UX e rotazione

- Implementazione rotazione pezzi
- Keyboard shortcuts (R, Delete, Ctrl+Z)
- Animazioni transizione
- Sound effects (optional)

### [1.2.0] - Planned

**Focus**: Persistenza e history

- Undo/Redo completo
- Auto-save in localStorage
- Export/Import configurazioni
- Multiple grid presets

### [2.0.0] - Planned

**Focus**: Editor avanzato

- Forme personalizzate
- Griglia dinamica
- Multi-layer support
- Collaborative editing (WebSocket)

---

## Template per Versioni Future

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Nuove funzionalità

### Changed
- Modifiche a funzionalità esistenti

### Deprecated
- Funzionalità in via di dismissione

### Removed
- Funzionalità rimosse

### Fixed
- Bug fix

### Security
- Fix di sicurezza
```

