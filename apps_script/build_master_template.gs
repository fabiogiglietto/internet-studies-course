/**
 * Build the per-RQ Google Sheet template for the Internet Studies
 * Block-2 lab (TikTok content analysis project).
 *
 * Two templates exist in the course Drive folder, one per Research Question.
 * Students choose the template that matches their RQ and make a copy.
 *
 * Workflow (instructor, ONCE per template):
 *   1. Create a fresh Google Sheet in the course folder
 *      (1ua6alxoGuBMi47uZVaipw91eZ0swuS3s).
 *   2. Extensions → Apps Script. Paste this whole file. Save.
 *   3. From the function dropdown run **either**:
 *        setupRQ1()  — for the RQ1 template (manipulation tactics)
 *        setupRQ2()  — for the RQ2 template (participation continuum)
 *      Approve permissions on first run. The orchestrator builds all 10 tabs,
 *      seeds the appropriate codebook, and applies all formatting + protections.
 *   4. Run loadMaster() to populate `01_Dataset_master` from the canonical CSV.
 *   5. Share the template view-only with the class via Moodle link.
 *
 * Workflow (per group, one member):
 *   - Open the template that matches the group's chosen RQ.
 *   - File → Make a copy (saves to the student's Drive).
 *   - Rename to `Group_NN_<NomeGruppo>`.
 *   - Share Editor access with all group members + fabio.giglietto@uniurb.it +
 *     bruna.almeidaparoni@uniurb.it.
 *   - Work on the group's own copy; never touch the original template.
 *
 * The script is idempotent: re-running setupRQ1() / setupRQ2() on an already-
 * configured Sheet only fills missing pieces, so the instructor can iterate.
 *
 * Cluster label leakage: hideSubcluster() hides the `subcluster` column.
 * Re-run unhideSubcluster() and unhideEngagementHelper() after lez. 16 to
 * enable 2×2 cell analysis.
 */

// ===== CONFIG =================================================================

const COURSE_FOLDER_ID  = '1ua6alxoGuBMi47uZVaipw91eZ0swuS3s';
const MASTER_CSV_FILE_ID = '1g1sEV1ELPy8ETfEfj_FCvaCg_obL-69y';
const N_CODERS          = 6;
const N_RELIABILITY     = 30;
const N_SAMPLE_PER_GROUP = 120;
const N_MASTER          = 900;

// DISCUI palette
const COLOR_PRIMARY    = '#E06029';
const COLOR_LIGHT      = '#F2A7A0';
const COLOR_BG         = '#F2F2F2';
const COLOR_HEADER_BG  = '#F2A7A0';
const COLOR_TAB_LOCKED = '#C5612E';

const TAB_NAMES = [
  '00_README',
  '01_Dataset_master',
  '02_Campione_gruppo',
  '03_Codebook',
  '04_Codifica_coder1',
  '04_Codifica_coder2',
  '04_Codifica_coder3',
  '04_Codifica_coder4',
  '04_Codifica_coder5',
  '04_Codifica_coder6',
  '05_Sottocampione_affidabilita',
  '06_Kappa',
  '07_Codifica_finale',
  '08_Engagement',
  '09_Log_decisioni'
];

const MASTER_HEADERS = [
  'video_id', 'create_time', 'username', 'video_description', 'voice_to_text',
  'hashtag_names', 'view_count', 'like_count', 'comment_count', 'share_count',
  'video_duration', 'watch_url', 'subcluster'
];

// ===== TOP-LEVEL ORCHESTRATORS ===============================================

/** Build the RQ1 template (manipulation tactics — Marwick & Lewis on TikTok). */
function setupRQ1() { _setupTemplate('RQ1'); }

/** Build the RQ2 template (participation continuum — Jenkins ↔ Marwick & Lewis). */
function setupRQ2() { _setupTemplate('RQ2'); }

function _setupTemplate(rq) {
  if (rq !== 'RQ1' && rq !== 'RQ2') {
    throw new Error("Run setupRQ1() or setupRQ2() from the function dropdown.");
  }
  const ss = SpreadsheetApp.getActive();
  ensureAllTabs_(ss);
  buildReadme_(ss, rq);
  buildDatasetMaster_(ss);
  buildCampione_(ss);
  buildCodebook_(ss);
  for (let i = 1; i <= N_CODERS; i++) buildCoderTab_(ss, i);
  buildSottocampione_(ss);
  buildKappa_(ss);
  buildCodificaFinale_(ss);
  buildEngagement_(ss);
  buildLogDecisioni_(ss);
  installNamedRanges_(ss);
  installValidation_(ss);
  installConditionalFormatting_(ss);
  installProtections_(ss);
  hideSubcluster_(ss);
  // Charts last — they require pivot data. Wrap in try/catch since chart
  // positioning is the most fragile part of the API.
  try { installCharts_(ss); }
  catch (e) { Logger.log('installCharts failed (non-fatal): ' + e); }

  // Seed the appropriate codebook for the chosen RQ
  if (rq === 'RQ1') seedCodebookRQ1();
  else              seedCodebookRQ2();

  // Reorder tabs to canonical order
  TAB_NAMES.forEach((name, idx) => {
    const sh = ss.getSheetByName(name);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(idx + 1); }
  });
  ss.setActiveSheet(ss.getSheetByName('00_README'));
  Logger.log('Template configured for ' + rq);
}

// ===== TAB CREATION ===========================================================

