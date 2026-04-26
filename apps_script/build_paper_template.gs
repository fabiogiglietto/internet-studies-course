/**
 * Build the per-RQ Google Doc paper template for the Internet Studies
 * Block-2 lab (TikTok content analysis project).
 *
 * Two paper templates exist in the course Drive folder, one per Research
 * Question. Students choose the template matching their RQ and copy it.
 *
 * Workflow (instructor, ONCE per template):
 *   1. Create a fresh Google Doc in the course folder
 *      (1ua6alxoGuBMi47uZVaipw91eZ0swuS3s).
 *   2. Extensions → Apps Script. Paste this whole file. Save.
 *   3. From the function dropdown run **either**:
 *        buildPaperRQ1()  — RQ1 paper template (manipulation tactics)
 *        buildPaperRQ2()  — RQ2 paper template (participation continuum)
 *      Approve permissions on first run. The script populates the Doc with
 *      the IMRAD skeleton, indications-blocks, and references.
 *   4. Share the Doc view-only with the class via Moodle link.
 *
 * Workflow (per group, one member):
 *   - Open the paper template that matches the group's chosen RQ.
 *   - File → Make a copy (saves to the student's Drive).
 *   - Rename to `Group_NN_<NomeGruppo>_paper`.
 *   - Share Editor access with all group members + fabio.giglietto@uniurb.it +
 *     bruna.almeidaparoni@uniurb.it.
 *
 * The script is idempotent: re-running clears the Doc body and rewrites it.
 */

// ===== TOP-LEVEL ORCHESTRATORS ===============================================

/** Build the RQ1 paper template (manipulation tactics — Marwick & Lewis on TikTok). */
function buildPaperRQ1() { _buildPaper('RQ1'); }

/** Build the RQ2 paper template (participation continuum — Jenkins ↔ Marwick & Lewis). */
function buildPaperRQ2() { _buildPaper('RQ2'); }

