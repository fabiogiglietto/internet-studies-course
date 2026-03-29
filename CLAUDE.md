# CLAUDE.md — Course Slide Generation Instructions

## Project

Generate lecture slides for **"Internet Studies"**, A.Y. 2025/2026, taught by Prof. Fabio Giglietto at Università degli Studi di Urbino Carlo Bo, DISCUI Department.

Slides are **Quarto reveal.js** format (HTML output) using the DISCUI department orange theme.

**CRITICAL: All slide content (titles, body text, speaker notes, captions) MUST be in Italian.** English technical terms (networked publics, participatory culture, attention economy, collective action, media manipulation, slacktivism, culture jamming, brigading, astroturfing, meme warfare) are kept in English and italicized on first use. Tool and platform names (Facebook, Google Sheets, Meta Content Library) remain in English.

---

## Course Overview

- **Duration:** 48 hours (24 lectures × 2 hours)
- **Schedule:** Tue 9:00–11:00 (C1), Wed 11:00–13:00 (D3), Thu 11:00–13:00 (C2)
- **Structure:** Block 1 — Foundations (lectures 1–12, Mar 31 – Apr 29); Block 2 — Research Lab (lectures 13–24, Apr 30 – May 27)
- **Holidays:** Apr 3–8 (Easter break)
- **Final submission:** Jun 3, 2026

---

## Directory Structure

```
IS-teachingm/
├── CLAUDE.md                          ← This file
├── internet_studies_struttura_corso_2025-26.md ← Full course plan
├── CLAUDE_CODE_INSTRUCTIONS.md        ← PDF-to-markdown conversion docs (completed)
├── _quarto.yml                        ← Shared Quarto config
├── _extensions/
│   └── uniurb/
│       ├── _extension.yml
│       └── discui.scss                ← DISCUI orange theme
├── R/
│   └── uniurb_theme.R                ← Color palettes + ggplot2 theme
├── assets/
│   ├── logo-uniurb-white.svg         ← White logo (dark slides)
│   └── logo-nh-uniurb.svg            ← Color logo (light slides)
├── references.bib                     ← Shared bibliography
├── apa.csl                            ← APA 7th citation style
├── slides/
│   ├── _template.qmd                 ← Reusable slide template
│   └── lez01-introduzione.qmd        ← (etc.)
├── readings/                          ← PDFs + markdown transcriptions
├── img/                               ← Slide images
├── scripts/
│   └── pdf_to_md.py                   ← PDF-to-markdown converter
└── _output/                           ← Rendered HTML
```

---

## Sessions Requiring Slides (24 lectures)

All lectures require slides. The full plan is in `internet_studies_struttura_corso_2025-26.md`.

### Block 1 — Foundations (Lectures 1–12)

| # | Suggested File | Title (Italian) | Date | Day |
|---|----------------|-----------------|------|-----|
| 1 | `lez01-introduzione.qmd` | Introduzione al Corso e Networked Publics | Mar 31 | Tue |
| 2 | `lez02-jenkins-1.qmd` | Cultura Partecipativa (I): Il Modello di Jenkins | Apr 1 | Wed |
| 3 | `lez03-jenkins-2.qmd` | Cultura Partecipativa (II): Convergenza e Limiti | Apr 2 | Thu |
| 4 | `lez04-shirky-1.qmd` | Azione Collettiva (I): Il Modello di Shirky | Apr 9 | Thu |
| 5 | `lez05-shirky-2.qmd` | Azione Collettiva (II): Limiti e Slacktivism | Apr 14 | Tue |
| 6 | `lez06-manipulation-1.qmd` | Media Manipulation e Disinformazione (I) | Apr 15 | Wed |
| 7 | `lez07-manipulation-2.qmd` | Media Manipulation e Disinformazione (II) | Apr 16 | Thu |
| 8 | `lez08-sintesi.qmd` | Sintesi: Hackerare l'Economia dell'Attenzione | Apr 21 | Tue |
| 9 | `lez09-ricerca-piattaforme.qmd` | Fare Ricerca con i Dati delle Piattaforme | Apr 22 | Wed |
| 10 | `lez10-dataset-mcl.qmd` | Il Dataset MCL: Esplorazione Guidata | Apr 23 | Thu |
| 11 | `lez11-analisi-contenuto.qmd` | Analisi del Contenuto, Codebook e Formazione Gruppi | Apr 28 | Tue |
| 12 | `lez12-imrad-gruppi.qmd` | Il Formato IMRAD, le RQ e Avvio Codebook di Gruppo | Apr 29 | Wed |