function ensureAllTabs_(ss) {
  TAB_NAMES.forEach(name => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });
  // Remove the default 'Sheet1' / 'Foglio1' if present
  ['Sheet1', 'Foglio1'].forEach(n => {
    const s = ss.getSheetByName(n);
    if (s && TAB_NAMES.indexOf(n) === -1) ss.deleteSheet(s);
  });
}

function setHeaderRow_(sh, headers) {
  const range = sh.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setBackground(COLOR_HEADER_BG)
       .setFontWeight('bold')
       .setFontColor('#000');
  sh.setFrozenRows(1);
}

// ===== TAB BUILDERS ===========================================================

function buildReadme_(ss, rq) {
  const sh = ss.getSheetByName('00_README');
  sh.clear();
  const rqTitle = (rq === 'RQ1')
    ? 'RQ1 — Tattiche di manipolazione mediatica su TikTok'
    : 'RQ2 — Partecipazione genuina vs. strumentalizzata su TikTok';
  const rqDesc = (rq === 'RQ1')
    ? 'Quali tattiche di manipolazione mediatica (astroturfing, source hacking, meme warfare, …) emergono nei video del campione? Codebook ancorato a Marwick & Lewis (2017), adattato alle affordance di TikTok.'
    : 'In che misura i video del campione mostrano cultura partecipativa genuina (Jenkins, 2008) vs. partecipazione strumentalizzata (Marwick & Lewis, 2017)? Codebook a 4 livelli su un continuum.';
  const lines = [
    ['Internet Studies — Block 2 Lab — ' + rqTitle],
    [''],
    [rqDesc],
    [''],
    ['Dataset: ~900 video TikTok in italiano, feb 2026 – apr 2026.'],
    ['Account anonimizzati a livello di cluster nei materiali pubblici.'],
    [''],
    ['🚀 PRIMA DI INIZIARE — UN SOLO MEMBRO DEL GRUPPO'],
    ['  IMPORTANTE: assicuratevi di avere aperto il template della VOSTRA RQ.'],
    ['  Questo template è per: ' + rqTitle],
    [''],
    ['  1. File → Crea una copia. Salvate nella vostra cartella Drive personale o di gruppo.'],
    ['  2. Rinominate la copia in `Group_NN_<NomeGruppo>` (es. `Group_03_FakeNews_FdI`).'],
    ['  3. Condividete (Condividi → Aggiungi persone) con:'],
    ['     • tutti i membri del vostro gruppo (Editor)'],
    ['     • fabio.giglietto@uniurb.it (Editor)'],
    ['     • bruna.almeidaparoni@uniurb.it (Editor)'],
    ['  4. Lavorate sempre sulla VOSTRA copia, mai su questo template originale.'],
    [''],
    ['STRUTTURA DELLE SCHEDE'],
    ['  00_README                     — questa pagina'],
    ['  01_Dataset_master             — corpus completo (sola lettura)'],
    ['  02_Campione_gruppo            — campione N=120 estratto a sorte'],
    ['  03_Codebook                   — categorie e definizioni (modificabile)'],
    ['  04_Codifica_coderN (×6)       — una scheda per codificatore'],
    ['  05_Sottocampione_affidabilita — 30 post comuni per κ'],
    ['  06_Kappa                      — Cohen κ calcolato (sola lettura)'],
    ['  07_Codifica_finale            — codifiche unite (sola lettura)'],
    ['  08_Engagement                 — mediana + IQR per categoria (sola lettura)'],
    ['  09_Log_decisioni              — log dei casi ambigui'],
    [''],
    ['CHECKPOINT'],
    ['  Lez. 13 (30 apr) — campione + codebook'],
    ['  Lez. 15 (6 mag)  — affidabilità (κ ≥ 0.60)'],
    ['  Lez. 17 (12 mag) — risultati principali'],
    ['  Lez. 22 (21 mag) — bozza paper (consegna 22 mag 23:59)'],
    ['  Lez. 24 (27 mag) — presentazione finale'],
    ['  Consegna finale  — 1 giugno 2026, 23:59'],
    [''],
    ['CONVENZIONI COLORI'],
    ['  Sfondo grigio chiaro  — campi protetti / sola lettura'],
    ['  Bianco                — campi modificabili dal codificatore assegnato'],
    ['  Header arancio chiaro — intestazioni di colonna'],
    [''],
    ['⚠ IGIENE DELL\'ACCOUNT TIKTOK — LEGGERE PRIMA DI INIZIARE A CODIFICARE'],
    ['  Per visualizzare i video del dataset NON usate il vostro account TikTok personale.'],
    ['  Aprite ogni `watch_url` in:'],
    ['    (a) un account TikTok dedicato creato apposta per il laboratorio, OPPURE'],
    ['    (b) una finestra di navigazione privata/in incognito senza login.'],
    ['  Motivo: TikTok personalizza la For You Page in base a ciò che guardate.'],
    ['  Centinaia di video di AI-slop religioso, deepfake politici e contenuti'],
    ['  cospirazionisti possono "inquinare" il vostro feed personale per settimane.'],
    ['  Non scorrete il feed; aprite solo i `watch_url` esatti del campione.'],
    [''],
    ['REGOLE'],
    ['  • Non modificare le formule. Se qualcosa sembra rotto, segnalarlo al docente.'],
    ['  • Codifica in cieco: la colonna `subcluster` è nascosta finché non serve per Results §3.3.'],
    ['  • Casi ambigui: sempre annotare in `09_Log_decisioni` (data, video_id, decisione, motivazione).'],
    ['  • Uso di Gemini consentito per discutere casi ambigui, NON per codificare al posto vostro.']
  ];
  sh.getRange(1, 1, lines.length, 1).setValues(lines);
  sh.setColumnWidth(1, 800);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  sh.getRange(8, 1).setFontWeight('bold').setFontColor('#E06029');   // 🚀 PRIMA DI INIZIARE
  sh.getRange(10, 1).setFontStyle('italic');                          // Questo template è per: ...
  sh.getRange(20, 1).setFontWeight('bold');  // STRUTTURA DELLE SCHEDE
  sh.getRange(32, 1).setFontWeight('bold');  // CHECKPOINT
  sh.getRange(40, 1).setFontWeight('bold');  // CONVENZIONI COLORI
  sh.getRange(45, 1).setFontWeight('bold').setFontColor('#C0392B');  // ⚠ IGIENE
  sh.getRange(55, 1).setFontWeight('bold');  // REGOLE
}

