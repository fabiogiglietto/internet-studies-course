# Internet Studies — A.A. 2025/2026

Materiali didattici per il corso di **Internet Studies**, tenuto dal Prof. Fabio Giglietto presso l'[Universit&agrave; degli Studi di Urbino Carlo Bo](https://www.uniurb.it/), Dipartimento DISCUI.

**Sito del corso:** [fabiogiglietto.github.io/internet-studies-course](https://fabiogiglietto.github.io/internet-studies-course/)

**Programma ufficiale:** [uniurb.it/insegnamenti-e-programmi/268626](https://www.uniurb.it/insegnamenti-e-programmi/268626)

## Panoramica del corso

Il corso introduce i concetti chiave degli Internet Studies — **networked publics**, **cultura partecipativa**, **azione collettiva**, **manipolazione mediatica** ed **economia dell'attenzione** — e li applica attraverso un progetto di ricerca empirica di gruppo.

- **Durata:** 48 ore (24 lezioni da 2 ore)
- **Orario:** Mar 9:00–11:00, Mer 11:00–13:00, Gio 11:00–13:00
- **Periodo:** 31 marzo – 27 maggio 2026
- **Struttura:**
  - *Blocco 1 — Fondamenti* (lezioni 1–12): lezioni frontali, seminari, esercitazioni
  - *Blocco 2 — Laboratorio di ricerca* (lezioni 13–24): lavoro di gruppo supervisionato per la produzione di un saggio empirico in formato IMRAD

## Materiali di studio

Il corso si basa su cinque testi fondamentali:

1. Boyd, D. (2018). *It's Complicated: La vita sociale degli adolescenti sul web*. Castelvecchi (pp. 29–43).
2. Jenkins, H. (2008). *Fan, Blogger e Videogamers*. FrancoAngeli (pp. 7–22; 160–180; 219–229).
3. Shirky, C. (2009). *Uno per Uno, Tutti per Tutti*. Codice (pp. 3–119).
4. Marwick, A. & Lewis, R. (2017). *Media Manipulation and Disinformation Online*. Data & Society.
5. Boyd, D. (2017). *Hacking the Attention Economy*. Data & Society: Points.

I testi non sono inclusi in questo repository (copyright).

## Slide

Tutte le 24 presentazioni si trovano in `slides/` come file [Quarto](https://quarto.org/) reveal.js (`.qmd`), con il tema personalizzato del Dipartimento DISCUI.

### Blocco 1 — Fondamenti

| # | File | Argomento |
|---|------|-----------|
| 1 | `lez01-introduzione.qmd` | Introduzione al corso e Networked Publics |
| 2 | `lez02-jenkins-1.qmd` | Cultura partecipativa (I): il modello di Jenkins |
| 3 | `lez03-jenkins-2.qmd` | Cultura partecipativa (II): convergenza e limiti |
| 4 | `lez04-shirky-1.qmd` | Azione collettiva (I): il modello di Shirky |
| 5 | `lez05-shirky-2.qmd` | Azione collettiva (II): limiti e slacktivism |
| 6 | `lez06-manipulation-1.qmd` | Media manipulation e disinformazione (I) |
| 7 | `lez07-manipulation-2.qmd` | Media manipulation e disinformazione (II) |
| 8 | `lez08-sintesi.qmd` | Sintesi: hackerare l'economia dell'attenzione |
| 9 | `lez09-ricerca-piattaforme.qmd` | Fare ricerca con i dati delle piattaforme |
| 10 | `lez10-dataset-mcl.qmd` | Il dataset MCL: esplorazione guidata |
| 11 | `lez11-analisi-contenuto.qmd` | Analisi del contenuto, codebook e formazione gruppi |
| 12 | `lez12-imrad-gruppi.qmd` | Il formato IMRAD, le RQ e avvio codebook di gruppo |

### Blocco 2 — Laboratorio di ricerca

| # | File | Argomento |
|---|------|-----------|
| 13 | `lez13-campionamento.qmd` | Campionamento e pianificazione della codifica |
| 14 | `lez14-codifica-1.qmd` | Codifica del contenuto (I) |
| 15 | `lez15-codifica-2.qmd` | Codifica del contenuto (II) e affidabilit&agrave; |
| 16 | `lez16-engagement.qmd` | Analisi quantitativa dell'engagement |
| 17 | `lez17-integrazione.qmd` | Integrazione analisi qualitativa e quantitativa |
| 18 | `lez18-intro-methods.qmd` | Stesura Introduction e Methods |
| 19 | `lez19-results.qmd` | Stesura Results |
| 20 | `lez20-discussion.qmd` | Stesura Discussion |
| 21 | `lez21-revisione.qmd` | Revisione interna e coerenza del saggio |
| 22 | `lez22-consegna-bozza.qmd` | Sessione di lavoro finale e consegna bozza |
| 23 | `lez23-peer-review.qmd` | Peer review incrociata |
| 24 | `lez24-chiusura.qmd` | Revisione finale e presentazioni |

## Generare le slide

Requisiti: [Quarto](https://quarto.org/) (>= 1.4).

```bash
# Generare una singola lezione
quarto render slides/lez01-introduzione.qmd

# Generare tutte le lezioni
quarto render

# Anteprima dal vivo
quarto preview slides/lez01-introduzione.qmd
```

## Struttura del repository

```
├── CLAUDE.md                        # Istruzioni per la generazione delle slide
├── internet_studies_struttura_corso_2025-26.md  # Piano dettagliato del corso
├── _quarto.yml                      # Configurazione Quarto condivisa
├── _extensions/uniurb/              # Tema DISCUI arancione (discui.scss)
├── R/uniurb_theme.R                 # Tema ggplot2 e palette colori
├── assets/                          # Loghi dell'Ateneo
├── references.bib                   # Bibliografia condivisa (APA 7th)
├── apa.csl                          # Stile citazionale
├── slides/                          # 24 file .qmd delle lezioni
├── readings/                        # Testi del corso (non tracciati)
├── img/                             # Immagini per le slide
└── scripts/                         # Script di utilit&agrave;
```

## Licenza

I contenuti delle slide e i materiali del corso sono di propriet&agrave; di Fabio Giglietto / Universit&agrave; degli Studi di Urbino Carlo Bo. Il tema Quarto e la configurazione di build sono disponibili per il riuso.