### Block 2 — Research Lab (Lectures 13–24)

| # | Suggested File | Title (Italian) | Date | Day |
|---|----------------|-----------------|------|-----|
| 13 | `lez13-campionamento.qmd` | Campionamento e Pianificazione della Codifica | Apr 30 | Thu |
| 14 | `lez14-codifica-1.qmd` | Codifica del Contenuto (I) | May 5 | Tue |
| 15 | `lez15-codifica-2.qmd` | Codifica del Contenuto (II) + Affidabilità | May 6 | Wed |
| 16 | `lez16-engagement.qmd` | Analisi Quantitativa dell'Engagement | May 7 | Thu |
| 17 | `lez17-integrazione.qmd` | Integrazione Analisi Qualitativa e Quantitativa | May 12 | Tue |
| 18 | `lez18-intro-methods.qmd` | Stesura Introduction e Methods | May 13 | Wed |
| 19 | `lez19-results.qmd` | Stesura Results (Tabelle e Grafici) | May 14 | Thu |
| 20 | `lez20-discussion.qmd` | Stesura Discussion | May 19 | Tue |
| 21 | `lez21-revisione.qmd` | Revisione Interna e Coerenza del Saggio | May 20 | Wed |
| 22 | `lez22-consegna-bozza.qmd` | Sessione di Lavoro Finale — Consegna Bozza | May 21 | Thu |
| 23 | `lez23-peer-review.qmd` | Peer Review Incrociata | May 26 | Tue |
| 24 | `lez24-chiusura.qmd` | Revisione Finale e Presentazioni | May 27 | Wed |

---

## YAML Header for Every .qmd File

Every slide file MUST include this header (customize title/subtitle/date per session):

```yaml
---
title: "Titolo della Lezione"
subtitle: "Internet Studies — Lezione N"
author: "Fabio Giglietto"
institute: "DISCUI · Università degli Studi di Urbino Carlo Bo"
date: "31 Marzo 2026"
date-format: "D MMMM YYYY"
format:
  revealjs:
    theme: [default, ../_extensions/uniurb/discui.scss]
    logo: ../assets/logo-uniurb-white.svg
    footer: "Internet Studies · A.A. 2025/2026"
    slide-number: c/t
    transition: fade
    width: 1920
    height: 1080
    margin: 0.08
    center: false
    hash: true
    controls: true
    progress: true
execute:
  echo: true
  warning: false
  message: false
  fig-width: 10
  fig-height: 6
  fig-dpi: 150
knitr:
  opts_chunk:
    dev: "ragg_png"
lang: it
bibliography: ../references.bib
csl: ../apa.csl
---
```

---

## DISCUI Color Palette

ALWAYS use these colors. Do not invent variants.

| Role | HEX | SCSS Variable | Usage |
|------|-----|---------------|-------|
| **Primary** | `#E06029` | `$discui-primary` | Headings, borders, markers, badges |
| **Medium** | `#F68B5F` | `$discui-medium` | Secondary text, hover states |
| **Coral** | `#F56D65` | `$discui-coral` | Accents, alerts |
| **Light** | `#F2A7A0` | `$discui-light` | Alternating table backgrounds, borders |
| **Background** | `#F2F2F2` | `$discui-bg` | Light slide background |
| **Dark background** | `#C5612E` | `$discui-warm-bg` | Dark slides (section dividers, title) |
| **Ateneo Blue** | `#294973` | `$uniurb-blue-dark` | University header, institutional accents |

For ggplot2 charts, use `source("../R/uniurb_theme.R")` with `uniurb_dept_palette("discui")` and `theme_uniurb()`.

---

## Slide Types and Quarto Syntax

### 1. Section Divider (dark orange background)

Marks major sections within a lecture. White text on orange background.

**IMPORTANT:** Use `##` (not `#`) for section dividers to keep all slides at the same level and avoid reveal.js 2D navigation issues (nested sections cause looping within section stacks).