function buildDatasetMaster_(ss) {
  const sh = ss.getSheetByName('01_Dataset_master');
  if (sh.getLastRow() === 0) setHeaderRow_(sh, MASTER_HEADERS);
  // Pre-size columns; data goes in via paste or loadMasterFromCSV()
  sh.setColumnWidth(1, 160);  // video_id
  sh.setColumnWidth(2, 130);  // create_time
  sh.setColumnWidth(3, 140);  // username
  sh.setColumnWidth(4, 320);  // video_description
  sh.setColumnWidth(5, 240);  // voice_to_text
  sh.setColumnWidth(6, 240);  // hashtag_names
  for (let c = 7; c <= 11; c++) sh.setColumnWidth(c, 90);
  sh.setColumnWidth(12, 280); // watch_url
  sh.setColumnWidth(13, 130); // subcluster (hidden)
}

function buildCampione_(ss) {
  const sh = ss.getSheetByName('02_Campione_gruppo');
  const headers = MASTER_HEADERS.slice(0, 12).concat(['coder_assegnato']);
  setHeaderRow_(sh, headers);

  // 120 rows of INDEX/RANDBETWEEN drawing from 01_Dataset_master rows 2..N_MASTER+1.
  // Row formula: =INDEX('01_Dataset_master'!$A:$L, RANDBETWEEN(2, N_MASTER+1), col)
  // Using ARRAYFORMULA + RANDARRAY for newer Sheets, but RANDBETWEEN works
  // in both contexts.
  for (let r = 2; r <= N_SAMPLE_PER_GROUP + 1; r++) {
    for (let c = 1; c <= 12; c++) {
      sh.getRange(r, c).setFormula(
        `=IFERROR(INDEX('01_Dataset_master'!$A:$L, $A$${r}_idx, ${c}), "")`
      );
    }
  }
  // Helper column: pick a stable random row index per row, so all 12 cols
  // pull from the same source row. Stored as named range below.
  // Implementation: a hidden helper column N (14) holds RANDBETWEEN values;
  // the 12 INDEX formulas above reference that row's helper.
  // Simpler — replace formulas with a single-column helper:
  // (Workaround given Sheets limitations: rewrite using helper col N.)
  for (let r = 2; r <= N_SAMPLE_PER_GROUP + 1; r++) {
    sh.getRange(r, 14).setFormula(`=RANDBETWEEN(2, ${N_MASTER + 1})`);
    for (let c = 1; c <= 12; c++) {
      sh.getRange(r, c).setFormula(
        `=IFERROR(INDEX('01_Dataset_master'!$A:$L, $N${r}, ${c}), "")`
      );
    }
  }
  // coder_assegnato — round-robin coder1..N_CODERS so 120/6 = 20 each
  for (let r = 2; r <= N_SAMPLE_PER_GROUP + 1; r++) {
    sh.getRange(r, 13).setFormula(`=MOD(ROW()-2, ${N_CODERS}) + 1`);
  }
  // Hide the helper column N
  sh.hideColumns(14);
  sh.setColumnWidth(13, 110);
}

function buildCodebook_(ss) {
  const sh = ss.getSheetByName('03_Codebook');
  setHeaderRow_(sh, [
    'id_categoria', 'nome_categoria', 'definizione_operativa',
    'esempio_positivo (video_id)', 'esempio_negativo (video_id)',
    'regola_decisione_casi_ambigui'
  ]);
  // Seed 4 empty category rows; groups extend up to 7. Run seedCodebookRQ1()
  // or seedCodebookRQ2() to populate with a starter codebook for the chosen RQ.
  for (let r = 2; r <= 5; r++) {
    sh.getRange(r, 1).setValue(`C${r - 1}`);
  }
  sh.setColumnWidth(1, 100);
  sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 360);
  sh.setColumnWidth(4, 180);
  sh.setColumnWidth(5, 180);
  sh.setColumnWidth(6, 320);

  // Footer note
  sh.getRange(10, 1).setValue('Note: 4–7 categorie. Mutue esclusive. Codebook iniziale (seed) installabile via seedCodebookRQ1() o seedCodebookRQ2().')
                    .setFontStyle('italic')
                    .setFontColor('#666');
}

// ===== SEED CODEBOOKS PER RESEARCH QUESTION ==================================
//
// Run ONE of seedCodebookRQ1() / seedCodebookRQ2() AFTER setupTemplate(), based
// on the group's chosen RQ. Each writes 4 starter categories into 03_Codebook
// that the group must (a) refine the operational definitions of, (b) verify the
// example video_ids on (replace with their own group sample's prototypes after
// the lez. 11 pilot), (c) extend up to 7 if needed during the pilot.
//
// The seed exists so non-technical undergrads don't face an empty page; the
// pedagogical work is the refinement + κ validation, not the invention.

