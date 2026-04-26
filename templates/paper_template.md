# Template del Saggio IMRAD — Internet Studies, A.A. 2025/2026

> **Come si usa.** Questo è lo scheletro del saggio finale del progetto di gruppo. Copia tutto il contenuto in un nuovo Google Doc condiviso tra i membri del gruppo. Compila ogni sezione seguendo le indicazioni, **mantenendo i titoli e l'ordine**. Cancella i blocchi `> Indicazioni:` solo quando hai compilato la sezione corrispondente.
>
> **Lunghezza totale:** 4.000–6.000 parole (escluse Bibliografia e Appendici).
> **Stile:** italiano accademico; APA 7 per le citazioni; un'idea per paragrafo.
> **Dataset:** post TikTok raccolti via TikTok Research API, condivisi nel Foglio Google del gruppo.

---

## Frontespizio

- **Titolo del saggio:** [titolo specifico — *non* "Progetto di gruppo IS"]
- **Gruppo n°:** [N]
- **Membri:** [Nome Cognome 1; Nome Cognome 2; ...]
- **Domanda di ricerca scelta:** RQ1 / RQ2 (cancellare quella non usata)
- **Corso:** Internet Studies — A.A. 2025/2026
- **Docente:** Fabio Giglietto
- **Data di consegna:** [gg/mm/2026]

---

## Abstract (150–200 parole)

> Indicazioni: scrivi l'Abstract **per ultimo**, dopo aver finito tutte le altre sezioni. Quattro frasi:
> 1. **Obiettivo:** quale fenomeno indagate, su quale piattaforma, con quale RQ.
> 2. **Dataset e metodo:** dataset TikTok (N post), codifica manuale di [N] categorie da [M] codificatori, affidabilità misurata con κ di Cohen.
> 3. **Risultati principali:** 1–2 pattern empirici (numeri concreti).
> 4. **Conclusione sintetica:** cosa ci dice questo del fenomeno indagato, in una frase.