```markdown
## Titolo della Sezione {background-color="#C5612E"}
```

### 2. Content Slide (light background — DEFAULT)

The workhorse slide. Light gray background, dark text, orange headings.

```markdown
## Titolo della Slide

Body text. **Important words** appear in bold (rendered in orange by the theme).

- First point
- Second point
- Third point
```

### 3. Content Slide (dark orange background)

For visual rhythm variation. Use sparingly (1 per every 5–6 light slides).

```markdown
## Titolo su Sfondo Scuro {background-color="#C5612E"}

Text automatically renders white thanks to the CSS theme.
```

### 4. Two Columns

```markdown
## Titolo

::: {.columns}
::: {.column width="50%"}
### Colonna Sinistra

Text or content.
:::

::: {.column width="50%"}
### Colonna Destra

Other content or image.
:::
:::
```

### 5. Image + Text

```markdown
## Titolo

![Didascalia dell'immagine](../img/image-name.png){fig-align="center" width="80%"}

Text below the image.
```

### 6. Highlight Box (orange border, white background)

```markdown
::: {.highlight-box}
**Concetto chiave:** Important text to emphasize.
:::
```

### 7. Orange Box (solid orange background)

```markdown
::: {.orange-box}
### Definizione
Text on orange background with white text.
:::
```

### 8. Callouts

```markdown
::: {.callout-note}
## Nota
Supplementary information.
:::

::: {.callout-tip}
## Suggerimento
Practical tip.
:::

::: {.callout-warning}
## Attenzione
Important warning.
:::
```

### 9. Blockquote

```markdown
> "Quoted text from an author."
>
> — Author, Year
```

### 10. Table

```markdown
| Colonna 1 | Colonna 2 | Colonna 3 |
|-----------|-----------|-----------|
| Dato A    | Dato B    | Dato C    |
```

### 11. R Code Chunk

```markdown
## Esempio di Analisi

​```{r}
#| label: example-analysis
#| echo: true
#| eval: true
#| fig-width: 12
#| fig-height: 6

source("../R/uniurb_theme.R")

library(ggplot2)

ggplot(data, aes(x = variable, y = value)) +
  geom_col(fill = uniurb_colors$blue_dark) +
  theme_uniurb() +
  labs(title = "Titolo del Grafico")
​```
```

### 12. Closing Slide

```markdown
## Grazie! {background-color="#C5612E"}

**Prossima lezione:** [title and date]

📧 fabio.giglietto@uniurb.it

🌐 blended.uniurb.it
```

---

## Content Guidelines

### Text Density

- **Maximum 6–8 lines of text** per content slide.
- **One concept per slide.** As stated in the official DISCUI template guidelines.
- Keywords go in **bold**.
- Use short, punchy sentences. Slides are NOT a textbook.
- Slides support the oral explanation — they should not be self-contained.

### Slide Count per Session

- **Block 1 lectures (2 hours):** 20–30 slides (theory + exercises)
- **Block 2 lab sessions:** 10–18 slides (brief collective moment + group work time)

### Typical Block 1 Session Structure

1. **Title slide** (auto-generated from YAML)
2. **Recap + bridge** from previous lecture: 1–2 slides
3. **Obiettivi di apprendimento** (learning objectives for this session): 1 slide — list the 2–3 objectives from the course plan in a `.highlight-box`
4. **Lecture roadmap** (agenda): 1 slide
5. **Section 1** (section divider + 4–6 content slides)
6. **Section 2** (section divider + 4–6 content slides)
7. **Exercise / Activity** instructions: 2–3 slides
8. **Summary / Key takeaways:** 1–2 slides
9. **Next steps / Reading assignment:** 1 slide
10. **Closing slide**

### Typical Block 2 Session Structure

1. **Title slide** (auto-generated from YAML)
2. **Collective moment** (mini-lecture): 3–5 slides
3. **Group work instructions:** 2–3 slides
4. **Checkpoint / deliverable reminder:** 1 slide
5. **Closing slide**

### First-Day Introductory Slides (Lecture 1 only)

The first session (`lez01-introduzione.qmd`) includes an expanded administrative section after the roadmap. This section contains:

1. **Il corso in sintesi** — basic info table (name, instructor, dates, times, rooms, platform)
2. **Panoramica del corso** — two-block structure, total hours, assessment overview
3. **Struttura delle 8 settimane** — weekly focus overview table
4. **Modalità di valutazione per frequentanti** — enrollment deadline, ¾ attendance threshold (18/24 lectures), group project 75%, participation 10%, oral exam 15%. Include details: oral exam is individual (~10 min, all 5 texts + project discussion), participation maps proportionally from attendance beyond 18/24
5. **Modalità per non frequentanti** — expanded reading list (full texts + Lewis 2018), individual essay (3,000–4,000 words), longer oral exam (~20 min)
6. **Policy sull'uso dell'IA generativa** — AI tools permitted as non-substitutive support (brainstorming, revision, analysis help); NOT for generating essay sections, replacing readings, or producing content coding; mandatory disclosure in Methods section; students bear full responsibility for content
7. **Rilevazione delle presenze** — attendance code + geolocation requirement. Attendance codes are in a [Google Sheet](https://docs.google.com/spreadsheets/d/1QZz9VSa32M2thXyAfg1bF42OXtOg9AA8CMkw3xMNiW0/edit?gid=0#gid=0)
8. **Policy per giustificare le assenze** — justified absences policy, posting deadline on blended forum
9. **Consegne in ritardo** — –1 point per day late, hard cutoff at 7 days
10. **Spazio blended** — link/QR to Moodle space (placeholder for instructor to add)

These administrative slides are specific to the first day and should NOT be repeated in other sessions.

### Visual Variation

To avoid monotony, alternate layouts:

- NEVER use more than 3 text-only slides in a row
- Insert an image, table, diagram, or box every 3–4 slides
- Alternate light and dark slides (roughly 5:1 ratio light:dark)
- Use two-column layout for comparisons or text+image
- `.highlight-box` and `.orange-box` break visual rhythm

---

## Speaker Notes

Add speaker notes to every significant slide:

```markdown
## Titolo della Slide

Visible content.

::: {.notes}
Speaker notes: full talking points, additional references,
questions to pose to students, transition to next slide.
:::
```

Speaker notes should include:
- Extended discussion points
- References to specific readings (pages, chapters)
- Questions to pose to the class
- Additional examples not shown on the slide
- Transitions to the next slide

---

## Bibliography

### Citing in Slides

Use author-date format on slides:

```markdown
(Boyd, 2018)
```

For formal citations with `references.bib`, use Quarto syntax:

```markdown
Come dimostrato da @boyd2018, i networked publics...
```

### BibTeX Keys

| Key | Material |
|-----|---------|
| `boyd2018` | Boyd, D. (2018) — *It's Complicated* (pp. 29–43) |
| `jenkins2008` | Jenkins, H. (2008) — *Fan, Blogger e Videogamers* (pp. 7–22; 160–180; 219–229) |
| `shirky2009` | Shirky, C. (2009) — *Uno per Uno, Tutti per Tutti* (pp. 3–119) |
| `marwick2017` | Marwick, A. & Lewis, R. (2017) — *Media Manipulation and Disinformation Online* |
| `boyd2017` | Boyd, D. (2017) — *Hacking the Attention Economy* |

### Readings Mapped to Sessions

| Session(s) | Primary Readings |
|------------|-----------------|
| Lecture 1 — Networked Publics | boyd2018 (pp. 29–43) |
| Lectures 2–3 — Participatory Culture | jenkins2008 (pp. 7–22, then 160–180; 219–229) |
| Lectures 4–5 — Collective Action | shirky2009 (pp. 3–60, then 60–119) |
| Lectures 6–7 — Media Manipulation | marwick2017 (sections 1–3, then 4–6) |
| Lecture 8 — Synthesis | boyd2017 (all five texts converge here) |
| Lectures 9–12 — Methods & Lab Prep | No new readings; integrate all five texts |
| Block 2 (13–24) | No new readings; all five texts for paper writing |

### How to Map Reading Content to Slide Elements

| Content Type | Slide Element |
|-------------|---------------|
| Theoretical frameworks | Content slides with diagrams or highlight boxes |
| Key definitions | `.orange-box` or `.highlight-box` |
| Author quotes | Blockquote with attribution |
| Taxonomy / classification | Tables |
| Step-by-step methods | Numbered list or flow diagram |
| Discussion prompts | `.callout-note` with "Da discutere" |
| Extended detail | Speaker notes (expand on concepts from the readings) |

---

## Course Readings (in `readings/`)

Both PDFs and markdown transcriptions are available in `readings/`:

| Reading | PDF | Markdown transcription |
|---------|-----|----------------------|
| Boyd (2018), *It's Complicated* — Introduzione | `Its complicated intro.pdf` | `Its_Complicated_Introduzione.md` |
| Jenkins (2008), *Fan, Blogger e Videogamers* | `Fan, blogger e videogamers (2).pdf` | `Fan_blogger_e_videogamers.md` |
| Shirky (2009), *Uno per Uno, Tutti per Tutti* | `Uno per uno, tutti per tutti (1)-compressed.pdf` | `Uno_per_uno_tutti_per_tutti.md` |
| Marwick & Lewis (2017), *Media Manipulation* | `DataAndSociety_MediaManipulationAndDisinformationOnline-1 (1).pdf` | `DataAndSociety_MediaManipulation.md` |
| Boyd (2017), *Hacking the Attention Economy* | `Hacking the Attention Economy...pdf` | `Hacking_the_Attention_Economy.md` |

**Always prefer the markdown transcriptions** for content extraction — they are complete, accurate, and faster to process than the scanned PDFs.

There is also a previous year's slide set for reference: `Internet_Studies_2025-2026_Slides.md` (from the 2024-2025 edition). This can be used as a content reference, but the layout should follow the new DISCUI Quarto theme, not the old format.

---

## Group Project: Details for Slides

The group project is central in Block 2 (lectures 13–24). Slides must guide students through:

### Project Overview
Students work in groups of **max 6** to produce a research paper (IMRAD format, 4,000–6,000 words) analyzing content from Italian Facebook pages. The project uses a **pre-curated dataset** from the Meta Content Library, provided by the instructor. All groups work on the **same dataset**. Each group chooses one of two guided research questions, develops a classification scheme (codebook), applies it via manual content analysis, validates through inter-coder reliability, and analyzes whether content categories predict engagement patterns.

### Data Available to Students
- **CSV with post metadata + engagement metrics** (reactions, comments count, shares) — shared Google Sheet
- **Multimedia content** (images/video) — shared folder
- Students do NOT have access to Meta Content Library directly

### Research Questions (Choose One)
- **RQ1 — Media manipulation tactics:** Which tactics from Marwick & Lewis (2017) are recognizable in the visual content? How do they distribute and what engagement patterns do they generate? Theoretical framework connects to Boyd (2018) affordances and Boyd (2017) attention economy.
- **RQ2 — Genuine vs. instrumentalized participation:** To what extent does content show genuine participatory culture (Jenkins, 2008) vs. strategically instrumentalized participation (Marwick & Lewis, 2017)? The key theoretical point is that manipulation is not top-down — it exploits the same bottom-up dynamics Jenkins describes as emancipatory. Boyd's (2018) affordances enable both uses; Shirky's (2009) lowered coordination costs apply to both.

### Assessment (Attending Students)
- **Group project:** 75% — evaluated with the analytic rubric (see course plan for full grading grid). All group members receive the same base grade, potentially modulated by peer evaluation.
- **Participation:** 10% — based on attendance (each lecture beyond 18/24 threshold contributes proportionally, max 3/30).
- **Oral exam:** 15% — individual, ~10 min, covers all 5 course texts + project discussion.
- **Peer evaluation:** Each student submits an anonymous form rating teammates' contributions. Significant underperformance (≤ 2.5/5) may result in up to –3 points on the project grade.
- **Late submissions:** –1 point per day, hard cutoff at 7 days.

### Individual Assignment (Lecture 7, formative)
Between Lectures 7 and 8, each student submits a brief analysis (800–1,200 words) of a media manipulation case using course concepts. This is formative (not graded) but required for attending-student status. See the course plan for details.

### Checkpoints
| Checkpoint | Lecture | Date | Deliverable |
|-----------|---------|------|-------------|
| 1 | 13 | Apr 30 | Sample extracted + codebook adapted |
| 2 | 15 | May 6 | Inter-coder reliability calculated |
| 3 | 17 | May 12 | Main results presented to instructor |
| 4 | 22 | May 21 | Draft submitted (by May 22) |
| Peer review | 23 | May 26 | Cross-review completed |
| Final | — | Jun 3 | Definitive IMRAD paper |

### IMRAD Paper Structure
- **Introduction** (~800–1,200 words): topic, relevance, theoretical framework from the 5 course texts, RQ
- **Methods** (~600–1,000 words): dataset, sampling, codebook, procedure, tools
- **Results** (~1,000–1,500 words): findings with tables and charts
- **Discussion** (~800–1,200 words): interpretation, link to theory, limitations

---

## Generation Workflow

### FUNDAMENTAL RULE: Read ALL reading materials before generating any slides.

Before generating the FIRST `.qmd` file, you MUST read EVERY markdown transcription in the `readings/` folder. The five course texts are the sole theoretical foundation — all slides must draw from them.

```bash
# Step 0: ALWAYS do this first
ls readings/*.md
# Then read every markdown file present
```

After reading all materials, retain them as a knowledge base for ALL sessions. Concepts from any reading may be relevant to any session — the texts build on each other cumulatively.

### For each session:

1. **Verify** you have already read all markdown files in `readings/` (if this is the first session you generate, read them now)
2. **Read the session description** in `internet_studies_struttura_corso_2025-26.md` for structure, timing, activities, **and learning objectives**
3. **Include learning objectives** — every Block 1 session must have an "Obiettivi di apprendimento" slide (after the recap, before the roadmap) presenting the 2–3 objectives from the course plan in a `.highlight-box`
4. **Identify relevant content** from the readings. Look for:
   - Key concepts, definitions, and theoretical frameworks relevant to the session
   - Significant quotes (brief, for slides)
   - Examples from the texts that illustrate concepts
   - Cross-cutting connections between texts (especially important for lectures 8 and 12)
   - Discussion prompts and exercise material
4. **Generate** the `.qmd` file following the standard structure
5. **Verify** slide count (see ranges by session type)
6. **Check** that bibliographic references are correct
7. **Check** that reading assignment slides use the correct labels: "Lettura da completare prima della prossima lezione" (not generic "Lettura assegnata")
8. **Render** with `quarto render slides/filename.qmd`

### Exercise and Activity Slides

Many lectures include structured exercises (individual, pairs, groups). Slides for these should:
- Clearly state the **task** in a `.highlight-box` or `.orange-box`
- Specify **time allocation** (from the course plan)
- List **step-by-step instructions** (numbered)
- Include the **deliverable** (what students produce)
- Optionally include a **discussion prompt** in a `.callout-note`

### Useful Commands

```bash
# Render a single presentation
quarto render slides/lez01-introduzione.qmd

# Render all presentations
quarto render

# Live preview
quarto preview slides/lez01-introduzione.qmd

# Check which readings are available
ls -la readings/*.md
```

---

## DO NOT

1. **DO NOT** generate all 24 sessions at once. Proceed one at a time.
2. **DO NOT** use colors outside the DISCUI palette.
3. **DO NOT** create slides with more than 8 lines of text.
4. **DO NOT** skip speaker notes.
5. **DO NOT** use emoji in slide body (only in the closing slide for contact info).
6. **DO NOT** invent content not present in the course plan or readings.
7. **DO NOT** insert placeholder images (`![](placeholder.png)`). If an image is needed, describe it in an HTML comment and leave the space.
8. **DO NOT** use `{.section-slide}` — use `{background-color="#C5612E"}` instead.
9. **DO NOT** write slide content in English (except technical terms). All output is Italian.
10. **DO NOT** create text-wall slides. One concept per slide.
11. **DO NOT** use `#` (h1) for section dividers — always use `##` (h2) to keep all slides flat and avoid reveal.js 2D navigation/looping issues.
12. **DO NOT** present data, quotes, frameworks, or findings from readings without a visible `[@bibtexkey]` citation on the slide. Every slide that uses content from a reading MUST include at least one Quarto citation (e.g., `[@boyd2018]`) in the visible body text — not only in speaker notes. This ensures proper attribution and populates the References slide.