const RQ1_CODEBOOK = [
  {
    id: 'C1', name: 'Astroturfing',
    def: 'Contenuto prodotto da una rete coordinata di account o talent ricorrenti che si presenta come informazione "indipendente" o grassroots, ma risponde a un coordinamento editoriale (Marwick & Lewis, 2017). Indizi: stessi volti su account "indipendenti" diversi; cross-promozione; copertura editoriale ricorrente di una linea politica.',
    pos: '7604602878858218774',  // Esperia: "Report attacca Esperia. Errori. Bugie."
    neg: '7628540626581081366',  // @fratelliditalia: orchestrazione esplicita, non camuffata
    rule: 'Se l\'orchestrazione è dichiarata (account ufficiale di partito, brand riconoscibile come testata) NON è astroturfing: l\'astroturfing richiede la facciata di indipendenza. La dimensione della rete (numero di account, talent ricorrente) e l\'esistenza di inchieste giornalistiche pubbliche sono indizi rafforzativi.'
  },
  {
    id: 'C2', name: 'Source hacking via IA generativa',
    def: 'Contenuto che attribuisce parole, azioni o eventi fabbricati a figure pubbliche reali tramite IA generativa (deepfake video, voce clonata, immagine sintetica fotorealistica). Aggiornamento di Marwick & Lewis (2017) "source hacking" al regime di produzione consumer-grade descritto da Boyd (2017).',
    pos: '7598501738257091862',  // @aicontenute: presidente "Milone" in arresto (deepfake fabricated event)
    neg: '7620513913767087382',  // @just.frank.ita: foto reale + caption sarcastica (interpretazione, non fabbricazione)
    rule: 'La differenza chiave è la fabbricazione di un atto/evento dalla fonte stessa (la sua voce, la sua azione visibile). Se l\'identità della fonte è preservata e solo il contesto interpretativo cambia, NON è source hacking. Indizi: errori ortografici per evasione moderazione (es. "Milone" per "Meloni"), incongruenze visive, hashtag sostitutivi (#melone).'
  },
  {
    id: 'C3', name: 'Meme warfare / hacking dell\'economia dell\'attenzione',
    def: 'Produzione coordinata e ad alto volume di contenuti emotivamente ingaggianti, spesso non strettamente politici (religioso, miracolistico, gossip), il cui scopo principale è catturare attenzione algoritmica. Boyd (2017) "hacking the attention economy". Spesso prodotti con IA generativa per abbassare i costi.',
    pos: '7617498040575872278',  // @rosadimvqwa: "#AMEN🙏" — religious AI-slop
    neg: '7607586350518340886',  // @pov49809: "MIRACOLO EUCARISTICO A LEGNICA" — religious but human-produced testimonial
    rule: 'Il marker chiave è la combinazione produzione coordinata + IA + scala industriale + caption templatica. La fede sincera espressa da un account autentico, anche se virale, NON è meme warfare. Se più account postano la stessa caption nelle stesse 24h è quasi sempre meme warfare.'
  },
  {
    id: 'C4', name: 'Partecipazione genuina (categoria di controllo)',
    def: 'Contenuto di creator autonomi senza segnali di coordinazione, IA o amplificazione orchestrata. Espressione politica, civica o culturale individuale nello spirito di Jenkins (2008). Funziona come baseline contro cui confrontare le tre categorie sopra. Importante mantenere questa categoria per evitare di forzare ogni post in una manipolazione.',
    pos: '7622751214412844310',  // @1..enzo: ricondivisione personale di un discorso di Conte
    neg: '7598501738257091862',  // @aicontenute: deepfake fabricated event
    rule: 'Se mancano evidenze di coordinazione, IA o orchestrazione → C4. La presenza di errori, posizioni controverse, o forte partigianeria NON squalifica la genuinità. La voce personale, gli errori ortografici spontanei, il riferimento a un contesto specifico sono indizi positivi.'
  }
];

