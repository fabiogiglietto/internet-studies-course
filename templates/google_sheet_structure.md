# Specifica del Foglio Google master per il progetto di gruppo

Questa specifica descrive la struttura del **Foglio Google master** che il docente prepara prima della Lezione 10 e che ogni gruppo poi clona come proprio foglio di lavoro.

**Obiettivo pedagogico:** gli studenti del terzo anno triennale hanno scarsa familiarità con i fogli di calcolo. Tutto ciò che è formula, tabella pivot, grafico o calcolo statistico **deve essere già pronto**. Gli studenti interagiscono solo tramite **menu a tendina**, **scrittura libera in celle ben delimitate**, e **lettura** dei risultati.

**Regola d'oro:** se uno studente *deve scrivere una formula*, qualcosa è andato storto nella preparazione del foglio.

---

## Convenzioni grafiche

- **Sfondo grigio chiaro (#F2F2F2)** = celle protette / sola lettura.
- **Sfondo bianco** = celle in cui gli studenti scrivono.
- **Sfondo arancione DISCUI (#F2A7A0)** = intestazioni di colonna.
- **Sfondo arancione scuro (#C5612E) con testo bianco** = intestazione del tab / titolo della sezione.
- **Conditional formatting rosso** = κ < 0.60 (allerta affidabilità) o errore di validazione dati.

---

## Struttura: 10 tab

| # | Nome del tab | Stato | Chi tocca cosa |
|---|--------------|-------|----------------|
| 1 | `00_README` | Sola lettura | Nessuno |
| 2 | `01_Dataset_master` | Protetto | Nessuno (lettura) |
| 3 | `02_Campione_gruppo` | Protetto dopo Checkpoint 1 | Nessuno (lettura) |
| 4 | `03_Codebook` | Editabile | Tutti (categorie + definizioni) |
| 5 | `04_Codifica_coder1` … `coderN` | Editabile (un tab a coder) | Solo il coder titolare |
| 6 | `05_Sottocampione_affidabilità` | Editabile (una colonna a coder) | Tutti (la propria colonna) |
| 7 | `06_Kappa` | Sola lettura | Nessuno |
| 8 | `07_Codifica_finale` | Sola lettura | Nessuno |
| 9 | `08_Engagement` | Sola lettura | Nessuno |
| 10 | `09_Log_decisioni` | Editabile | Tutti |

---

### Tab 1: `00_README`

Una pagina di benvenuto. Contiene:

- Nome del corso, A.A., docente.
- Mappa dei tab (la tabella qui sopra).
- Definizione dei **ruoli del gruppo** (suggeriti, non obbligatori): coordinatore, codificatore-capo, custode del log, scrittore, revisore.
- Legenda colori.
- Link al **template del saggio** in Drive.
- Link al **template del codebook** in Drive.
- Promemoria sui **checkpoint** e sulle date di consegna.

---

### Tab 2: `01_Dataset_master` (protetto, sola lettura)

Il corpus completo TikTok caricato dal docente.

**Colonne (in quest'ordine):**

| Colonna | Tipo | Note |
|---------|------|------|
| `video_id` | Stringa | Identificativo univoco TikTok |
| `create_time` | Data | Formato `YYYY-MM-DD HH:MM` |
| `username` | Stringa | Account dell'autore |
| `video_description` | Testo lungo | Caption + descrizione |
| `voice_to_text` | Testo lungo | Trascrizione audio (vuoto quando non disponibile) |
| `hashtag_names` | Lista (separata da virgola) | Hashtag del post |
| `view_count` | Intero | Visualizzazioni |
| `like_count` | Intero | Like |
| `comment_count` | Intero | Numero di commenti (NON il testo dei commenti) |
| `share_count` | Intero | Condivisioni |
| `video_duration` | Intero (secondi) | Durata del video |
| `watch_url` | URL cliccabile | Apre il video su TikTok web |

**Protezione:** intero foglio in sola lettura per tutti tranne il docente.

**Filtro consigliato (pre-attivato):** `view_count > 0` per escludere post anomali.

---

### Tab 3: `02_Campione_gruppo` (protetto dopo Checkpoint 1)

Sottoinsieme di N=120 post estratto dal master con campionamento casuale (o stratificato, se la RQ lo giustifica).

**Generazione:**
- Funzione `RANDBETWEEN` o `INDEX(SORTBY(..., RANDARRAY(...)), 1, ...)` applicata a `01_Dataset_master`.
- Il campione è **rigenerato una sola volta** al momento del Checkpoint 1 e poi **convertito in valori statici** (Copia → Incolla speciale → Solo valori) e **protetto**.

**Colonne:** stesse di `01_Dataset_master` + colonna `coder_assegnato` (chi codifica quel post; alimentata in funzione del numero di membri del gruppo).

---

### Tab 4: `03_Codebook` (editabile)

Tabella in cui il gruppo definisce le proprie categorie.

| Colonna | Tipo | Cosa scrivere |
|---------|------|---------------|
| `id_categoria` | Intero | 1, 2, 3, ... |
| `nome_categoria` | Stringa breve | es. "meme satirico" |
| `definizione_operativa` | Testo lungo | Definizione applicabile |
| `esempio_positivo` | `video_id` | Riferimento a un post del campione |
| `esempio_negativo` | `video_id` | Riferimento a un post del campione |
| `regola_decisione` | Testo lungo | Per casi ambigui |

**Range nominato:** `lista_categorie = '03_Codebook'!B2:B` (alimenta i menu a tendina degli altri tab).

**Validazione:** `nome_categoria` deve essere unico (formato condizionale segnala duplicati).

---

### Tab 5: `04_Codifica_coderN` (uno per membro del gruppo)

Un tab per ciascun codificatore. Il docente predispone tab `coder1`, `coder2`, ..., `coder6` e li rinomina con i nomi reali a Lezione 13.

**Colonne:**

| Colonna | Tipo | Pre-popolata da | Inserita dal coder |
|---------|------|-----------------|-------------------|
| `video_id` | Stringa | `02_Campione_gruppo` filtrato per `coder_assegnato = nome_coder` | — |
| `watch_url` | URL | `02_Campione_gruppo` | — |
| `video_description` | Testo | `02_Campione_gruppo` | — |
| `categoria_assegnata` | Dropdown | — | ✅ (dropdown da `lista_categorie`) |
| `confidenza` | Dropdown 1–5 | — | ✅ |
| `note` | Testo libero | — | ✅ (opzionale) |
| `tempo_codifica_min` | Intero | — | ✅ (opzionale, per stime di lavoro) |

**Validazione:** la colonna `categoria_assegnata` accetta solo valori da `lista_categorie`; conditional formatting evidenzia in rosso le celle vuote dopo la deadline.

**Protezione:** ogni `04_Codifica_coderN` editabile **solo dal coder titolare** (e dal docente).

---

### Tab 6: `05_Sottocampione_affidabilità` (editabile, una colonna per coder)

30 post selezionati dal docente (o automaticamente: i primi 30 di `02_Campione_gruppo`) che **tutti i membri** codificano.

**Colonne:**

| Colonna | Tipo | Note |
|---------|------|------|
| `video_id` | Stringa | Pre-popolato |
| `watch_url` | URL | Pre-popolato |
| `video_description` | Testo | Pre-popolato |
| `cod_coder1` | Dropdown | Coder 1 inserisce la propria categoria |
| `cod_coder2` | Dropdown | Coder 2 inserisce la propria categoria |
| ... | ... | ... |
| `cod_coderN` | Dropdown | Coder N inserisce la propria categoria |

**Validazione:** ogni colonna `cod_coderN` accetta solo valori da `lista_categorie`; ogni colonna è protetta in modo che solo il coder corrispondente possa modificarla.

---

### Tab 7: `06_Kappa` (sola lettura, calcolato)

**Pre-costruito.** Mostra il κ di Cohen per ogni coppia di codificatori e il valore medio complessivo.

**Struttura:**

1. **Matrici di confusione pairwise:** per ogni coppia (coder_i, coder_j), una matrice categorie × categorie con conteggi.
2. **Tabella κ pairwise:** un valore di κ per ogni coppia.
3. **κ medio:** media dei κ pairwise.
4. **κ per categoria** (opzionale, solo per gruppi avanzati).

**Formula di Cohen's κ (in una cella):**

```
κ = (P_o - P_e) / (1 - P_e)

dove:
  P_o = somma diagonale matrice / N totale  (concordanza osservata)
  P_e = Σ_k (riga_k_totale × colonna_k_totale) / N²  (concordanza attesa)
```

Una cella di sintesi al top del tab mostra:
- `κ medio = X.XX`
- Interpretazione automatica via `IFS()`:
  - κ < 0.40 → "Insufficiente — rivedere il codebook"
  - 0.40 ≤ κ < 0.60 → "Marginale — discutere le discrepanze"
  - 0.60 ≤ κ < 0.80 → "Accettabile"
  - κ ≥ 0.80 → "Buono"

**Conditional formatting:** la cella κ medio è colorata di rosso se < 0.60, gialla se 0.60–0.80, verde se ≥ 0.80.

**Protezione:** intero tab in sola lettura.

---

### Tab 8: `07_Codifica_finale` (sola lettura, calcolato)

Consolida le codifiche da tutti i tab `04_Codifica_coderN` in un'unica tabella.

**Generazione:** una formula `QUERY(...)` o `=SORT(VSTACK('04_Codifica_coder1'!A2:F; '04_Codifica_coder2'!A2:F; ...))` produce la tabella consolidata.

**Colonne:** `video_id`, `coder`, `categoria_assegnata`, `confidenza`, `note`, + tutte le metriche di engagement da `01_Dataset_master` via `VLOOKUP`.

**Protezione:** sola lettura.

---

### Tab 9: `08_Engagement` (sola lettura, calcolato)

Tab dedicato all'analisi quantitativa, **già configurato**.

**Contenuto:**

1. **Tabella riassuntiva:** per ogni categoria, mediana e IQR di:
   - `view_count`
   - `like_count`
   - `comment_count`
   - `share_count`
2. **Grafici a barre:** uno per ciascuna delle quattro metriche, mediana per categoria, già rilegato a `07_Codifica_finale` (si aggiornano automaticamente quando cambiano le codifiche).
3. **Box plot panel** (opzionale): per ciascuna metrica, distribuzione per categoria.
4. **Spazio di esportazione:** sezione "Da esportare per il saggio" che evidenzia quali grafici copiare in Google Docs (tasto destro → Copia → Incolla nel documento come immagine PNG).

**Protezione:** sola lettura. Gli studenti **non costruiscono** pivot table — leggono quelle pre-costruite.

---

### Tab 10: `09_Log_decisioni` (editabile)

Tabella libera per registrare le decisioni di codifica sui casi ambigui.

| Colonna | Tipo |
|---------|------|
| `data` | Data |
| `video_id` | Stringa |
| `coder` | Stringa |
| `caso` | Testo libero (descrizione del dubbio) |
| `decisione` | Stringa breve (categoria scelta) |
| `motivazione` | Testo libero |

**Uso:** ogni voce qui registrata diventa materiale per **Appendice B** del saggio finale.

---

## Sequenza di build per il docente

1. **Prima della Lezione 10:** caricare il dataset TikTok in `01_Dataset_master`; protezione attiva.
2. **Costruire** tutte le formule, validazioni, range nominati e grafici sul **master**.
3. **Testare** il foglio simulando un gruppo fittizio (3 coder, 30 post, 5 categorie) e verificando che κ si aggiorni e che i grafici di `08_Engagement` riflettano i cambi.
4. **Prima della Lezione 13:** clonare il master per ogni gruppo (es. "Gruppo 1 — IS 2025/26"); rinominare i tab `coder1...coderN` con i nomi reali; condividere il link via Moodle.
5. **Dopo Checkpoint 1 (Lez 13):** convertire `02_Campione_gruppo` in valori statici e proteggerlo.

---

## Cosa NON includere nel foglio

- Macro Apps Script complesse (manutenzione difficile anno per anno).
- Strumenti statistici oltre κ di Cohen e mediana/IQR (oltre lo scope di un terzo anno triennale).
- Importazione automatica da TikTok API (rischio di rotture; il docente carica i CSV manualmente).
- Account-level analytics (followers, posting cadence) — fuori dallo scope delle RQ del corso.
