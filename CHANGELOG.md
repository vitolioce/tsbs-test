# Changelog - Grid Editor

## [v1.2.0] - 2026-01-20

### ✨ Nuova Funzionalità: Long Press per Rimozione Mobile
**Problema:** Su mobile non c'è hover né tasto destro per rimuovere le forme.

**Soluzione:**
- **Long press (tap lungo)** sulle forme per rimuoverle su dispositivi touch
- **Feedback visivo** arancione durante il long press
- **Timer di 600ms** per evitare rimozioni accidentali
- **Notifica toast** alla rimozione
- **Istruzioni aggiornate** nella UI per mobile e desktop

### 🎨 Sistema Notifiche Unificato
- **Eliminati tutti** `window.confirm()` e `alert()`
- **Toast notifications** per tutte le azioni (successo, info, warning, error)
- **UX non bloccante** e moderna

---

## [v1.1.0] - 2026-01-20

### 🐛 Bug Fix: Gestione Forme Fuori Griglia
**Problema risolto:** Le forme trascinate fuori dalla griglia (anche parzialmente) causavano errori di posizionamento e venivano contate incorrettamente.

**Soluzione implementata:**
1. **Rilevamento automatico:** Quando una forma viene trascinata fuori dai limiti della griglia (anche solo parzialmente), il sistema la rileva immediatamente
2. **Riposizionamento intelligente:** Il sistema cerca automaticamente la prima posizione valida disponibile nella griglia
3. **Rimozione automatica:** Se non c'è spazio disponibile, la forma viene rimossa automaticamente
4. **Notifiche user-friendly:** Messaggi toast eleganti informano l'utente delle azioni automatiche

### ✨ Nuove Funzionalità
- **Sistema di notifiche toast:** Sostituiti gli alert con notifiche toast eleganti e non invasive
- **Algoritmo di ricerca posizione:** Nuovo algoritmo che scorre la griglia sistematicamente per trovare spazi disponibili
- **Logging console:** Messaggi di debug per tracciare il comportamento del sistema

### 📝 File Modificati
- `src/hooks/useGridManager.ts`: 
  - Aggiunta funzione `findFirstAvailablePosition()`
  - Refactoring completo di `handleDragEnd()` con gestione out-of-bounds
  - Integrazione sistema notifiche toast
  
- `src/components/ShapeComponent.tsx`:
  - Aggiunto `useEffect` per sincronizzare posizione visiva Konva con stato React
  - Corretto ordine chiamate in `handleDragEnd` per garantire aggiornamento UI
  
- `src/utils/notifications.ts` (nuovo):
  - Utility per messaggi toast con animazioni
  - Supporto per 4 tipi: info, warning, error, success
  - Durata personalizzabile
  
- `src/App.tsx`:
  - Sostituzione alert con notifiche toast

### 🧪 Come Testare
1. Avvia l'applicazione: `npm run dev`
2. Aggiungi alcune forme alla griglia
3. Trascina una forma completamente fuori dalla griglia → Dovrebbe riposizionarsi automaticamente
4. Riempi la griglia completamente
5. Trascina una forma fuori → Dovrebbe essere rimossa con notifica

### 📋 Comportamenti Attesi
- ✅ Forma trascinata fuori griglia → riposizionata nella prima posizione libera
- ✅ Griglia piena + forma fuori → forma rimossa automaticamente
- ✅ Notifica toast visualizzata per 3-4 secondi
- ✅ Colore notifica: giallo (warning) per riposizionamento, rosso (error) per rimozione
- ✅ Nessun errore in console
- ✅ Conteggio forme sempre corretto

---

## [v1.0.0] - Responsive Design

### ✨ Nuove Funzionalità Responsive
- **Hook `useResponsive`:** Gestione breakpoint mobile/tablet/desktop
- **Griglia dinamica:** Celle che si adattano alle dimensioni dello schermo
- **Menu mobile:** Sidebar collapsabile con pulsante hamburger
- **Layout adattivo:** Ottimizzazioni per touch screen e dispositivi mobili

### 📱 Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
