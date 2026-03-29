# Instructions for Converting Scanned Study Materials to Markdown

## Context

These are study materials for the course **Internet Studies** (A.A. 2025/2026, Prof. Fabio Giglietto, Università di Urbino).

The `.pdf` files are **NOT actual PDFs** — they are ZIP archives containing JPEG page scans. Some are two-page book spreads (left + right page in a single image). You need to unzip them, read the images visually, and produce clean Markdown transcriptions.

**`DataAndSociety_MediaManipulationAndDisinformationOnline-1__1_.pdf`** is already converted — the `.md` file is provided separately.

---

## Step 0: Unzip all files

```bash
mkdir -p study_materials

# File 1: already done (DataAndSociety_MediaManipulation.md is provided)

# File 2: Italian text
unzip "Fan_blogger_e_videogamers_2.pdf" -d study_materials/fan_blogger/
# → 49 JPEG page images

# File 3: English article (danah boyd, Medium)
unzip "Hacking_the_Attention_Economy__For_most_nontechnical_folks__hacking_____by_danah_boyd___Data__Society__Points___Medium.pdf" -d study_materials/hacking_attention/
# → 16 JPEG page images + 1.txt

# File 4: Italian translation of danah boyd's book intro
unzip "Its_complicated_intro.pdf" -d study_materials/its_complicated/
# → 9 JPEG page images (two-page book spreads)

# File 5: Italian text
unzip "Uno_per_uno_tutti_per_tutti_1compressed.pdf" -d study_materials/uno_per_uno/
# → 60 JPEG page images
```

---

## Step 1: Convert each set of images to Markdown

Process **one document at a time**. For each document, read the JPEG images in order (1.jpeg, 2.jpeg, ...) and produce a single `.md` file with the full text.

### General rules for all documents:

- **Language**: Files 2, 4, and 5 are in **Italian**. File 3 is in **English**.
- **Two-page spreads**: Some images contain two book pages side by side. Read the LEFT page first, then the RIGHT page.
- **Page numbers**: Remove page numbers from the output.
- **Running headers/footers**: Remove repeated headers and footers (e.g., author name, book title at top of pages).
- **Structure**: Use `#` for the document title, `##` for chapters/major sections, `###` for subsections.
- **Footnotes/endnotes**: Preserve them, using Markdown footnote syntax `[^1]` or listing them at the end.
- **Italics**: Preserve italic text for book titles, foreign words, emphasis (use `*text*`).
- **Block quotes**: Use `>` for quoted passages.
- **Accuracy**: This is study material — accuracy matters more than speed. Transcribe carefully.

---

### Document 2: Fan, blogger e videogamers (Italian, 49 pages)

- **Output file**: `Fan_blogger_e_videogamers.md`
- **Header to use**:
  ```markdown
  # Fan, blogger e videogamers
  
  **Lingua:** Italiano
  ```
- These appear to be single-page scans, so straightforward reading.
- Process in batches: images 1-10, then 11-20, etc.

### Document 3: Hacking the Attention Economy (English, 16 pages)

- **Output file**: `Hacking_the_Attention_Economy.md`
- **Author**: danah boyd (lowercase intentional)
- **Header to use**:
  ```markdown
  # Hacking the Attention Economy

  **Author:** danah boyd  
  **Published:** January 5, 2017  
  **Source:** Data & Society: Points (Medium)
  ```
- There is also a `1.txt` file in the archive — check if it contains useful text.
- These are screenshots of a Medium article, so watch for UI elements to exclude (clap buttons, sidebar recommendations, etc.).

### Document 4: It's Complicated — Introduzione (Italian, 9 pages)

- **Output file**: `Its_Complicated_Introduzione.md`
- **Header to use**:
  ```markdown
  # It's Complicated — Introduzione

  **Autore:** danah boyd  
  **Titolo originale:** *It's Complicated: The Social Lives of Networked Teens* (2014)  
  **Traduzione:** Federico Bertagna  
  **Editore:** Castelvecchi, 2018  
  **Prefazione:** Fabio Chiusi
  ```
- **WARNING**: Pages 3–9 are **two-page book spreads** (left page + right page in one image). Read left page fully, then right page.
- Page 1 is the title/copyright page. Page 2 starts the "Introduzione" text.

### Document 5: Uno per uno, tutti per tutti (Italian, 60 pages)

- **Output file**: `Uno_per_uno_tutti_per_tutti.md`
- **Header to use**:
  ```markdown
  # Uno per uno, tutti per tutti

  **Lingua:** Italiano
  ```
- This is the longest document. Process in batches of ~10 images.
- These may be single-page or two-page spreads — check the first few images to determine the layout.

---

## Step 2: Verify output

After each document, do a quick sanity check:
- `wc -w <file>.md` — word count should be roughly proportional to page count
- Check that section headers are properly formatted
- Spot-check a few paragraphs against the original images for accuracy

---

## Suggested Claude Code prompts

Start a session and use prompts like:

```
Read the JPEG images in study_materials/its_complicated/ (files 1.jpeg through 9.jpeg) 
and transcribe the full text into a clean Markdown file. 

The text is in Italian. Pages 3-9 are two-page book spreads — read the left page first, 
then the right page. Remove page numbers and running headers. 
Use ## for major sections and ### for subsections. Preserve footnotes.

Save the output as Its_Complicated_Introduzione.md
```

For the longer documents (49 and 60 pages), work in batches:

```
Let's start with the first 10 images (1.jpeg to 10.jpeg) in study_materials/fan_blogger/. 
Read each image and transcribe the Italian text into Markdown. 
We'll build the full document incrementally.
```

---

## File summary

| # | File | Language | Pages | Output filename |
|---|------|----------|-------|-----------------|
| 1 | DataAndSociety... | English | text file | ✅ Already converted |
| 2 | Fan_blogger_e_videogamers_2 | Italian | 49 | Fan_blogger_e_videogamers.md |
| 3 | Hacking_the_Attention_Economy... | English | 16 | Hacking_the_Attention_Economy.md |
| 4 | Its_complicated_intro | Italian | 9 | Its_Complicated_Introduzione.md |
| 5 | Uno_per_uno_tutti_per_tutti... | Italian | 60 | Uno_per_uno_tutti_per_tutti.md |