const RQ2_CODEBOOK = [
  {
    id: 'P1', name: 'Partecipazione genuina pura',
    def: 'Contenuto bottom-up di un creator individuale, senza alcun segnale di coordinazione o orchestrazione. Linguaggio personale, contesto specifico, errori ortografici spontanei. Cultura partecipativa nel senso di Jenkins (2008) nello stato puro: l\'utente è l\'autore, l\'editore e il distributore.',
    pos: '7622751214412844310',  // @1..enzo: ricondivisione personale, stilemi minimi
    neg: '7617498040575872278',  // @rosadimvqwa: "#AMEN🙏" — caption templatica condivisa con altri account
    rule: 'Più voce personale, meno produzione = più genuino. Se la stessa caption appare su più account in <60 minuti, NON è P1. Se il volto è IA-generato, NON è P1. Se l\'account è user########### con default-handle, sospettare P4.'
  },
  {
    id: 'P2', name: 'Partecipazione genuina mediata da affordance',
    def: 'Creator individuale che esprime una posizione personale ma usa template virali, hashtag-spam, formati ottimizzati per l\'algoritmo (greenscreen, duet, sound trends). La motivazione è personale ma l\'esecuzione è già platform-shaped. Boyd (2018) sull\'affordance di TikTok come ambiente di partecipazione strutturato.',
    pos: '7620513913767087382',  // @just.frank.ita: post green-screen su politica
    neg: '7628540626581081366',  // @fratelliditalia: account ufficiale di partito (orchestrazione)
    rule: 'Se la persona dietro lo schermo è chiaramente un individuo che esprime una sua posizione, ma usa il vocabolario dell\'algoritmo (formato virale, hashtag-spam, sound popolare) → P2. La differenza con P1 è quanta della forma è importata dall\'ambiente algoritmico.'
  },
  {
    id: 'P3', name: 'Partecipazione orchestrata morbida',
    def: 'Talent reali che partecipano in una linea editoriale altrui, in modo riconoscibile (intervista in studio, brand visibile, format ricorrente). Persone reali, opinioni reali, ma orchestrate da un editore che le pubblica come "informazione indipendente". Astroturfing di basso livello (Marwick & Lewis, 2017): l\'inautenticità è nella produzione collettiva, non nelle singole voci.',
    pos: '7604602878858218774',  // Esperia: video editoriale con setting riconoscibile
    neg: '7622751214412844310',  // @1..enzo: account personale senza editore intermediario
    rule: 'La presenza di un editore intermediario che presenta il contenuto come "informazione indipendente" è la chiave. Se chi parla parla a nome proprio dal suo account, NON è P3 (anche se è un politico noto). Se appare in un setting brandizzato di una "testata indipendente" coperta da inchieste come parte di una rete coordinata → P3.'
  },
  {
    id: 'P4', name: 'Partecipazione strumentalizzata',
    def: 'Contenuto che simula partecipazione mentre è completamente prodotto da un\'orchestrazione: bot, sockpuppet, IA generativa, captions identiche su più account in tempi stretti. Marwick & Lewis (2017) astroturfing pieno + Boyd (2017) democratizzazione della manipolazione. Nessuna persona reale è "dietro" la voce/immagine/messaggio.',
    pos: '7617498040575872278',  // @rosadimvqwa: account default-handle, IA-religious
    neg: '7604602878858218774',  // Esperia: orchestrato ma persone reali parlano con parole loro
    rule: 'Se nessuna persona reale è dietro la voce/immagine/messaggio (o la persona reale è solo un avatar di un\'operazione collettiva), → P4. Marker: handle default user########, contenuto IA-generato, captions condivise con account-fratelli, account creato di recente con alto volume.'
  }
];

function _writeCodebookRows(rqLabel, rows) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName('03_Codebook');
  // Clear data rows 2..20 (preserve header + footer note)
  sh.getRange(2, 1, 19, 6).clearContent();
  rows.forEach((r, i) => {
    sh.getRange(2 + i, 1, 1, 6).setValues([[
      r.id, r.name, r.def, r.pos, r.neg, r.rule
    ]]);
  });
  // Wrap text in definition / rule columns for readability
  sh.getRange(2, 3, rows.length, 1).setWrap(true);
  sh.getRange(2, 6, rows.length, 1).setWrap(true);
  sh.setRowHeights(2, rows.length, 110);
  // Update footer note to reflect chosen RQ
  sh.getRange(2 + rows.length + 4, 1).setValue(
    `Codebook iniziale (seed): ${rqLabel}. Da raffinare nel pilot di lez. 11; bloccare al checkpoint 1 (lez. 13).`
  ).setFontStyle('italic').setFontColor('#666');
  Logger.log('Seeded ' + rqLabel + ' codebook (' + rows.length + ' categorie).');
}

function seedCodebookRQ1() {
  _writeCodebookRows('RQ1 — tattiche di manipolazione mediatica (Marwick & Lewis 2017 adattate a TikTok)', RQ1_CODEBOOK);
}

function seedCodebookRQ2() {
  _writeCodebookRows('RQ2 — continuum partecipazione (Jenkins 2008) ↔ strumentalizzazione (Marwick & Lewis 2017)', RQ2_CODEBOOK);
}

function buildCoderTab_(ss, n) {
  const tabName = `04_Codifica_coder${n}`;
  const sh = ss.getSheetByName(tabName);
  setHeaderRow_(sh, [
    'video_id', 'watch_url', 'video_description',
    'categoria_assegnata', 'confidenza (1-5)', 'note', 'tempo_codifica_min'
  ]);
  // Pre-populate from 02_Campione_gruppo via FILTER on coder_assegnato == n
  const filterFormula =
    `=IFERROR(FILTER({'02_Campione_gruppo'!A2:A, '02_Campione_gruppo'!L2:L, '02_Campione_gruppo'!D2:D}, '02_Campione_gruppo'!M2:M=${n}), "")`;
  sh.getRange(2, 1).setFormula(filterFormula);
  // Columns 4–7 are coder input (white background); rows 2.. are dynamic
  sh.setColumnWidth(1, 160);
  sh.setColumnWidth(2, 280);
  sh.setColumnWidth(3, 320);
  sh.setColumnWidth(4, 200);
  sh.setColumnWidth(5, 110);
  sh.setColumnWidth(6, 240);
  sh.setColumnWidth(7, 110);
}

function buildSottocampione_(ss) {
  const sh = ss.getSheetByName('05_Sottocampione_affidabilita');
  const headers = ['video_id', 'watch_url', 'video_description'];
  for (let i = 1; i <= N_CODERS; i++) headers.push(`cod_coder${i}`);
  setHeaderRow_(sh, headers);
  // Pre-populate: top 30 rows of 02_Campione_gruppo
  for (let r = 2; r <= N_RELIABILITY + 1; r++) {
    sh.getRange(r, 1).setFormula(`=IFERROR('02_Campione_gruppo'!A${r}, "")`);
    sh.getRange(r, 2).setFormula(`=IFERROR('02_Campione_gruppo'!L${r}, "")`);
    sh.getRange(r, 3).setFormula(`=IFERROR('02_Campione_gruppo'!D${r}, "")`);
  }
  sh.setColumnWidth(1, 160);
  sh.setColumnWidth(2, 280);
  sh.setColumnWidth(3, 320);
  for (let i = 0; i < N_CODERS; i++) sh.setColumnWidth(4 + i, 150);
}