[Testo dell'Abstract]

**Parole chiave:** [3–5 termini, separati da virgola]

---

## 1. Introduction (~800–1.200 parole)

> Indicazioni: struttura **a imbuto**. Quattro movimenti, in quest'ordine.
>
> 1. **Fenomeno generale.** Aprite con TikTok come piattaforma e con il fenomeno specifico che indagate (es. uso politico delle piattaforme; meme warfare; partecipazione orchestrata). 1–2 paragrafi.
> 2. **Rilevanza.** Perché ha senso studiarlo: implicazioni per il dibattito pubblico, per gli ecosistemi informativi, per la qualità del discorso. 1 paragrafo.
> 3. **Quadro teorico.** Tessete insieme i 5 testi del corso (boyd 2018 sulle affordance; Jenkins 2008 sulla cultura partecipativa; Shirky 2009 sui costi di coordinamento; Marwick & Lewis 2017 sulle tattiche di manipolazione; boyd 2017 sull'arco storico dell'economia dell'attenzione). Mostrate **come si parlano**, non elencateli. 2–3 paragrafi.
> 4. **Domanda di ricerca.** La RQ deve emergere logicamente dal punto 3. Formulatela in modo esplicito, in corsivo. Anticipate in 2–3 righe il metodo (codifica manuale di N post TikTok, analisi degli engagement per categoria).

[Testo dell'Introduction]

---

## 2. Methods (~800–1.200 parole)

### 2.1 Dataset

> Indicazioni: descrivete la fonte in modo **replicabile**. Includete:
> - **Origine:** TikTok Research API (raccolta a cura del docente).
> - **Query:** termini di ricerca, hashtag o account-list usati per filtrare il corpus.
> - **Periodo di raccolta:** [data inizio] – [data fine].
> - **Dimensione del corpus iniziale:** N post.
> - **Campi disponibili:** `video_id`, `create_time`, `username`, `video_description`, `voice_to_text` (quando disponibile), `hashtag_names`, `view_count`, `like_count`, `comment_count`, `share_count`, `video_duration`, `watch_url`.
> - **Campi NON disponibili:** testo dei singoli commenti (solo conteggio); impressioni dalla FYP (solo `view_count`); dati socio-demografici sull'utenza.

[Testo del paragrafo Dataset]

### 2.2 Codebook

> Indicazioni: presentate **sinteticamente** le categorie di analisi (4–7 tipicamente). Per ciascuna, una riga con definizione operativa. **Il codebook completo va in Appendice A** — qui basta una tabella riassuntiva.
>
> Spiegate **come avete sviluppato il codebook**: punto di partenza (tassonomia di Marwick & Lewis 2017 per RQ1; continuum partecipazione genuina↔strumentalizzata per RQ2), cicli di pilot, modifiche. Citate eventuali usi di Gemini per draftare definizioni o discutere casi ambigui (poi ripreso nella Dichiarazione d'uso dell'IA).

| Categoria | Definizione sintetica |
|-----------|----------------------|
| [cat_1] | [definizione] |
| [cat_2] | [definizione] |
| ... | ... |

### 2.3 Procedura di codifica

> Indicazioni:
> - **Campione:** N post estratti dal corpus iniziale (random / stratificato — giustificate).
> - **Allocazione:** ciascun codificatore ha codificato [k] post; sotto-campione comune di [30] post codificato da **tutti** i membri per il calcolo dell'affidabilità.
> - **Strumento:** Foglio Google del gruppo — tab `04_Codifica_coderN`, dropdown vincolato alle categorie del codebook.
> - **Casi ambigui:** registrati nel tab `09_Log_decisioni`; discussi a fine sessione.

[Testo della Procedura]

### 2.4 Affidabilità inter-codificatore

> Indicazioni:
> - **Metrica:** κ di Cohen, calcolato dal tab `06_Kappa` del Foglio Google.
> - **Soglia:** κ > 0.60 considerato accettabile; κ > 0.80 buono.
> - **Risultato:** valore complessivo + valori per coppia di codificatori (vanno presentati in dettaglio nei Results, qui solo l'esito qualitativo).
> - **Azioni correttive:** se per qualche categoria κ era basso, descrivete la ricodifica.

[Testo dell'Affidabilità]

---

## 3. Results (~1.000–1.500 parole)

> Indicazioni generali: i Results **descrivono**, non interpretano. Niente "perché", niente "questo dimostra che" — quelli vanno in Discussion. Ogni tabella e ogni grafico deve essere **introdotto nel testo** prima di essere mostrato, e commentato dopo.

### 3.1 Distribuzione delle categorie

> Indicazioni: tabella di frequenze (N e %). Commento di 1–2 paragrafi: quale categoria prevale? Quale è marginale?

[Tabella + testo]

### 3.2 Affidabilità

> Indicazioni: tabella con κ complessivo e κ per categoria (o per coppia di codificatori). 1 paragrafo che descrive dove l'accordo è alto e dove è basso, citando la matrice di confusione del tab `06_Kappa` se utile.

[Tabella + testo]

### 3.3 Pattern di engagement per categoria

> Indicazioni: una tabella con **mediana** (non media — le distribuzioni di engagement sono fortemente asimmetriche) e IQR per le quattro metriche TikTok: `view_count`, `like_count`, `comment_count`, `share_count`. Almeno **un grafico** (a barre o box plot) generato dal tab `08_Engagement` del Foglio Google. Commento di 2–3 paragrafi sui pattern principali.

[Tabella + grafico + testo]

---

## 4. Discussion (~800–1.200 parole)

> Indicazioni: cinque momenti, in quest'ordine.
>
> 1. **Sintesi dei risultati principali** alla luce della RQ. 1 paragrafo.
> 2. **Collegamento ai 5 testi del corso.** I risultati confermano, complicano o contraddicono quanto previsto da boyd, Jenkins, Shirky, Marwick & Lewis, boyd? 2–3 paragrafi.
> 3. **Riflessione metodologica.** Cosa ha funzionato, cosa è stato difficile, cosa avete imparato dal processo di codifica. 1 paragrafo.
> 4. **Limiti dello studio.** Onesti ma non auto-svalutanti: campione tematicamente vincolato dalla query; assenza di testo dei commenti; nessun dato sull'esposizione FYP; periodo limitato; soggettività residua della codifica nonostante il κ > 0.60. 1 paragrafo.
> 5. **Implicazioni.** Cosa significano i risultati per la comprensione della manipolazione/partecipazione su TikTok? Aperture per ricerche future. 1 paragrafo.

[Testo della Discussion]

---

## 5. Conclusioni (1–2 paragrafi)

> Indicazioni: risposta diretta alla RQ + un'unica frase sul contributo principale. **Non riassumere tutto il saggio** — quello l'ha già fatto l'Abstract.

[Testo delle Conclusioni]

---

## 6. Dichiarazione d'uso dell'IA generativa

> **Obbligatoria.** Compilate **anche se non avete usato nessuna IA**.
>
> Per ogni strumento usato, dichiarate: (a) **quale**, (b) **per cosa**, (c) **come avete verificato l'output**. Esempi:
> - "Gemini chat è stato usato per draftare definizioni di codebook nella sessione del [data]; tutte le definizioni sono state riviste e modificate dal gruppo prima di essere adottate."
> - "Gemini chat è stato consultato per discutere [N] casi ambigui durante la codifica; le decisioni finali sono state prese dai codificatori umani e registrate in `09_Log_decisioni`."
> - "Gemini chat è stato usato per revisionare la prosa di due paragrafi della Discussion; i contenuti analitici sono originali del gruppo."
>
> **NON è permesso** usare l'IA per: scrivere intere sezioni, sostituire la lettura dei testi del corso, eseguire la codifica al posto dei codificatori umani.

[Dichiarazione del gruppo]

---

## 7. Bibliografia

> Indicazioni: APA 7. Inserire **almeno** i 5 testi del corso citati nel saggio. Eventuali fonti esterne (giornalistiche, di contesto) ammesse ma non sostitutive dei 5 testi.

- boyd, d. (2017). *Hacking the attention economy*. Data & Society. [https://points.datasociety.net/...](https://points.datasociety.net/)
- boyd, d. (2018). *It's complicated: La vita sociale degli adolescenti sul web* (Introduzione, pp. 29–43). Castelvecchi.
- Jenkins, H. (2008). *Fan, blogger e videogamers: L'emergere delle culture partecipative nell'era digitale*. FrancoAngeli.
- Marwick, A., & Lewis, R. (2017). *Media manipulation and disinformation online*. Data & Society.
- Shirky, C. (2009). *Uno per uno, tutti per tutti: Il potere di organizzare senza organizzazione*. Codice Edizioni.
- [Aggiungere altre fonti citate]

---

## Appendice A — Codebook completo

> Indicazioni: riportate il codebook nella sua versione **finale** (post-pilot, post-correzioni di affidabilità). Per ciascuna categoria:
> - Nome della categoria
> - Definizione operativa estesa
> - Almeno **un esempio positivo** (`video_id` dal dataset)
> - Almeno **un esempio negativo** (un post che *sembra* della categoria ma non lo è, e perché)
> - Regola di decisione per i casi ambigui

[Codebook]

---

## Appendice B — Log delle decisioni di codifica

> Indicazioni: 5–10 voci esemplificative dal tab `09_Log_decisioni` del Foglio Google. Ciascuna voce in formato:
>
> | Data | `video_id` | Caso | Decisione | Motivazione |
> |------|-----------|------|-----------|-------------|

[Log]
