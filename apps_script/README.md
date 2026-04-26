# Google Sheet template builder — Apps Script

Constructs the per-RQ Google Sheet templates for the Internet Studies Block-2 lab (TikTok content analysis).

The script lives at `build_master_template.gs` in this folder. **Two templates** are created — one per Research Question — and students pick the one matching their chosen RQ to copy.

## Drive resources

| Resource | File ID |
|---|---|
| Course folder | `1ua6alxoGuBMi47uZVaipw91eZ0swuS3s` |
| `master_dataset.csv` | `1g1sEV1ELPy8ETfEfj_FCvaCg_obL-69y` |
| `Internet_Studies_2025-26 — RQ1 Template` | `1G3MlulcQyhG2grsJBkF8HyMGv31XXB4jDynhhsPzuCc` |
| `Internet_Studies_2025-26 — RQ2 Template` | `1nCXRRjfjRW-69RXoHJQAdLel1xawoODntsJvumaQFSc` |

## Setup workflow (instructor) — **run once per template**

Repeat steps 2–4 for each of the two templates listed above, choosing `setupRQ1()` or `setupRQ2()` accordingly.

1. **Open the matching template Sheet**:
   - RQ1 → `https://docs.google.com/spreadsheets/d/1G3MlulcQyhG2grsJBkF8HyMGv31XXB4jDynhhsPzuCc/edit`
   - RQ2 → `https://docs.google.com/spreadsheets/d/1nCXRRjfjRW-69RXoHJQAdLel1xawoODntsJvumaQFSc/edit`

2. **Open the Apps Script editor** — Extensions → Apps Script. Paste the entire contents of `build_master_template.gs` into the editor (replacing the default `Code.gs` contents). Save.

3. **Run the RQ-specific setup function** — from the function dropdown:
   - **For the RQ1 template**: pick `setupRQ1` and click ▶ Run.
   - **For the RQ2 template**: pick `setupRQ2` and click ▶ Run.
   On first run, approve permissions. Wait ~30 s. The 10 tabs appear with formulas + protections + named ranges + conditional formatting + charts. The `03_Codebook` tab is **already pre-seeded** with the 4 starter categories for the chosen RQ. The `00_README` tab title and intro paragraph also adapt to the RQ.

4. **Load the master CSV** — pick `loadMaster` from the function dropdown and click ▶ Run. (Zero-argument wrapper around `loadMasterFromCSV()` that uses the canonical CSV file ID baked into the script's `MASTER_CSV_FILE_ID` constant.) Pulls the CSV from Drive, pastes 900 rows into `01_Dataset_master`, formats `video_id` as plain text (preserving the 19-digit precision), and hides the `subcluster` column.

5. **Share both templates (view-only) with the class** — `Condividi → Cambia accesso → Chiunque abbia il link può visualizzare` for each. Post **both** links on Moodle so students can pick the one matching their chosen RQ.

## Student-facing flow (already encoded in the `00_README` tab)

When a group's representative opens the right template:

1. They see a banner block confirming "Questo template è per: RQ1/RQ2 …" so they catch a wrong template before copying.
2. **File → Crea una copia** (saves to their Drive).
3. **Rinominare** the copy to `Group_NN_<NomeGruppo>` (e.g. `Group_03_FakeNews_FdI`).
4. **Condividi → Aggiungi persone** with Editor access to:
   - all group members
   - `fabio.giglietto@uniurb.it`
   - `bruna.almeidaparoni@uniurb.it`
5. They work on the group's copy; the original template stays untouched.

No Apps Script step on the student side — the codebook is already seeded.

## After lez. 16 — reveal subcluster

In each group's Sheet, run `unhideSubcluster()` and `unhideEngagementHelper()` to show the hidden subcluster column in tab 1 and the per-subcluster engagement helper in tab 8. This enables the 2×2 cell analysis for Results §3.3.

## Re-running

`setupRQ1()` / `setupRQ2()` are idempotent: re-running on a configured Sheet only fills missing pieces. Safe to run again if anything looks broken. **Don't run `setupRQ1()` on the RQ2 template or vice versa** — it would overwrite the codebook and the README title with the wrong RQ.

## Troubleshooting

- **"Charts didn't appear"** — the chart insertion is the most fragile part of the API. Run `installCharts_(SpreadsheetApp.getActive())` separately, or insert the 4 bar charts manually from the cell ranges in tab 8 (`A2:A8` × `C2:C8`, `E2:E8`, `G2:G8`, `I2:I8`).
- **"Protection didn't take"** — Sheets needs at least one editor before protection rules apply; share the Sheet with at least one collaborator first, then re-run `installProtections_(SpreadsheetApp.getActive())`.
- **Bigint precision lost on paste** — clear the column, set Format → Number → Plain text, then re-paste.
- **Wrong codebook installed in a template** — manually run `seedCodebookRQ1()` or `seedCodebookRQ2()` to overwrite, then update the `00_README` tab via `buildReadme_(SpreadsheetApp.getActive(), 'RQ1')` (or `'RQ2'`).

## Legacy helpers

`cloneForGroups(N)` is still in the script but **not part of the canonical workflow** (students self-copy now). Use only as a fallback if a group cannot make their own copy.

## Paper template (Google Doc, separate Apps Script)

A second Apps Script — `build_paper_template.gs` — generates the **IMRAD paper template** as a Google Doc, one per RQ. Workflow:

1. Create a fresh Google Doc in the course Drive folder (one for `Internet_Studies_2025-26 — RQ1 Paper Template`, one for RQ2).
2. Extensions → Apps Script → paste `build_paper_template.gs` → save.
3. Run `buildPaperRQ1()` (in the RQ1 Doc) or `buildPaperRQ2()` (in the RQ2 Doc). The Doc body is replaced with the IMRAD skeleton: Frontespizio, Abstract, Introduction, Methods (4 subsections), Results (3 subsections), Discussion, Conclusions, AI Declaration, Bibliography, Appendix A (codebook), Appendix B (decision log). Each section includes Italian "Indicazioni:" guidance blocks. The RQ statement is pre-filled in italic.
4. Share view-only with the class on Moodle.

Students copy + rename + share Editor with `fabio.giglietto@uniurb.it` + `bruna.almeidaparoni@uniurb.it`, exactly like the Sheet templates.

## File locations

- Sheet template builder: `apps_script/build_master_template.gs`
- Doc paper template builder: `apps_script/build_paper_template.gs`
- Master CSV: `data-raw/master_dataset.csv`
- Course Drive folder: `https://drive.google.com/drive/u/1/folders/1ua6alxoGuBMi47uZVaipw91eZ0swuS3s`
