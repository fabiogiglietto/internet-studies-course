# Dataset — sezione Methods (testo riusabile)

> **Istruzioni per i gruppi.** Incollate questo testo nella sezione Methods §Dataset del vostro paper IMRAD e adattatelo (cifre, periodo, eventuali filtri specifici al vostro RQ). Le note in `<commento>` servono a guidarvi e vanno rimosse prima della consegna.

---

## Dataset

Il corpus analizzato è composto da **N = ~900 video TikTok** pubblicati nel periodo **1 settembre 2025 – 30 aprile 2026** e raccolti tramite la **TikTok Research API** sotto il *Data Use Agreement* accademico. Il dataset è stato pre-curato dal docente prima dell'inizio del laboratorio e fornito ai gruppi attraverso un foglio Google in sola lettura (`01_Dataset_master`).

Il tema del dataset è **la manipolazione mediatica nel discorso politico italiano nell'era dell'IA generativa**, ancorato a due casi contrastivi documentati nel periodo:

- il network *Esperia Italia* — progetto editoriale italiano di orientamento conservatore, oggetto nel gennaio 2026 di un'inchiesta congiunta di **IrpiMedia, Hermes Center e Wired Italia**, ripresa successivamente da **Report (RAI)**, che ha documentato una rete di comunicazione politica orchestrata dietro l'apparenza di informazione *grassroots* indipendente;
- il cluster di casi di **contenuti politici generati con IA** (deepfake video, voci clonate, immagini sintetiche) che ha attraversato il dibattito italiano nell'autunno 2025 e che ha portato all'**appello bipartisan al Parlamento del 18 dicembre 2025** coordinato da Pagella Politica e all'introduzione dell'art. 612-quater c.p. (1–5 anni di reclusione per la diffusione abusiva di contenuti falsi creati con l'IA).

### Procedura di campionamento

Il campionamento ha seguito un disegno **a cluster di account stratificati**, con identificazione dei seed tramite **rilevamento di comportamento coordinato** ispirato alla metodologia CooRnet (Giglietto et al.) e adattata a TikTok.

1. **Corpus di sfondo.** È stata effettuata una raccolta esplorativa via TikTok Research API su due tracce di parole chiave e hashtag (Track A: termini riferiti a Esperia e media indipendenti di destra; Track B: termini riferiti a deepfake, intelligenza artificiale e nomi di figure politiche italiane), nel periodo indicato e con filtro `region_code = IT`.

2. **Rilevamento di coordinazione.** Sulle descrizioni dei video del corpus di sfondo è stato calcolato un grafo di co-pubblicazione: due account distinti che pubblicano la stessa descrizione (o una descrizione molto simile) entro **Δ ≤ 60 minuti** sono uniti da un arco. Le componenti connesse del grafo individuano cluster di account potenzialmente coordinati. Sono stati esplorati anche valori di Δ pari a 10, 360 e 1440 minuti per verificare la robustezza del segnale.

3. **Espansione per caso.** A partire dai seed individuati, ogni caso di ancoraggio è stato espanso con tattiche specifiche: per Esperia, *talent-pipeline* e cross-promozione fra account collegati; per i contenuti IA, diffusione del video di riferimento (reposts, duet, stitch) e *fingerprint* di strumenti generativi.

4. **Cluster di confronto organico.** Una *whitelist* di account ufficiali di partito e di testate civic-media e fact-checker ha alimentato il cluster organico di confronto, integrato da un campione casuale di creator politicamente attivi non coinvolti in alcuna componente coordinata.

5. **Sotto-campionamento stratificato.** All'insieme finale di video raccolti per ciascun account è stato applicato un campionamento stratificato per cluster (`cluster_astroturfed`, `cluster_ai_amplifier`, `cluster_organic`), filtrando i video in lingua italiana (`cld3` su `video_description` e `voice_to_text`) e politicamente pertinenti (regex su keyword di policy, partiti e protagonisti).

### Quadro analitico

Le analisi distinguono due **assi indipendenti**:

- **provenienza del contenuto** (`content_provenance`): autentico (prodotto da persone) vs. generato/parzialmente generato con IA (deepfake, voce clonata, avatar sintetico, immagine illustrata da IA);
- **autenticità dell'engagement** (`engagement_authenticity`): organico vs. coordinato/inautentico (amplificazione orchestrata, *talent-pipeline*, sospetti pattern di sockpuppet o bot).

L'incrocio dei due assi genera quattro celle (organico, astroturfed, virale-sintetico, coordinato-IA) che vengono mantenute in metadati e analizzate nei Results.

### Limiti di metodo

- La TikTok Research API non restituisce il testo dei commenti né le impression nella *For You Page*: il dataset usa quindi `comment_count` e `view_count` come misure aggregate, senza analisi linguistica del pubblico.
- La trascrizione automatica `voice_to_text` ha qualità irregolare per parlato veloce o dialettale: gli estratti sono stati verificati a campione.
- Il cluster *astroturfed* ha una marcata asimmetria politica (è ancorato al caso Esperia, riconducibile all'area di destra-centrodestra): un controfattuale di pari scala su area di sinistra non è documentato nel corpus pubblico al momento della raccolta. Questo limite è esplicitato nei Results e non va generalizzato come tratto strutturale del fenomeno.

### Considerazioni etiche

Il dataset è raccolto e utilizzato esclusivamente sotto il **TikTok Research API Data Use Agreement** per finalità di didattica e ricerca. Nei materiali pubblici prodotti dai gruppi gli account sono pseudonimizzati a livello di cluster: non vengono riportati handle individuali né screenshot identificativi, anche per gli account la cui identità è stata pubblicamente discussa nelle inchieste citate. Non sono raccolti né analizzati testi di commenti, contenuti coinvolgenti minori, o dati socio-demografici degli utenti. Il file di mapping account → cluster è conservato fuori dai materiali consegnati e dal repository pubblico.

### Procedura di visualizzazione dei video (igiene dell'account)

I codificatori hanno aperto i `watch_url` del campione tramite un **account TikTok dedicato creato apposta per il laboratorio** (oppure in finestra di navigazione privata senza login), evitando di usare il proprio account personale. Questa procedura impedisce che la For You Page personale dei codificatori si "inquini" con i contenuti analizzati (AI-slop religioso, deepfake politici, contenuti cospirazionisti) e protegge l'integrità del consumo informativo dei membri del gruppo. Solo i `watch_url` esatti del campione sono stati visualizzati: nessuno scorrimento del feed.
