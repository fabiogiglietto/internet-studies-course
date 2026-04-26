#!/usr/bin/env Rscript
# Assemble the 900-video master dataset for `01_Dataset_master`.
#
# Input:
#   data-raw/corpus_videos/**/*.parquet     (Tracks A, B, C)
#   data-raw/raw_videos/*.parquet            (per-account histories)
#   data-raw/solovyov_meloni_window.parquet  (event-window pull)
#   data-raw/account_clusters.csv            (cluster + subcluster mapping)
#
# Output:
#   data-raw/master_dataset.csv              (12 visible cols + subcluster)
#   data-raw/master_dataset_summary.md       (counts + cell coverage)

suppressPackageStartupMessages({
  library(arrow); library(data.table); library(dplyr); library(stringr)
  library(fs);    library(here);       library(franc); library(lubridate)
  library(readr); library(glue);       library(optparse)
})

opts <- list(
  make_option("--target-n", type = "integer", default = 900L,
              help = "Target master sample size [default %default]"),
  make_option("--seed", type = "integer", default = 42L,
              help = "Random seed for reproducibility [default %default]"),
  make_option("--window-start", type = "character", default = "2026-02-01",
              help = "Restrict candidates to videos created on/after this date [default %default]"),
  make_option("--window-end", type = "character", default = "2026-04-23",
              help = "Restrict candidates to videos created on/before this date [default %default]"),
  make_option("--dry-run", action = "store_true", default = FALSE,
              help = "Print candidate counts without writing")
)
opt <- parse_args(OptionParser(option_list = opts),
                  args = commandArgs(trailingOnly = TRUE))

set.seed(opt$seed)
# Narrowed Feb-Apr 2026 window has smaller pools for human-content clusters;
# targets calibrated accordingly. ai_religious dominates because the bot
# rings posted heavily in 2026.
TARGETS <- c(astroturfed_human = 100L, ai_religious = 250L,
             ai_political      = 30L,  organic       = 520L)

# Hardcoded always-include videos that fall outside the window but are
# canonical case-studies (the dataset must show them). Each row will be
# tagged with the chosen subcluster regardless of window filter.
ALWAYS_INCLUDE <- list(
  list(video_id = "7598501738257091862",
       subcluster = "ai_political",
       reason = "Meloni/Milone fake-arrest flagship deepfake (2026-01-23, 122k views)")
)

# ---- Helpers -------------------------------------------------------------

read_pq <- function(p) {
  d <- read_parquet(p)
  if ("hashtag_names" %in% names(d)) {
    d$hashtag_names_str <- vapply(d$hashtag_names, function(x) {
      if (is.null(x) || length(x) == 0L) "" else paste(x, collapse = ", ")
    }, character(1))
    d$hashtag_names <- NULL
  } else {
    d$hashtag_names_str <- ""
  }
  d
}

THEME_REGEX <- paste0(
  "(?i)\\b(",
  "meloni|salvini|schlein|conte|salis|donzelli|tajani|santanche|consob|",
  "deepfake|intelligenzaartificiale|fakenews|disinformazione|",
  "governo|parlamento|fratelliditalia|m5s|avs|lega|partitodemocratico|",
  "vannacci|orsini|travaglio|scanzi|berlusconi|adinolfi|sgarbi|",
  "referendum|riformagiudiziaria|decretosicurezza|",
  "attualit|politicaitaliana|esperia|",
  "amen|gesu|gesù|jesus|fede|preghiera|miracolo|papa|santo|",
  "carabinieri|solovyov|soloviev",
  ")\\b"
)

detect_lang_safe <- function(text_vec) {
  vapply(text_vec, function(x) {
    if (is.na(x) || nchar(str_squish(x)) < 20L) return("und")
    tryCatch(franc::franc(x, min_length = 20L), error = function(e) "und")
  }, character(1))
}

# ---- Load all data -------------------------------------------------------

message("Loading corpus_videos parquets...")
corpus_files <- dir_ls(here("data-raw", "corpus_videos"),
                       recurse = TRUE, glob = "*.parquet")
corpus <- bind_rows(lapply(corpus_files, read_pq))
message(sprintf("  corpus_videos: %d rows", nrow(corpus)))

