# Codebook — assi analitici (testo da inserire nel codebook di gruppo)

> **Istruzioni per i gruppi.** Il vostro codebook (cfr. `templates/codebook_template.md`) deve includere queste due variabili come **assi indipendenti**: ogni video va codificato su entrambi. Adattate i livelli e i criteri operativi al vostro RQ; non spostate categorie da un asse all'altro (la separazione è teoricamente importante).

> ⚠ **Igiene dell'account TikTok prima di iniziare la codifica.** Per aprire i `watch_url` del campione **non usate il vostro account TikTok personale**: TikTok personalizza la For You Page in base a ciò che guardate, e centinaia di video di AI-slop religioso, deepfake politici e contenuti cospirazionisti possono "inquinare" il vostro feed personale per settimane. Aprite ogni link (a) da un account TikTok dedicato creato apposta per il laboratorio, oppure (b) in finestra di navigazione privata/in incognito senza login. Non scorrete il feed; aprite solo i `watch_url` esatti del vostro campione.

## Premessa terminologica

Distinguiamo due dimensioni che la letteratura giornalistica spesso confonde sotto l'etichetta "fake":

- **Provenienza del contenuto** = come il contenuto è stato *prodotto* (da persone vs. con strumenti di IA generativa).
- **Autenticità dell'engagement** = come l'engagement (visualizzazioni, like, share, commenti) è stato *generato* (audience reale vs. amplificazione coordinata).

Sono due assi **ortogonali**: un video generato con IA può raggiungere un pubblico autentico (cella *virale-sintetico*); un video prodotto da persone reali può circolare attraverso amplificazione orchestrata (*astroturfed*). Tenetele separate nel codebook e nelle analisi.

## Asse 1 — `content_provenance`

| Livello | Descrizione operativa | Segnali |
|---------|------------------------|---------|
| `autentico` | Immagini, audio e voci appartengono a persone reali colte in contesti reali; nessun segno di generazione o manipolazione sintetica. | Continuità di luce/ombra; coerenza di sincronia labiale; assenza di artefatti di morphing; voce con caratteristiche naturali. |
| `AI-generato` | Almeno un elemento principale (volto, voce, scena) è chiaramente sintetico. | Voci con cadenza monotona/innaturalmente liscia; sfondi uniformi o con artefatti tipici di video-gen (Sora, Veo, Runway); occhi/mani con incongruenze; watermark di tool generativi. |
| `sospetto-AI` | Indizi presenti ma non conclusivi: è possibile che uno o più elementi siano stati ritoccati/generati. | Sincronia labiale leggermente sfasata; stridore vocale; immagini con stile "AI-illustrated" senza attribuzione di tool. |
| `misto` | Frammenti reali combinati con materiale generato (es. inserto deepfake dentro un video originale). | Cambio di qualità tra segmenti; cuts o overlay con contenuto sintetico; voce reale + immagine sintetica o viceversa. |

**Regola di triage:** in caso di dubbio fra `autentico` e `sospetto-AI`, scegliere `sospetto-AI` e annotare i segnali nel campo `note`. La differenza fra `AI-generato` e `sospetto-AI` riflette il livello di confidenza, non la quantità di IA.

## Asse 2 — `engagement_authenticity`

| Livello | Descrizione operativa | Segnali |
|---------|------------------------|---------|
| `organico` | L'engagement appare guidato dall'audience naturale del creator. | Rapporto commento/visualizzazioni in linea con la mediana del cluster organico; account che commentano sono diversificati; nessun cluster di copy-paste nei commenti. |
| `sospetto-coordinato` | Indizi di amplificazione orchestrata. | Picchi anomali di share rispetto a like/visualizzazioni; co-occorrenze ripetute con altri account dello stesso cluster astroturfed; stessa descrizione su più account in finestra <60 min; commenti templatici. |
| `confermato-coordinato` | Coordinazione documentata da fonte esterna o da rilevamento CooRnet sul corpus. | Account in componente connessa del grafo di co-pubblicazione (vedi `coordinated_seed_accounts.csv`); inchiesta giornalistica che cita esplicitamente l'account; *talent pipeline* attribuita. |

**Segnali quantitativi indicativi (non sostituiscono il giudizio del coder):**

- *Share-to-view ratio* anomalo (> p95 del cluster organico): segnale di amplificazione.
- *Comment-to-view ratio* sotto p5 del cluster organico: segnale di engagement passivo da bot/sockpuppet.
- *Account creation date* recente (< 6 mesi prima del post) combinato con alto volume: segnale di sockpuppet.
- *Cross-promotion frequency* con altri account astroturfed: segnale di rete.

## La griglia 2×2

L'incrocio dei due assi produce quattro celle che la letteratura (Marwick & Lewis 2017; Boyd 2017) tratta come modi distinti di manipolazione:

| | **Contenuto autentico** | **Contenuto AI-generato** |
|---|---|---|
| **Engagement organico** | **C1 — Organico** (cultura partecipativa nel senso di Jenkins) | **C3 — Virale sintetico** (*source hacking* che raggiunge audience reali) |
| **Engagement coordinato** | **C2 — Astroturfed** (manipolazione con talent reale e amplificazione orchestrata; archetipo Esperia) | **C4 — Coordinato + IA** (manipolazione "industriale": astroturfing × source hacking) |

Negli analisi descrittive **non collassate** mai i due assi in un unico indice di "manipolatività": riportate sempre la distribuzione a due dimensioni e l'engagement (mediano + IQR) per cella.
