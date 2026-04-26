# Dataset construction report — TikTok corpus for Internet Studies

_Generated: 2026-04-26 08:26 CEST_

Course: Internet Studies, A.A. 2025/2026, Università di Urbino Carlo Bo (DISCUI).  Block 2 group project — TikTok content analysis. Theme: media manipulation in  Italian political and engagement-economy discourse, Sept 2025 – Apr 2026.

## 1. Theme and analytic frame

Two contrastive anchor cases stitched onto the same Italian-language stage:

- **Anchor A — `@esperia_italia` and the right-leaning 'independent' media network**  investigated by IrpiMedia + Hermes Center + Wired Italia (Jan 2026) and Report (RAI).  Textbook *astroturfing*.
- **Anchor B — AI-generated political content** (deepfakes, AI-slop)  culminating in the 18 Dec 2025 cross-party parliamentary appeal and art. 612-quater c.p.;  flagship video: Meloni/'Milone' fake-arrest deepfake by `@aicontenute` (122k views,  2026-01-23, deliberate misspelling for moderation evasion).
- **Anchor C (added)** — Italian religious AI-slop on `#amen` / `#amen🙏`  (engagement-economy hacking via low-cost Gen-AI; clean Boyd-2017 attention-economy case).

**Two orthogonal coding axes:**

- `content_provenance`: *autentico* (human) vs. *AI-generato* (deepfake / synthetic avatar / AI-illustration / AI voice clone).
- `engagement_authenticity`: *organico* vs. *coordinato/inautentico*.

These produce a 2×2 with cells C1 organic, C2 astroturfed, C3 viral synthetic, C4 coordinated AI.

## 2. Pipeline

```text
  TikTok Research API ──┬── fetch_tiktok.R --mode=corpus  ──> data-raw/corpus_videos/
                        └── fetch_tiktok.R --mode=accounts ──> data-raw/raw_videos/
                                  │
                                  ▼
            franc Italian language filter (region + lang detect)
                                  │
                                  ▼
              CooRTweet (prep_data → detect_groups → graph)
                                  │
                                  ▼
           expand_network.R (per-case expansion from seeds)
                                  │
                                  ▼
           build_master_dataset.R → 01_Dataset_master Sheet
```

## 3. Corpus volume

| Track | Videos | Accounts | Median views | Window |
|---|---:|---:|---:|---|
| trackA_esperia | 11,790 | 2,793 | 831 | 2025-09-01 → 2026-04-23 |
| trackB_ai_deepfake | 40,845 | 30,833 | 359 | 2025-09-30 → 2026-02-28 |
| trackC_ai_religious | 8,260 | 1,859 | 458 | 2025-09-04 → 2026-04-23 |

**Total: 60,895 videos across 35,357 unique accounts.**

Per-account fetch: 6,788 videos across 13 accounts.

## 4. Coordinated behaviour (CooRTweet)

τ-sweep summary (CooRTweet on Italian-filtered corpus, edge_weight quantile = 0):

| τ (s) | Pairs | Accounts | Edges | Components | Largest | Modularity |
|---:|---:|---:|---:|---:|---:|---:|
| 60 | 49 | 11 | 12 | 2 | 7 | 0.497 |
| 600 | 115 | 21 | 41 | 4 | 8 | 0.588 |
| 3600 | 162 | 24 | 49 | 4 | 12 | 0.611 |

**τ=60s — top accounts:**

| Account | Component | Degree | n_coord |
|---|---:|---:|---:|
| `@viralgossip5` | 1 | 5 | 10 |
| `@user2727961231337` | 2 | 3 | 8 |
| `@ilsignificatodeisogni` | 1 | 2 | 5 |
| `@_lovemy_self` | 1 | 2 | 4 |
| `@pregaconnoi` | 1 | 2 | 4 |
| `@offerteshock_` | 1 | 2 | 4 |
| `@ricettedelgiorno` | 1 | 2 | 5 |
| `@user8292097867816` | 2 | 2 | 6 |
| `@user87433312288032` | 2 | 2 | 4 |
| `@up.viral.news` | 1 | 1 | 2 |
| `@user8849222142781` | 2 | 1 | 2 |