message("Loading raw_videos parquets (per-account)...")
acct_files <- dir_ls(here("data-raw", "raw_videos"), glob = "*.parquet")
acct <- if (length(acct_files)) bind_rows(lapply(acct_files, read_pq)) else tibble()
message(sprintf("  raw_videos: %d rows from %d accounts",
                nrow(acct), length(acct_files)))

message("Loading solovyov_meloni_window.parquet...")
solo_path <- here("data-raw", "solovyov_meloni_window.parquet")
solo <- if (file_exists(solo_path)) read_pq(solo_path) else tibble()
message(sprintf("  solovyov_meloni: %d rows", nrow(solo)))

# Bind all sources, dedupe on id
all_videos <- bind_rows(corpus, acct, solo) |> as.data.table()
setkey(all_videos, id)
all_videos <- unique(all_videos, by = "id")
all_videos[, id := as.character(id)]
message(sprintf("Combined unique videos: %d", nrow(all_videos)))

# ---- Italian language filter --------------------------------------------

message("Italian-language filter (franc)...")
all_videos[, combined_text := paste(
  ifelse(is.na(video_description), "", video_description),
  ifelse(is.na(voice_to_text),     "", voice_to_text)
)]
all_videos[, lang := detect_lang_safe(combined_text)]
n_pre <- nrow(all_videos)
all_videos <- all_videos[lang %in% c("ita", "und")]
message(sprintf("  kept %d/%d (%.0f%%)", nrow(all_videos), n_pre,
                100 * nrow(all_videos) / n_pre))

# ---- Theme regex (relaxed for ai_religious) -----------------------------

all_videos[, theme_match := str_detect(combined_text, THEME_REGEX) |
                            str_detect(hashtag_names_str, THEME_REGEX)]

# ---- Cluster/subcluster join --------------------------------------------

clusters <- fread(here("data-raw", "account_clusters.csv"))
all_videos <- merge(all_videos, clusters[, .(username, cluster, subcluster)],
                    by = "username", all.x = TRUE)

# Mark "in-cluster" videos. Theme filter applies to all subclusters EXCEPT
# ai_religious (which has its own theme — captions are short / hashtag-only).
all_videos[, in_pool := !is.na(subcluster) &
                       (subcluster == "ai_religious" | theme_match)]

# ---- Open-cohort expansion ----------------------------------------------
# The 4 CooRTweet components give us anchor accounts; on their own they're
# too thin for a 900-video dataset. Top-up with content that has the cluster's
# theme even if posted by accounts not in the cluster file.

# ai_religious_open: any Italian video tagged with religious-AI hashtags
RELIGIOUS_TAG_RE <- regex(
  "(^|,)\\s*(amen|amen🙏|gesu|gesù|jesus|preghiera|miracolo|fede|cristiano|santo|papa)\\s*(,|$)",
  ignore_case = TRUE
)
all_videos[, religious_tag := str_detect(hashtag_names_str %||% "", RELIGIOUS_TAG_RE)]
all_videos[is.na(subcluster) & lang %in% c("ita","und") & religious_tag,
          `:=`(subcluster = "ai_religious", in_pool = TRUE)]

# ai_political_open: Italian videos with AI/deepfake hashtags + politician name
AI_TAG_RE <- regex(
  "(^|,)\\s*(deepfake|intelligenzaartificiale|ia|aigeneratedcontent|fakenews|disinformazione|aicontent|aigenerated)\\s*(,|$)",
  ignore_case = TRUE
)
POLITICIAN_RE <- regex(
  "\\b(meloni|salvini|schlein|salis|donzelli|tajani|santanche|conte|consob|milone|melone)\\b",
  ignore_case = TRUE
)
all_videos[, ai_tag       := str_detect(hashtag_names_str %||% "", AI_TAG_RE)]
all_videos[, politician_kw := str_detect(combined_text, POLITICIAN_RE)]
all_videos[is.na(subcluster) &
           lang %in% c("ita","und") &
           ai_tag & politician_kw,
          `:=`(subcluster = "ai_political", in_pool = TRUE)]