function buildKappa_(ss) {
  const sh = ss.getSheetByName('06_Kappa');
  sh.clear();
  setHeaderRow_(sh, ['Coppia coder', 'Po', 'Pe', 'Cohen κ', 'Interpretazione']);

  const subRange = `'05_Sottocampione_affidabilita'`;
  let row = 2;
  for (let i = 1; i <= N_CODERS; i++) {
    for (let j = i + 1; j <= N_CODERS; j++) {
      const colA = String.fromCharCode(64 + 3 + i);  // D, E, F, G, H, I
      const colB = String.fromCharCode(64 + 3 + j);
      sh.getRange(row, 1).setValue(`coder${i} vs coder${j}`);
      // Po = SUMPRODUCT((A=B)*(A<>"")) / COUNTA(A) — both filled and equal
      sh.getRange(row, 2).setFormula(
        `=IFERROR(SUMPRODUCT((${subRange}!${colA}2:${colA}${N_RELIABILITY + 1}=${subRange}!${colB}2:${colB}${N_RELIABILITY + 1})*(${subRange}!${colA}2:${colA}${N_RELIABILITY + 1}<>"")*(${subRange}!${colB}2:${colB}${N_RELIABILITY + 1}<>"")) / COUNTIFS(${subRange}!${colA}2:${colA}${N_RELIABILITY + 1},"<>",${subRange}!${colB}2:${colB}${N_RELIABILITY + 1},"<>"), "")`
      );
      // Pe = sum over categories k of (P(A=k) * P(B=k))
      // SUMPRODUCT trick using lista_categorie:
      sh.getRange(row, 3).setFormula(
        `=IFERROR(SUMPRODUCT(((COUNTIF(${subRange}!${colA}2:${colA}${N_RELIABILITY + 1}, lista_categorie) / COUNTA(${subRange}!${colA}2:${colA}${N_RELIABILITY + 1}))) * ((COUNTIF(${subRange}!${colB}2:${colB}${N_RELIABILITY + 1}, lista_categorie) / COUNTA(${subRange}!${colB}2:${colB}${N_RELIABILITY + 1})))), "")`
      );
      // Kappa
      sh.getRange(row, 4).setFormula(`=IFERROR((B${row}-C${row})/(1-C${row}), "")`);
      // Interpretation
      sh.getRange(row, 5).setFormula(
        `=IFS(D${row}="", "—", D${row}<0.4, "Insufficiente — rivedere codebook", D${row}<0.6, "Marginale — discutere", D${row}<0.8, "Accettabile", TRUE, "Buono")`
      );
      row++;
    }
  }
  // Group mean κ
  sh.getRange(row, 1).setValue('Media gruppo κ').setFontWeight('bold');
  sh.getRange(row, 4).setFormula(`=IFERROR(AVERAGE(D2:D${row - 1}), "")`).setFontWeight('bold');
  sh.getRange(row, 5).setFormula(
    `=IFS(D${row}="", "—", D${row}<0.4, "Insufficiente", D${row}<0.6, "Marginale", D${row}<0.8, "Accettabile", TRUE, "Buono")`
  );

  sh.setColumnWidth(1, 180);
  for (let c = 2; c <= 4; c++) sh.setColumnWidth(c, 110);
  sh.setColumnWidth(5, 280);
}

function buildCodificaFinale_(ss) {
  const sh = ss.getSheetByName('07_Codifica_finale');
  setHeaderRow_(sh, [
    'video_id', 'coder', 'categoria_assegnata', 'confidenza', 'note',
    'view_count', 'like_count', 'comment_count', 'share_count'
  ]);
  // VSTACK over all 6 coder tabs
  const stack = [];
  for (let i = 1; i <= N_CODERS; i++) {
    stack.push(`{'04_Codifica_coder${i}'!A2:A, ARRAYFORMULA(IF('04_Codifica_coder${i}'!A2:A<>"", "coder${i}", "")), '04_Codifica_coder${i}'!D2:F}`);
  }
  // Use VSTACK; drop empty rows via FILTER
  sh.getRange(2, 1).setFormula(
    `=ARRAYFORMULA(IFERROR(QUERY(VSTACK(${stack.join(',')}), "select * where Col1 is not null", 0), ""))`
  );
  // Engagement VLOOKUP from 01_Dataset_master
  for (let col = 6; col <= 9; col++) {
    const masterCol = col + 1;  // F=view_count(7), G=like(8), H=comment(9), I=share(10)
    sh.getRange(2, col).setFormula(
      `=ARRAYFORMULA(IFERROR(VLOOKUP(A2:A, '01_Dataset_master'!$A:$L, ${masterCol}, FALSE), ""))`
    );
  }
  for (let c = 1; c <= 9; c++) sh.setColumnWidth(c, 130);
}