function _buildPaper(rq) {
  if (rq !== 'RQ1' && rq !== 'RQ2') {
    throw new Error("Use buildPaperRQ1() or buildPaperRQ2() from the dropdown.");
  }
  const doc  = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();

  // ===== Header banner =====
  const rqTitle = (rq === 'RQ1')
    ? 'RQ1 — Tattiche di manipolazione mediatica su TikTok'
    : 'RQ2 — Partecipazione genuina vs. strumentalizzata su TikTok';
  const rqStatement = (rq === 'RQ1')
    ? '*Quali tattiche di manipolazione mediatica (Marwick & Lewis 2017, adattate alle affordance di TikTok) sono riconoscibili nei video del campione, e come si distribuiscono nel corpus? Quali pattern di engagement caratterizzano ciascuna tattica?*'
    : '*In che misura i video del campione mostrano cultura partecipativa genuina (Jenkins 2008) rispetto a partecipazione strumentalizzata (Marwick & Lewis 2017)? Su quale parte del continuum si concentra il corpus, e con quali pattern di engagement?*';

  H1(body, 'Template del saggio IMRAD — ' + rqTitle);

  P(body, 'Internet Studies — A.A. 2025/2026 — Università di Urbino Carlo Bo (DISCUI)').setItalic(true);

  // ===== START-HERE block =====
  H2(body, '🚀 PRIMA DI INIZIARE — UN SOLO MEMBRO DEL GRUPPO').setForegroundColor('#E06029');
  P(body, 'IMPORTANTE: assicuratevi di avere aperto il template della VOSTRA RQ. Questo template è per: ' + rqTitle).setBold(true);
  body.appendListItem('File → Crea una copia. Salvate nella vostra cartella Drive personale o di gruppo.');
  body.appendListItem('Rinominate la copia in `Group_NN_<NomeGruppo>_paper` (es. `Group_03_FakeNews_FdI_paper`).');
  body.appendListItem('Condividi → Aggiungi persone con accesso Editor a:');
  body.appendListItem('  • tutti i membri del vostro gruppo').setNestingLevel(1);
  body.appendListItem('  • fabio.giglietto@uniurb.it').setNestingLevel(1);
  body.appendListItem('  • bruna.almeidaparoni@uniurb.it').setNestingLevel(1);
  body.appendListItem('Lavorate sempre sulla VOSTRA copia, mai su questo template originale.');
  P(body, '');

  P(body, '📌 Come si usa questo template').setBold(true);
  P(body, 'Compilate ogni sezione seguendo le indicazioni in corsivo (sfondo grigio chiaro), mantenendo i titoli e l\'ordine. Cancellate i blocchi "Indicazioni:" solo quando avete compilato la sezione corrispondente.');
  body.appendListItem('Lunghezza totale: 4.000–6.000 parole (escluse Bibliografia e Appendici).');
  body.appendListItem('Stile: italiano accademico; APA 7 per le citazioni; un\'idea per paragrafo.');
  body.appendListItem('Dataset: post TikTok raccolti via TikTok Research API, condivisi nel Foglio Google del gruppo.');
  body.appendListItem('Scadenza: lunedì 1 giugno 2026, ore 23:59.');
  P(body, '');

  // ===== Frontespizio =====
  H1(body, 'Frontespizio');
  body.appendListItem('Titolo del saggio: [titolo specifico — non "Progetto di gruppo IS"]');
  body.appendListItem('Gruppo n°: [N]');
  body.appendListItem('Membri: [Nome Cognome 1; Nome Cognome 2; ...]');
  body.appendListItem('Domanda di ricerca: ' + rqTitle);
  body.appendListItem('Corso: Internet Studies — A.A. 2025/2026');
  body.appendListItem('Docente: Fabio Giglietto');
  body.appendListItem('Data di consegna: [gg/mm/2026]');
  P(body, '');

  // ===== Abstract =====
  H1(body, 'Abstract (150–200 parole)');
  IND(body, 'Scrivete l\'Abstract per ULTIMO, dopo aver finito tutte le altre sezioni. Quattro frasi: (1) Obiettivo: quale fenomeno indagate, su quale piattaforma, con quale RQ. (2) Dataset e metodo: dataset TikTok (N post), codifica manuale di [N] categorie da [M] codificatori, affidabilità misurata con κ di Cohen. (3) Risultati principali: 1–2 pattern empirici (numeri concreti). (4) Conclusione sintetica: cosa ci dice questo del fenomeno indagato, in una frase.');
  P(body, '[Testo dell\'Abstract]');
  P(body, 'Parole chiave: [3–5 termini, separati da virgola]').setBold(true);

  // ===== Introduction =====
  H1(body, '1. Introduction (~800–1.200 parole)');
  IND(body, 'Struttura a IMBUTO. Quattro movimenti, in ordine: (1) Fenomeno generale — TikTok come piattaforma + il fenomeno specifico (1–2 paragrafi). (2) Rilevanza — perché ha senso studiarlo (1 paragrafo). (3) Quadro teorico — tessete insieme i 5 testi del corso (boyd 2018 affordance; Jenkins 2008 cultura partecipativa; Shirky 2009 costi di coordinamento; Marwick & Lewis 2017 tattiche; boyd 2017 economia dell\'attenzione). Mostrate come si parlano, non elencateli (2–3 paragrafi). (4) Domanda di ricerca — emerge logicamente dal punto 3, formulata esplicitamente in corsivo, anticipando in 2–3 righe il metodo.');
  P(body, '[Testo dell\'Introduction]');
  P(body, 'Domanda di ricerca: ' + rqStatement).setItalic(true);

  // ===== Methods =====
  H1(body, '2. Methods (~800–1.200 parole)');

  H2(body, '2.1 Dataset');
  IND(body, 'Descrivete la fonte in modo REPLICABILE. Includete: Origine (TikTok Research API, raccolta a cura del docente); Query (termini, hashtag, account-list — vedi sezione "Methods snippet" condivisa); Periodo: 1 febbraio 2026 – 23 aprile 2026 (con un caso seed del 23 gennaio 2026); N≈900 post; Campi disponibili: video_id, create_time, username, video_description, voice_to_text, hashtag_names, view_count, like_count, comment_count, share_count, video_duration, watch_url; Campi NON disponibili: testo dei singoli commenti, impressioni FYP, dati socio-demografici. Procedura di visualizzazione: i video sono stati visionati tramite un account TikTok dedicato (o navigazione privata) per evitare contaminazione del feed personale.');
  P(body, '[Testo del paragrafo Dataset]');

  H2(body, '2.2 Codebook');
  IND(body, 'Presentate sinteticamente le 4–7 categorie. Una riga per categoria con definizione operativa. Il codebook completo va in Appendice A. Spiegate come avete sviluppato il codebook: punto di partenza (' + (rq === 'RQ1' ? 'tassonomia di Marwick & Lewis 2017 adattata a TikTok' : 'continuum partecipazione genuina ↔ strumentalizzata') + '), seed iniziale fornito nel Foglio, modifiche dopo il pilot di lez. 11. Citate eventuali usi di Gemini per draftare definizioni o discutere casi ambigui (poi ripreso nella Dichiarazione d\'uso dell\'IA).');
  // Codebook table
  const cbTable = body.appendTable([
    ['Categoria', 'Definizione sintetica'],
    ['[cat_1]', '[definizione]'],
    ['[cat_2]', '[definizione]'],
    ['[cat_3]', '[definizione]'],
    ['[cat_4]', '[definizione]']
  ]);
  cbTable.getRow(0).editAsText().setBold(true);

  H2(body, '2.3 Procedura di codifica');
  IND(body, 'Includete: Campione (N=120 post estratti dal corpus iniziale via RANDBETWEEN, poi congelato al checkpoint 1); Allocazione (ciascun codificatore ~20 post; sotto-campione comune di 30 post codificato da TUTTI i membri per il calcolo dell\'affidabilità); Strumento (Foglio Google del gruppo — tab 04_Codifica_coderN, dropdown vincolato alle categorie del codebook); Casi ambigui (registrati nel tab 09_Log_decisioni; discussi a fine sessione).');
  P(body, '[Testo della Procedura]');

  H2(body, '2.4 Affidabilità inter-codificatore');
  IND(body, 'Includete: Metrica (κ di Cohen, calcolato dal tab 06_Kappa); Soglia (κ > 0.60 accettabile; κ > 0.80 buono); Risultato (valore complessivo + valori per coppia di codificatori — dettagli numerici nei Results §3.2); Azioni correttive (se per qualche categoria κ era basso, descrivete la ricodifica e il nuovo valore).');
  P(body, '[Testo dell\'Affidabilità]');

  // ===== Results =====
  H1(body, '3. Results (~1.000–1.500 parole)');
  IND(body, 'I Results DESCRIVONO, non interpretano. Niente "perché", niente "questo dimostra che" — quelli vanno in Discussion. Ogni tabella e ogni grafico va INTRODOTTO nel testo prima di essere mostrato, e COMMENTATO dopo.');

  H2(body, '3.1 Distribuzione delle categorie');
  IND(body, 'Tabella di frequenze (N e %). Commento di 1–2 paragrafi: quale categoria prevale? Quale è marginale?');
  P(body, '[Tabella + testo]');

  H2(body, '3.2 Affidabilità');
  IND(body, 'Tabella con κ complessivo e κ per categoria (o per coppia di codificatori). 1 paragrafo che descrive dove l\'accordo è alto e dove è basso, citando la matrice di confusione del tab 06_Kappa se utile.');
  P(body, '[Tabella + testo]');

  H2(body, '3.3 Pattern di engagement per categoria');
  IND(body, 'Tabella con MEDIANA (non media — le distribuzioni di engagement sono fortemente asimmetriche) e IQR per le quattro metriche TikTok: view_count, like_count, comment_count, share_count. Almeno UN grafico (a barre o box plot) generato dal tab 08_Engagement. Commento di 2–3 paragrafi sui pattern principali. NOTA: dopo lez. 16 il docente sblocca il blocco "subcluster" del tab 08_Engagement; usate quel blocco per discutere come l\'engagement varia per cluster di provenienza, non solo per categoria di codifica.');
  P(body, '[Tabella + grafico + testo]');

  // ===== Discussion =====
  H1(body, '4. Discussion (~800–1.200 parole)');
  IND(body, 'Cinque momenti, in ordine: (1) Sintesi dei risultati principali alla luce della RQ — 1 paragrafo. (2) Collegamento ai 5 testi del corso — i risultati confermano, complicano o contraddicono boyd 2018, Jenkins, Shirky, Marwick & Lewis, boyd 2017? — 2–3 paragrafi. (3) Riflessione metodologica — cosa ha funzionato, cosa è stato difficile, cosa avete imparato dal processo di codifica — 1 paragrafo. (4) Limiti dello studio — onesti ma non auto-svalutanti: campione tematicamente vincolato dalla query; periodo febbraio-aprile 2026; assenza di testo dei commenti; nessun dato sull\'esposizione FYP; soggettività residua nonostante κ > 0.60 — 1 paragrafo. (5) Implicazioni — cosa significano i risultati per la comprensione della manipolazione/partecipazione su TikTok? Aperture per ricerche future — 1 paragrafo.');
  P(body, '[Testo della Discussion]');

  // ===== Conclusioni =====
  H1(body, '5. Conclusioni (1–2 paragrafi)');
  IND(body, 'Risposta diretta alla RQ + un\'unica frase sul contributo principale. NON riassumere tutto il saggio — quello l\'ha già fatto l\'Abstract.');
  P(body, '[Testo delle Conclusioni]');

  // ===== AI Declaration =====
  H1(body, '6. Dichiarazione d\'uso dell\'IA generativa');
  IND(body, 'OBBLIGATORIA. Compilate anche se non avete usato nessuna IA. Per ogni strumento dichiarate: (a) quale, (b) per cosa, (c) come avete verificato l\'output. NON è permesso usare l\'IA per: scrivere intere sezioni, sostituire la lettura dei testi del corso, eseguire la codifica al posto dei codificatori umani.');
  P(body, '[Dichiarazione del gruppo]');

  // ===== Bibliography =====
  H1(body, '7. Bibliografia');
  IND(body, 'APA 7. Inserire ALMENO i 5 testi del corso citati nel saggio. Eventuali fonti esterne (giornalistiche, di contesto) ammesse ma non sostitutive dei 5 testi.');
  body.appendListItem('boyd, d. (2017). Hacking the attention economy. Data & Society.');
  body.appendListItem('boyd, d. (2018). It\'s complicated: La vita sociale degli adolescenti sul web (Introduzione, pp. 29–43). Castelvecchi.');
  body.appendListItem('Jenkins, H. (2008). Fan, blogger e videogamers: L\'emergere delle culture partecipative nell\'era digitale. FrancoAngeli.');
  body.appendListItem('Marwick, A., & Lewis, R. (2017). Media manipulation and disinformation online. Data & Society.');
  body.appendListItem('Shirky, C. (2009). Uno per uno, tutti per tutti: Il potere di organizzare senza organizzazione. Codice Edizioni.');
  body.appendListItem('[Aggiungere altre fonti citate]');

  // ===== Appendix A =====
  H1(body, 'Appendice A — Codebook completo');
  IND(body, 'Riportate il codebook nella sua versione FINALE (post-pilot, post-correzioni di affidabilità). Per ciascuna categoria: nome; definizione operativa estesa; almeno UN esempio positivo (video_id dal dataset); almeno UN esempio negativo (un post che SEMBRA della categoria ma non lo è, e perché); regola di decisione per i casi ambigui.');
  P(body, '[Codebook]');

  // ===== Appendix B =====
  H1(body, 'Appendice B — Log delle decisioni di codifica');
  IND(body, '5–10 voci esemplificative dal tab 09_Log_decisioni del Foglio Google. Una riga per voce con: Data, video_id, Caso, Decisione, Motivazione.');
  const logTable = body.appendTable([
    ['Data', 'video_id', 'Caso', 'Decisione', 'Motivazione'],
    ['', '', '', '', '']
  ]);
  logTable.getRow(0).editAsText().setBold(true);

  // Save the doc
  doc.saveAndClose();
  Logger.log('Paper template configured for ' + rq);
}

// ===== Style helpers =========================================================

function H1(body, text) {
  return body.appendParagraph(text).setHeading(DocumentApp.ParagraphHeading.HEADING1);
}
function H2(body, text) {
  return body.appendParagraph(text).setHeading(DocumentApp.ParagraphHeading.HEADING2);
}
function P(body, text) {
  return body.appendParagraph(text);
}
/** Indications block — italic, gray background-ish via gray font, prefixed with ▸ */
function IND(body, text) {
  const p = body.appendParagraph('▸ Indicazioni: ' + text);
  p.editAsText().setItalic(true).setForegroundColor('#666666');
  return p;
}