# Also keep the original Meloni/'Milone' fake-arrest pattern (caption-based,
# even when the AI hashtag isn't present)
ai_political_kw_only <- c("milone", "melone", "presidente.{0,5}arrest",
                          "carabinieri.{0,20}meloni", "meloni.{0,20}arrest")
all_videos[is.na(subcluster) & lang %in% c("ita","und") &
           Reduce(`|`, lapply(ai_political_kw_only,
                              function(p) str_detect(combined_text, regex(p, ignore_case = TRUE)))),
           `:=`(subcluster = "ai_political", in_pool = TRUE)]

# Third pass: AI-satire framing phrases ("ultima notizia", "scoop", "esclusiva",
# "appena successo", "ultima ora") + politician keyword + non-mainstream account.
# This catches the @aicontenute-style fabricated-event genre even when no AI tag.
SATIRE_FRAME_RE <- regex(
  "\\b(ultima notizia|ultima ora|appena successo|scoop|esclusiva|breaking|rivelato|incredibile)\\b",
  ignore_case = TRUE
)
MAINSTREAM_NEWS_ACCOUNTS <- c("corrieredellasera","rairadiouno","rainews","skytg24",
                              "lastampa","repubblica","ilfattoquotidiano","ansa",
                              "tg1rai","tg2rai","tg3rai","tgla7","la7","fanpage")
all_videos[is.na(subcluster) & lang %in% c("ita","und") &
           str_detect(combined_text, SATIRE_FRAME_RE) &
           politician_kw &
           !(tolower(username) %in% MAINSTREAM_NEWS_ACCOUNTS),
          `:=`(subcluster = "ai_political", in_pool = TRUE)]

`%||%` <- function(a, b) ifelse(is.na(a) | is.null(a), b, a)

pool_counts <- all_videos[in_pool == TRUE, .N, by = subcluster][order(-N)]
message("Pool by subcluster (before window filter):"); print(pool_counts)

# ---- Date-window filter (recent only, per pedagogical rationale) -------

window_start <- as.numeric(as.POSIXct(opt$`window-start`, tz = "UTC"))
window_end   <- as.numeric(as.POSIXct(opt$`window-end`,   tz = "UTC")) + 86400L
in_window <- all_videos$create_time >= window_start &
             all_videos$create_time <  window_end

# Always-include flag (overrides the window filter for canonical case-studies)
always_ids <- vapply(ALWAYS_INCLUDE, function(x) x$video_id, character(1))
all_videos[, always_include := id %in% always_ids]
# Tag the always-include rows with the prescribed subcluster (in case they
# weren't captured by an open-cohort rule because they're outside the window).
for (entry in ALWAYS_INCLUDE) {
  all_videos[id == entry$video_id, `:=`(subcluster = entry$subcluster, in_pool = TRUE)]
}
all_videos[, in_pool := in_pool & (in_window | always_include)]

pool_counts <- all_videos[in_pool == TRUE, .N, by = subcluster][order(-N)]
message(sprintf("Pool after window filter (%s → %s):",
                opt$`window-start`, opt$`window-end`))
print(pool_counts)

# ---- Per-cluster stratified sample --------------------------------------

sample_one <- function(sub, target) {
  pool <- all_videos[in_pool == TRUE & subcluster == sub]
  if (nrow(pool) == 0L) {
    warning("No candidates for subcluster: ", sub)
    return(pool[0])
  }
  # Always-include rows are kept; the rest is randomly sampled
  must_keep <- pool[always_include == TRUE]
  rest      <- pool[always_include == FALSE]
  remaining <- max(0L, target - nrow(must_keep))
  if (nrow(rest) <= remaining) {
    message(sprintf("  %s: take %d (always_include=%d + all %d remaining; target %d)",
                    sub, nrow(must_keep) + nrow(rest), nrow(must_keep), nrow(rest), target))
    return(rbind(must_keep, rest))
  }
  message(sprintf("  %s: take %d (always_include=%d + sample %d from %d; target %d)",
                  sub, nrow(must_keep) + remaining, nrow(must_keep), remaining, nrow(rest), target))
  rbind(must_keep, rest[sample(.N, remaining)])
}

message("Per-cluster sampling:")
sampled <- rbindlist(lapply(names(TARGETS), function(s) sample_one(s, TARGETS[[s]])),
                     fill = TRUE)

