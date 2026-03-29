# Internet Studies — A.A. 2025/2026

Course materials for **Internet Studies**, taught by Prof. Fabio Giglietto at [Universit&agrave; degli Studi di Urbino Carlo Bo](https://www.uniurb.it/), DISCUI Department.

**Official programme:** [uniurb.it/insegnamenti-e-programmi/268626](https://www.uniurb.it/insegnamenti-e-programmi/268626)

## Course overview

The course introduces key Internet Studies concepts — **networked publics**, **participatory culture**, **collective action**, **media manipulation**, and the **attention economy** — and applies them through an empirical research project.

- **Duration:** 48 hours (24 lectures, 2 hours each)
- **Schedule:** Tue 9:00–11:00, Wed 11:00–13:00, Thu 11:00–13:00
- **Period:** March 31 – May 27, 2026
- **Structure:**
  - *Block 1 — Foundations* (lectures 1–12): theory, seminars, exercises
  - *Block 2 — Research Lab* (lectures 13–24): supervised group work producing an IMRAD research paper

## Readings

The course draws on five core texts:

1. Boyd, D. (2018). *It's Complicated: La vita sociale degli adolescenti sul web*. Castelvecchi (pp. 29–43).
2. Jenkins, H. (2008). *Fan, Blogger e Videogamers*. FrancoAngeli (pp. 7–22; 160–180; 219–229).
3. Shirky, C. (2009). *Uno per Uno, Tutti per Tutti*. Codice (pp. 3–119).
4. Marwick, A. & Lewis, R. (2017). *Media Manipulation and Disinformation Online*. Data & Society.
5. Boyd, D. (2017). *Hacking the Attention Economy*. Data & Society: Points.

Reading materials are not included in this repository (copyright).

## Slides

All 24 lecture slide decks are in `slides/` as [Quarto](https://quarto.org/) reveal.js presentations (`.qmd` files), using a custom DISCUI department theme.

### Block 1 — Foundations

| # | File | Topic |
|---|------|-------|
| 1 | `lez01-introduzione.qmd` | Course introduction & Networked Publics |
| 2 | `lez02-jenkins-1.qmd` | Participatory Culture (I): Jenkins' model |
| 3 | `lez03-jenkins-2.qmd` | Participatory Culture (II): Convergence & limits |
| 4 | `lez04-shirky-1.qmd` | Collective Action (I): Shirky's model |
| 5 | `lez05-shirky-2.qmd` | Collective Action (II): Slacktivism |
| 6 | `lez06-manipulation-1.qmd` | Media Manipulation (I): Tactics |
| 7 | `lez07-manipulation-2.qmd` | Media Manipulation (II): Mainstreaming |
| 8 | `lez08-sintesi.qmd` | Synthesis: Hacking the Attention Economy |
| 9 | `lez09-ricerca-piattaforme.qmd` | Platform research methods |
| 10 | `lez10-dataset-mcl.qmd` | MCL dataset exploration (hands-on) |
| 11 | `lez11-analisi-contenuto.qmd` | Content analysis, codebook & group formation |
| 12 | `lez12-imrad-gruppi.qmd` | IMRAD format, RQs & codebook drafting |

### Block 2 — Research Lab

| # | File | Topic |
|---|------|-------|
| 13 | `lez13-campionamento.qmd` | Sampling & coding plan |
| 14 | `lez14-codifica-1.qmd` | Content coding (I) |
| 15 | `lez15-codifica-2.qmd` | Content coding (II) & inter-coder reliability |
| 16 | `lez16-engagement.qmd` | Quantitative engagement analysis |
| 17 | `lez17-integrazione.qmd` | Integrating qualitative & quantitative analysis |
| 18 | `lez18-intro-methods.qmd` | Writing Introduction & Methods |
| 19 | `lez19-results.qmd` | Writing Results |
| 20 | `lez20-discussion.qmd` | Writing Discussion |
| 21 | `lez21-revisione.qmd` | Internal revision (flex session) |
| 22 | `lez22-consegna-bozza.qmd` | Final work & draft submission |
| 23 | `lez23-peer-review.qmd` | Cross-group peer review |
| 24 | `lez24-chiusura.qmd` | Final revision & presentations |

## Building the slides

Requires [Quarto](https://quarto.org/) (>= 1.4).

```bash
# Render a single lecture
quarto render slides/lez01-introduzione.qmd

# Render all lectures
quarto render

# Live preview
quarto preview slides/lez01-introduzione.qmd
```

## Repository structure

```
├── CLAUDE.md                        # Slide generation instructions
├── internet_studies_struttura_corso_2025-26.md  # Full course plan
├── _quarto.yml                      # Shared Quarto config
├── _extensions/uniurb/              # DISCUI orange theme (discui.scss)
├── R/uniurb_theme.R                 # ggplot2 theme & color palettes
├── assets/                          # University logos
├── references.bib                   # Shared bibliography (APA 7th)
├── apa.csl                          # Citation style
├── slides/                          # All 24 .qmd lecture files
├── readings/                        # Course readings (not tracked)
├── img/                             # Slide images
└── scripts/                         # Utility scripts
```

## License

Slide content and course materials are copyright Fabio Giglietto / Universit&agrave; degli Studi di Urbino Carlo Bo. The Quarto theme and build configuration are available for reuse.
