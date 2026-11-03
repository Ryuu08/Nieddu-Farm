# Su Pastori — Piano MVP di 14 giorni

> Periodo: **30 ottobre 2026 → 12 novembre 2026**  
> Obiettivo: ottenere una **vertical slice giocabile** del gioco.

## Obiettivo finale

Il giocatore deve poter completare questo ciclo:

```text
Avvio
→ movimento nella fattoria
→ interazione con una pecora
→ produzione di latte e lana
→ raccolta
→ inventario
→ vendita
→ monete
→ acquisto di un upgrade
→ verifica dell'effetto dell'upgrade
```

## Tempo quotidiano consigliato

- **2 ore al giorno**
- circa **28 ore totali**
- 15 minuti: leggere l'obiettivo e preparare il lavoro
- 75-90 minuti: implementazione
- 15-30 minuti: test, pulizia e appunti

Se si dispone di una sola ora, completare soltanto il traguardo minimo della giornata.

## Struttura del progetto

- [[src/entities]] — player, pecore e oggetti del mondo
- [[src/systems]] — regole di produzione, inventario ed economia
- [[src/data]] — dati e bilanciamento
- [[src/types]] — contratti TypeScript condivisi
- [[src/ui]] — componenti e formatter dell'interfaccia
- [[src/scenes]] — scene Phaser
- [[src/assets]] — immagini, mappe, suoni e font

---

## Giorno 1 — 30 ottobre

### Obiettivo

Definire il perimetro dell'MVP.

### Decisioni

- [x] Una sola fattoria
- [x] Una sola tipologia di pecora
- [ ] Latte e lana come prodotti
- [x] Monete come unica valuta
- [ ] Un punto vendita semplice
- [ ] Un solo upgrade
- [ ] Nessun salvataggio
- [x] Nessuna progressione offline
- [ ] Nessuna epoca aggiuntiva nell'MVP

### Traguardo verificabile

È chiaro cosa può fare il giocatore, come produce, raccoglie, vende e migliora la fattoria.

---

## Giorno 2 — 31 ottobre

### Obiettivo

Controllare la struttura del progetto e la procedura di avvio.

### Attività

- [ ] Verificare le cartelle `entities`, `systems`, `data`, `types` e `ui`
- [ ] Controllare i riferimenti tra i file
- [ ] Installare le dipendenze
- [ ] Verificare `npm run build`
- [ ] Verificare `npm start`

### Traguardo verificabile

Il progetto può essere installato, compilato e avviato da una macchina pulita.

---

## Giorno 3 — 1 novembre

### Obiettivo

Creare il player.

### Attività

- [ ] Movimento a quattro direzioni
- [ ] Controllo da tastiera
- [ ] Velocità configurabile
- [ ] Limiti della mappa
- [ ] Collisioni principali

### Traguardo verificabile

Il player si muove e non può uscire dall'area di gioco.

---

## Giorno 4 — 2 novembre

### Obiettivo

Creare la prima pecora.

### Attività

- [ ] Posizione iniziale
- [ ] Texture
- [ ] Corpo fisico
- [ ] Movimento semplice
- [ ] Stato di produzione

### Traguardo verificabile

La scena mostra un player e almeno una pecora interagibile.

---

## Giorno 5 — 3 novembre

### Obiettivo

Implementare la produzione indipendente di latte e lana.

### Regole

- [ ] Timer del latte separato dal timer della lana
- [ ] Prodotto pronto persistente
- [ ] Nessuna doppia raccolta nello stesso ciclo
- [ ] Produzione attiva soltanto durante la sessione
- [ ] Durate facilmente modificabili per i test

### Tempi di test consigliati

- Latte: 10 secondi
- Lana: 15 secondi

### Traguardo verificabile

La pecora produce automaticamente latte e lana senza generazione manuale del prodotto.

---

## Giorno 6 — 4 novembre

### Obiettivo

Collegare raccolta e inventario.

### Attività

- [ ] Interazione vicino alla pecora
- [ ] Indicazione del prodotto pronto
- [ ] Raccolta del latte
- [ ] Raccolta della lana
- [ ] Aggiornamento dell'inventario
- [ ] Visualizzazione di latte, lana e monete

### Traguardo verificabile

Il ciclo `attendere → avvicinarsi → raccogliere → aggiornare inventario` funziona.

---

## Giorno 7 — 5 novembre

### Obiettivo

Implementare la vendita.

### Prezzi iniziali

- 1 latte = 3 monete
- 1 lana = 5 monete

### Attività

- [ ] Punto vendita
- [ ] Pannello semplice
- [ ] Vendita del latte
- [ ] Vendita della lana
- [ ] Diminuzione del prodotto venduto
- [ ] Aumento delle monete

### Traguardo verificabile

Funziona il ciclo:

```text
produzione → raccolta → inventario → vendita → monete
```

---

## Giorno 8 — 6 novembre

### Obiettivo

Implementare il primo upgrade.

### Upgrade consigliato

**Secchio migliorato**

Esempio:

```text
Secchio base: latte ogni 10 secondi
Secchio migliorato: latte ogni 8 secondi
```

### Attività

- [ ] Costo dell'upgrade
- [ ] Acquisto con le monete
- [ ] Diminuzione del saldo
- [ ] Aumento del livello
- [ ] Applicazione reale del bonus

### Traguardo verificabile

L'upgrade modifica concretamente il tempo o la quantità della produzione.

---

## Giorno 9 — 7 novembre

### Obiettivo

Rendere chiaro il feedback dell'interfaccia.

### Messaggi necessari

- [ ] Latte pronto
- [ ] Lana pronta
- [ ] Latte raccolto
- [ ] Lana raccolta
- [ ] Prodotto venduto
- [ ] Monete insufficienti
- [ ] Upgrade acquistato

### Traguardo verificabile

Il giocatore capisce il risultato di ogni azione senza aprire la console.

---

## Giorno 10 — 8 novembre

### Obiettivo

Completare la piccola fattoria.

### Attività

- [ ] Sfondo
- [ ] Recinto
- [ ] Posizione della pecora
- [ ] Punto vendita visibile
- [ ] Punto upgrade visibile
- [ ] Collisioni leggibili
- [ ] Layout semplice e comprensibile

### Traguardo verificabile

La scena appare come una piccola fattoria giocabile, anche se ancora semplice.

---

## Giorno 11 — 9 novembre

### Obiettivo

Testare tutto il ciclo principale.

### Checklist manuale

- [ ] Avviare il gioco
- [ ] Raggiungere la pecora
- [ ] Attendere il latte
- [ ] Raccogliere il latte
- [ ] Attendere la lana
- [ ] Raccogliere la lana
- [ ] Controllare l'inventario
- [ ] Vendere il latte
- [ ] Vendere la lana
- [ ] Comprare l'upgrade
- [ ] Attendere un nuovo ciclo
- [ ] Verificare l'effetto dell'upgrade

### Traguardo verificabile

Il ciclo completo funziona senza modificare il codice durante la prova.

---

## Giorno 12 — 10 novembre

### Obiettivo

Correggere i problemi bloccanti.

### Priorità

- [ ] Timer che non parte
- [ ] Doppia raccolta
- [ ] Inventario non aggiornato
- [ ] Monete errate
- [ ] Upgrade non applicato
- [ ] Scene bloccate
- [ ] Collisioni che impediscono il gioco

### Traguardo verificabile

Il percorso principale funziona almeno tre volte consecutive.

---

## Giorno 13 — 11 novembre

### Obiettivo

Fare pulizia e rendere il codice leggibile.

### Attività

- [ ] Eliminare codice inutilizzato
- [ ] Controllare i nomi dei file
- [ ] Ridurre i log temporanei
- [ ] Controllare i tipi TypeScript
- [ ] Evitare di concentrare tutto in `GamePlay.ts`
- [ ] Verificare le responsabilità delle cartelle

### Traguardo verificabile

È facile trovare player, pecora, timer, inventario, vendita e upgrade.

---

## Giorno 14 — 12 novembre

### Obiettivo

Preparare la demo MVP.

### Demo finale

- [ ] Avvio
- [ ] Movimento
- [ ] Pecora
- [ ] Produzione
- [ ] Raccolta latte
- [ ] Raccolta lana
- [ ] Inventario
- [ ] Vendita
- [ ] Monete
- [ ] Upgrade
- [ ] Effetto dell'upgrade
- [ ] Build di produzione
- [ ] Avvio senza strumenti di debug

### Traguardo finale

Una persona esterna può avviare il gioco e completare il ciclo principale senza aiuto.

---

## Funzionalità da rimandare

- [ ] Cinque epoche
- [ ] Cambio epoca automatico
- [ ] Pecora nera
- [ ] Perdita casuale delle pecore
- [ ] Laboratorio avanzato
- [ ] Formaggio
- [ ] Coperte
- [ ] Salvataggi
- [ ] Progressione offline
- [ ] Mappe multiple
- [ ] Storia interattiva complessa

## Regola quotidiana

Alla fine di ogni giornata rispondere:

1. Cosa ho completato?
2. Cosa non funziona?
3. Qual è il prossimo passo?

Il traguardo deve essere osservabile nel gioco, non soltanto una quantità di codice scritta.

## Ordine di priorità se manca tempo

1. Movimento
2. Pecora
3. Produzione
4. Raccolta
5. Inventario
6. Vendita
7. Monete
8. Upgrade
9. HUD
10. Grafica e contenuti extra