# ---- Format output ------------------------------------------------------

sampled[, create_dt := as_datetime(create_time, tz = "Europe/Rome")]
sampled[, create_time_fmt := format(create_dt, "%Y-%m-%d %H:%M")]
sampled[, watch_url := sprintf("https://www.tiktok.com/@%s/video/%s",
                                username, id)]

master <- sampled[, .(
  video_id          = id,
  create_time       = create_time_fmt,
  username          = username,
  video_description = video_description,
  voice_to_text     = voice_to_text,
  hashtag_names     = hashtag_names_str,
  view_count        = view_count,
  like_count        = like_count,
  comment_count     = comment_count,
  share_count       = share_count,
  video_duration    = video_duration,
  watch_url         = watch_url,
  subcluster        = subcluster
)]

# Randomize row order so coders don't see cluster bunching
master <- master[sample(.N)]

if (opt$`dry-run`) {
  cat("\nDRY RUN — not writing files. Final composition:\n")
  print(master[, .N, by = subcluster][order(-N)])
  quit(status = 0)
}

out_csv <- here("data-raw", "master_dataset.csv")
fwrite(master, out_csv)
message(sprintf("\nWrote %d rows × %d cols → %s",
                nrow(master), ncol(master), out_csv))

# ---- Summary report -----------------------------------------------------

# 2x2 cell heuristic for verification
master[, content_ai_heur  := subcluster %in% c("ai_religious", "ai_political")]
master[, engage_coord_heur := subcluster %in% c("astroturfed_human",
                                                  "ai_religious", "ai_political")]
master[, cell_heur := fifelse(!content_ai_heur & !engage_coord_heur, "C1_organic",
                       fifelse( content_ai_heur & !engage_coord_heur, "C3_viral_synthetic",
                       fifelse(!content_ai_heur &  engage_coord_heur, "C2_astroturfed",
                                                                       "C4_coordinated_AI")))]

summary_md <- glue::glue("
# Master dataset summary

_Generated: {format(Sys.time(), '%Y-%m-%d %H:%M %Z')}_

## Composition

| Subcluster | N |
|---|---:|
{paste(sprintf('| %s | %d |', master[, .N, by=subcluster][order(-N)]$subcluster, master[, .N, by=subcluster][order(-N)]$N), collapse='\n')}

**Total: {nrow(master)} videos**

## 2×2 cell coverage (heuristic pre-coding)

| Cell | N |
|---|---:|
{paste(sprintf('| %s | %d |', master[, .N, by=cell_heur][order(cell_heur)]$cell_heur, master[, .N, by=cell_heur][order(cell_heur)]$N), collapse='\n')}

Heuristic mapping: AI content if subcluster ∈ {{ai_religious, ai_political}}; coordinated engagement if subcluster ∈ {{astroturfed_human, ai_religious, ai_political}}. Real (i.e. coder-determined) cell assignment will refine these.

## Per-account top contributors

| Username | Subcluster | N |
|---|---|---:|
{paste(sprintf('| @%s | %s | %d |', head(master[, .N, by=.(username, subcluster)][order(-N)], 20)$username, head(master[, .N, by=.(username, subcluster)][order(-N)], 20)$subcluster, head(master[, .N, by=.(username, subcluster)][order(-N)], 20)$N), collapse='\n')}

## Date histogram (month)

| Month | N |
|---|---:|
{paste(sprintf('| %s | %d |', master[, .N, by=substr(create_time,1,7)][order(substr)]$substr, master[, .N, by=substr(create_time,1,7)][order(substr)]$N), collapse='\n')}

## Build parameters

- target N: {opt$`target-n`}
- seed: {opt$seed}
- target per cluster: astroturfed_human=250, ai_religious=250, ai_political=150, organic=250
")

writeLines(summary_md, here("data-raw", "master_dataset_summary.md"))
message(sprintf("Wrote summary → %s",
                here("data-raw", "master_dataset_summary.md")))

cat("\n=== Final composition ===\n")
print(master[, .N, by = subcluster][order(-N)])
cat("\n=== 2×2 cells (heuristic) ===\n")
print(master[, .N, by = cell_heur][order(cell_heur)])