**τ=600s — top accounts:**

| Account | Component | Degree | n_coord |
|---|---:|---:|---:|
| `@ilsignificatodeisogni` | 1 | 6 | 15 |
| `@ricettedelgiorno` | 1 | 6 | 15 |
| `@offerteshock_` | 1 | 6 | 15 |
| `@user1376560750025` | 3 | 6 | 14 |
| `@viralgossip5` | 1 | 6 | 15 |
| `@user8849222142781` | 3 | 6 | 16 |
| `@_lovemy_self` | 1 | 5 | 10 |
| `@pregaconnoi` | 1 | 5 | 10 |
| `@user2727961231337` | 3 | 5 | 13 |
| `@user8292097867816` | 3 | 5 | 13 |
| `@user87433312288032` | 3 | 5 | 11 |
| `@user6761602336119` | 3 | 5 | 11 |
| `@up.viral.news` | 1 | 4 | 8 |
| `@user2058403336138` | 3 | 3 | 6 |
| `@z_come_zero` | 2 | 2 | 4 |

**τ=3600s — top accounts:**

| Account | Component | Degree | n_coord |
|---|---:|---:|---:|
| `@user1376560750025` | 4 | 7 | 18 |
| `@user8849222142781` | 4 | 7 | 22 |
| `@ilsignificatodeisogni` | 1 | 6 | 17 |
| `@_lovemy_self` | 1 | 6 | 12 |
| `@pregaconnoi` | 1 | 6 | 12 |
| `@ricettedelgiorno` | 1 | 6 | 17 |
| `@offerteshock_` | 1 | 6 | 17 |
| `@up.viral.news` | 1 | 6 | 20 |
| `@viralgossip5` | 1 | 6 | 17 |
| `@user2727961231337` | 4 | 5 | 14 |
| `@user8292097867816` | 4 | 5 | 15 |
| `@user87433312288032` | 4 | 5 | 11 |
| `@user6761602336119` | 4 | 5 | 12 |
| `@user1304692185468` | 4 | 5 | 10 |
| `@user2058403336138` | 4 | 3 | 6 |

## 5. Network expansion from Component-1 seeds

Local expansion from the 7 Component-1 seeds (Italian corpus, ±120s window):

- Match accounts found: **7** (closed cluster — same 7 seeds, no new partners)
- Confirms identical-text caption coordination is internal to the 7-account ring.

| Account | n_matches | n_distinct_descs | Periods active |
|---|---:|---:|---|
| `@ricettedelgiorno` | 15 | 3 | Jan-Feb 2026 | Sep-Oct 2025 |
| `@viralgossip5` | 15 | 3 | Jan-Feb 2026 | Sep-Oct 2025 |
| `@offerteshock_` | 15 | 3 | Jan-Feb 2026 | Sep-Oct 2025 |
| `@ilsignificatodeisogni` | 15 | 3 | Jan-Feb 2026 | Sep-Oct 2025 |
| `@_lovemy_self` | 11 | 2 | Sep-Oct 2025 |
| `@pregaconnoi` | 11 | 2 | Sep-Oct 2025 |
| `@up.viral.news` | 10 | 2 | Jan-Feb 2026 | Sep-Oct 2025 |

## 6. Solovyov-Meloni event (2026-04-21)

Italian-region TikTok posts using `#solovyov` / `#soloviev` / `#solovyev` / `#soloviov` Top-engagement posts:

| Account | Date | Views | Caption (truncated) |
|---|---|---:|---|
| `@corrieredellasera` | 04-21 20:15 | 304,898 | Rischia di p ovoca e u   uovo caso diplomatico t a Russia e Italia l'uscita di Vladimi  Solovyev, u o dei p i cipali p o |
| `@velenoquotidiano` | 04-21 20:56 | 171,116 | #soloviev#i sultiallamelo i# ussia#vi #vi ale  |
| `@giornaledibordo` | 04-22 20:04 | 105,422 | Solovyov attacca Gio gia Melo i i  di etta TV co  to i che somiglia o più a u o sfogo da oste ia che a p opaga da. Ma  o |
| `@martinamencucci_` | 04-22 19:46 | 91,077 | 😅 #gio giamelo i#solovyov   |
| `@corrieredellasera` | 04-22 08:11 | 56,460 | E  esimo attacco  usso alle istituzio i italia e. Questa volta è il famoso co dutto e televisivo Vladimi  Solovyev, i si |
| `@radio_gufo` | 04-21 22:17 | 53,499 | Vladimi  Solovyov, u o dei p i cipali p opaga disti della televisio e di Stato  ussa, ha i sultato pesa teme te Gio gia  |
| `@carlocalendaofficial` | 04-22 18:22 | 36,748 | Solovyev, il capo p opaga dista del #C emli o, dopo la P eside te del Co siglio oggi attacca pubblicame te a che me e Pi |
| `@rairadiouno` | 04-22 10:08 | 29,709 | Gli i sulti di #Solovyov a #Melo i. Solida ietà alla p emie  a  iva da tutte le fo ze politiche co  u  co o di co da  a. |

## 7. Top-10 Track A accounts — leaning and pro-Putin signal

Hand-curated classification grounded in sample posts and hashtag profiles  (see chat transcript for evidence). Pro-Putin column flags content that  promotes Russia-sympathetic framings (anti-NATO 'provocation', opposition  to Ukraine military aid, sympathetic citing of Orsini/Vannacci).

| Rank | Account | Posts | Views | Leaning | Pro-Putin |
|---:|---|---:|---:|---|---|
| 1 | `@trendypoliticss` | 1,509 | 30,296,605 | Anti-system left ('rosso-bruno') | **YES** (strong) |
| 2 | `@just.frank.ita` | 473 | 15,306,728 | Right (pro-Meloni) | NO |
| 3 | `@stefanokarmamaster` | 206 | 1,725,165 | Centre-right | NO |
| 4 | `@dietrolequintedelpotere` | 199 | 199,165 | Right (FdI / sovranista) | NO |
| 5 | `@1..enzo` | 139 | 456,289 | Centre-left / populist (M5S) | Unclear |
| 6 | `@adelio_ita` | 128 | 53,222 | Right (Esperia amplifier) | Unclear (likely) |
| 7 | `@onaiggor` | 99 | 521,371 | Far-right (Lega) | Likely YES |
| 8 | `@user978918366` | 88 | 508,576 | Far-right (Vannacci) | **YES** (strong) |
| 9 | `@ciufforosso93` | 87 | 302,806 | Centre / La7 clipper | NO |
| 10 | `@__daniel.riti__` | 80 | 86,630 | Centre-left (anti-Meloni) | NO |

**Pattern:** pro-Putin signal correlates with the *anti-establishment /  sovranista* axis, not with the left-right axis. Both far-right (Lega/Vannacci)  and anti-system left (Travaglio/Orsini/Scanzi) converge on Russia-sympathetic  framings — the Italian *ferro-di-cavallo* dynamic.

## 8. Limitations and next steps

- **API quota**: TikTok Research API enforces a daily quota (~1000 calls).  We hit it on Day 1; remaining fetches scheduled for Day 2 after midnight UTC.
- **Italian filter false negatives**: `region_code=IT` excludes Italian-language  operators based abroad (e.g. `@_lovemy_self` region `DZ`). For these we use the  accounts mode (no region filter, only franc).
- **Track A keyword contamination**: 'esperia' matches the Lazio toponym  *Badia di Esperia* and the Haitian Creole 'esperian' stem — handled by region+ franc filters going forward, but historical corpus retains a small commercial-spam tail.
- **Caption-level coordination misses Esperia itself**: Esperia produces unique  content via a talent network; coordination is at the *editorial-line* / talent- pipeline level, not at the caption level. Future work: semantic similarity  (rare-bigram overlap) on `voice_to_text`.
- **`cld3` install failed** on this machine (system-level protobuf missing).  Substituted with `franc` (no native deps).

**Next steps for the instructor:**

1. Inspect `data-raw/account_clusters.csv` — accept / drop / reassign accounts.
2. Run `scripts/build_master_dataset.R` (to be written) to assemble the ~900- video stratified sample for `01_Dataset_master`.
3. Hand the master sheet to the groups in lez. 13.