function buildEngagement_(ss) {
  const sh = ss.getSheetByName('08_Engagement');
  sh.clear();
  setHeaderRow_(sh, [
    'categoria', 'N',
    'mediana visualizzazioni', 'IQR visualizzazioni',
    'mediana like', 'IQR like',
    'mediana commenti', 'IQR commenti',
    'mediana condivisioni', 'IQR condivisioni'
  ]);
  // For each category in lista_categorie, compute median + IQR over 07_Codifica_finale
  // We render as a static block at top, fed by a QUERY/SUMPRODUCT pattern.
  for (let r = 2; r <= 8; r++) {
    const cIdx = r - 1;
    sh.getRange(r, 1).setFormula(`=IFERROR(INDEX(lista_categorie, ${cIdx}), "")`);
    sh.getRange(r, 2).setFormula(`=IF(A${r}="", "", COUNTIF('07_Codifica_finale'!C:C, A${r}))`);
    // mediana_X = MEDIAN of '07_Codifica_finale'!metric col where category matches
    const metricCols = { 3: 'F', 5: 'G', 7: 'H', 9: 'I' };
    Object.keys(metricCols).forEach(targetColStr => {
      const targetCol = parseInt(targetColStr, 10);
      const srcCol = metricCols[targetColStr];
      sh.getRange(r, targetCol).setFormula(
        `=IF(A${r}="", "", IFERROR(MEDIAN(IF('07_Codifica_finale'!C:C=A${r}, '07_Codifica_finale'!${srcCol}:${srcCol}, "")), ""))`
      );
      sh.getRange(r, targetCol + 1).setFormula(
        `=IF(A${r}="", "", IFERROR(QUARTILE(IF('07_Codifica_finale'!C:C=A${r}, '07_Codifica_finale'!${srcCol}:${srcCol}, ""), 3) - QUARTILE(IF('07_Codifica_finale'!C:C=A${r}, '07_Codifica_finale'!${srcCol}:${srcCol}, ""), 1), ""))`
      );
    });
  }
  for (let c = 1; c <= 10; c++) sh.setColumnWidth(c, 130);

  // Hidden helper section: median/IQR per subcluster for the C1-C4 reveal
  // (Instructor un-hides after lez. 16.)
  sh.getRange(15, 1).setValue('— Sezione di supporto: per cluster di provenienza (rivelata dopo lez. 16) —')
                    .setFontStyle('italic').setFontColor('#999');
  sh.getRange(16, 1, 1, 11).setValues([[
    'codice', 'cluster di provenienza', 'N',
    'mediana visualizzazioni', 'IQR visualizzazioni',
    'mediana like', 'IQR like',
    'mediana commenti', 'IQR commenti',
    'mediana condivisioni', 'IQR condivisioni'
  ]]).setFontWeight('bold');
  // Technical code (col A, kept for COUNTIF matching with the metadata column)
  // + Italian gloss (col B, what students read).
  const subclusters = [
    { code: 'organic',           label: 'Contenuto organico (creator autentici)' },
    { code: 'astroturfed_human', label: 'Astroturfing umano (rete coordinata di account tematici)' },
    { code: 'ai_political',      label: 'Contenuto politico generato con IA' },
    { code: 'ai_religious',      label: 'Contenuto religioso generato con IA (#amen 🙏)' }
  ];
  subclusters.forEach((sub, idx) => {
    const r = 17 + idx;
    sh.getRange(r, 1).setValue(sub.code);
    sh.getRange(r, 2).setValue(sub.label);
    sh.getRange(r, 3).setFormula(`=COUNTIF('01_Dataset_master'!M:M, A${r})`);
    const metricCols = { 4: 'G', 6: 'H', 8: 'I', 10: 'J' };
    Object.keys(metricCols).forEach(targetColStr => {
      const targetCol = parseInt(targetColStr, 10);
      const srcCol = metricCols[targetColStr];
      sh.getRange(r, targetCol).setFormula(
        `=IFERROR(MEDIAN(IF('01_Dataset_master'!M:M=A${r}, '01_Dataset_master'!${srcCol}:${srcCol}, "")), "")`
      );
      sh.getRange(r, targetCol + 1).setFormula(
        `=IFERROR(QUARTILE(IF('01_Dataset_master'!M:M=A${r}, '01_Dataset_master'!${srcCol}:${srcCol}, ""), 3) - QUARTILE(IF('01_Dataset_master'!M:M=A${r}, '01_Dataset_master'!${srcCol}:${srcCol}, ""), 1), "")`
      );
    });
  });
  // De-emphasize the technical `codice` column visually (small + gray) but
  // don't hide it (column A is shared with the upper category section).
  sh.getRange(17, 1, subclusters.length, 1).setFontColor('#999').setFontSize(8);
  sh.hideRows(15, 6);  // hide helper rows initially
}

function unhideEngagementHelper() {
  const sh = SpreadsheetApp.getActive().getSheetByName('08_Engagement');
  sh.showRows(15, 6);
}

function buildLogDecisioni_(ss) {
  const sh = ss.getSheetByName('09_Log_decisioni');
  setHeaderRow_(sh, ['data', 'video_id', 'coder', 'caso', 'decisione', 'motivazione']);
  for (let c = 1; c <= 6; c++) sh.setColumnWidth(c, c === 4 || c === 6 ? 320 : 140);
}

// ===== NAMED RANGES, VALIDATION, FORMATTING, PROTECTIONS =====================

function installNamedRanges_(ss) {
  // Drop any existing ones with the same name (idempotent)
  ss.getNamedRanges().forEach(nr => {
    if (['lista_categorie', 'pool_subcampione'].indexOf(nr.getName()) !== -1) {
      nr.remove();
    }
  });
  ss.setNamedRange('lista_categorie',
                   ss.getSheetByName('03_Codebook').getRange('B2:B20'));
  ss.setNamedRange('pool_subcampione',
                   ss.getSheetByName('05_Sottocampione_affidabilita').getRange(`A2:A${N_RELIABILITY + 1}`));
}

function installValidation_(ss) {
  const listaRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getRangeByName('lista_categorie'), true)
    .setAllowInvalid(false).build();
  const confRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['1','2','3','4','5'], true)
    .setAllowInvalid(false).build();

  for (let i = 1; i <= N_CODERS; i++) {
    const sh = ss.getSheetByName(`04_Codifica_coder${i}`);
    sh.getRange(`D2:D${N_SAMPLE_PER_GROUP / N_CODERS + 1}`).setDataValidation(listaRule);
    sh.getRange(`E2:E${N_SAMPLE_PER_GROUP / N_CODERS + 1}`).setDataValidation(confRule);
    // Reliability column on tab 5
    const sub = ss.getSheetByName('05_Sottocampione_affidabilita');
    const col = 4 + (i - 1);
    sub.getRange(2, col, N_RELIABILITY, 1).setDataValidation(listaRule);
  }
}

function installConditionalFormatting_(ss) {
  // 06_Kappa: red < 0.40, yellow 0.40–0.60, pale green 0.60–0.80, green ≥ 0.80
  const kappa = ss.getSheetByName('06_Kappa');
  const kRange = kappa.getRange('D2:D30');
  const rules = kappa.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.40).setBackground('#F4CCCC').setRanges([kRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.40, 0.5999).setBackground('#FFF2CC').setRanges([kRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.60, 0.7999).setBackground('#D9EAD3').setRanges([kRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.80).setBackground('#B6D7A8').setRanges([kRange]).build());
  kappa.setConditionalFormatRules(rules);

  // 03_Codebook: flag duplicate category names
  const cb = ss.getSheetByName('03_Codebook');
  const dupRange = cb.getRange('B2:B20');
  const cbRules = cb.getConditionalFormatRules();
  cbRules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(B2<>"", COUNTIF($B$2:$B$20, B2)>1)')
    .setBackground('#F4CCCC')
    .setRanges([dupRange]).build());
  cb.setConditionalFormatRules(cbRules);
}

function installProtections_(ss) {
  // Read-only tabs (entire sheet protected; only owner can edit)
  ['00_README', '01_Dataset_master', '06_Kappa', '07_Codifica_finale', '08_Engagement']
    .forEach(name => {
      const sh = ss.getSheetByName(name);
      // Remove existing protections for idempotency
      sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove());
      const p = sh.protect().setDescription(`Protected: ${name}`);
      p.removeEditors(p.getEditors());
      if (p.canDomainEdit()) p.setDomainEdit(false);
    });
}

function hideSubcluster_(ss) {
  const sh = ss.getSheetByName('01_Dataset_master');
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const idx = headers.indexOf('subcluster');
  if (idx >= 0) sh.hideColumns(idx + 1);
}

function unhideSubcluster() {
  const sh = SpreadsheetApp.getActive().getSheetByName('01_Dataset_master');
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const idx = headers.indexOf('subcluster');
  if (idx >= 0) sh.showColumns(idx + 1);
}

// ===== CHARTS =================================================================

function installCharts_(ss) {
  const sh = ss.getSheetByName('08_Engagement');
  // Remove existing charts (idempotent)
  sh.getCharts().forEach(c => sh.removeChart(c));
  const metrics = [
    { col: 3, title: 'Mediana visualizzazioni per categoria' },
    { col: 5, title: 'Mediana like per categoria' },
    { col: 7, title: 'Mediana commenti per categoria' },
    { col: 9, title: 'Mediana condivisioni per categoria' }
  ];
  metrics.forEach((m, i) => {
    const chart = sh.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sh.getRange(2, 1, 7, 1))   // category labels
      .addRange(sh.getRange(2, m.col, 7, 1)) // metric values
      .setOption('title', m.title)
      .setPosition(2 + i * 18, 12, 0, 0)
      .build();
    sh.insertChart(chart);
  });
}

// ===== CSV LOAD HELPER ========================================================

/**
 * No-arg wrapper around loadMasterFromCSV() — runnable directly from the
 * Apps Script "Run" dropdown. Uses the canonical course CSV file ID.
 */
function loadMaster() {
  loadMasterFromCSV(MASTER_CSV_FILE_ID);
}

function loadMasterFromCSV(fileId) {
  const file = DriveApp.getFileById(fileId);
  const csv = file.getBlob().getDataAsString();
  const data = Utilities.parseCsv(csv);
  const sh = SpreadsheetApp.getActive().getSheetByName('01_Dataset_master');
  sh.clear();
  setHeaderRow_(sh, data[0]);
  if (data.length > 1) {
    sh.getRange(2, 1, data.length - 1, data[0].length).setValues(data.slice(1));
  }
  // Format video_id as text to avoid bigint precision loss
  sh.getRange(2, 1, Math.max(1, data.length - 1), 1).setNumberFormat('@');
  hideSubcluster_(SpreadsheetApp.getActive());
  Logger.log('Loaded ' + (data.length - 1) + ' rows into 01_Dataset_master');
}

// ===== GROUP CLONING ==========================================================

function cloneForGroups(n) {
  const folder = DriveApp.getFolderById(COURSE_FOLDER_ID);
  const ss = SpreadsheetApp.getActive();
  const templateFile = DriveApp.getFileById(ss.getId());
  const created = [];
  for (let i = 1; i <= n; i++) {
    const name = `Group_${('0' + i).slice(-2)}`;
    const copy = templateFile.makeCopy(name, folder);
    created.push(copy.getUrl());
  }
  Logger.log('Created ' + created.length + ' group copies in folder ' + folder.getName());
  return created;
}
