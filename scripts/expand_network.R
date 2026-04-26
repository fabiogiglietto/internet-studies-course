#!/usr/bin/env Rscript
# Network expansion from Component 1 engagement-farm seeds.
#
# Logic:
#   1. Read the Italian-filtered corpus (same pipeline as coordinated_detection.R).
#   2. Take 7 Component-1 seed accounts from coortweet/600s/coordinated_accounts.csv.
#   3. Extract all (description, ts) pairs they posted.
#   4. For each seed-posted description, find ALL accounts in the corpus
#      that posted the SAME description within ±Δ_expand of the seed post.
#      This discovers accounts that coordinated only once (so MIN_PARTICIPATION=2
#      excluded them), or accounts that coordinate with seeds without each other.
#   5. Temporal drift: split window into 4 periods (Sept-Oct, Nov-Dec, Jan-Feb,
#      Mar-Apr) and report which expanded accounts are active in each.

suppressPackageStartupMessages({
  library(arrow); library(data.table); library(dplyr); library(stringr)
  library(fs);    library(here);       library(franc);  library(lubridate)
})

# ---- Reload Italian corpus (same logic as coordinated_detection.R) ------

DELTA_EXPAND_S <- 120L   # ±120s = ~Q3 of observed coord delay
MIN_TEXT_LEN   <- 20L
non_it_regions <- c("br","mx","es","fr","us","co","ar","pe","ng","ve","ec",
                    "gb","cl","de","ph","sa","ma","tn","tr","ro")

files <- dir_ls(here("data-raw", "corpus_videos"), recurse=TRUE, glob="*.parquet")
corpus <- bind_rows(lapply(files, read_parquet)) |>
  select(id, username, create_time, video_description, voice_to_text, region_code, track) |>
  filter(!is.na(video_description),
         nchar(str_squish(video_description)) >= MIN_TEXT_LEN,
         !is.na(create_time)) |>
  distinct(id, .keep_all = TRUE) |>
  as.data.table()
corpus <- corpus[!(tolower(region_code) %in% non_it_regions)]
corpus[, combined_text := paste(
  ifelse(is.na(video_description), "", video_description),
  ifelse(is.na(voice_to_text),     "", voice_to_text)
)]
corpus[, lang := vapply(combined_text, function(x) {
  if (nchar(str_squish(x)) < 20L) return("und")
  tryCatch(franc::franc(x, min_length = 20L), error=function(e) "und")
}, character(1))]
corpus <- corpus[lang %in% c("ita", "und")]
corpus[, ts := as_datetime(create_time, tz = "Europe/Rome")]
corpus[, period := cut(ts,
  breaks = as_datetime(c("2025-09-01","2025-11-01","2026-01-01",
                         "2026-03-01","2026-05-01"), tz="Europe/Rome"),
  labels = c("Sep-Oct 2025","Nov-Dec 2025","Jan-Feb 2026","Mar-Apr 2026"),
  right = FALSE)]
cat(sprintf("Italian corpus: %d videos, %d accounts\n",
            nrow(corpus), uniqueN(corpus$username)))

# ---- Seeds ---------------------------------------------------------------

seeds <- c("viralgossip5","ilsignificatodeisogni","_lovemy_self",
           "pregaconnoi","offerteshock_","ricettedelgiorno","up.viral.news")
seed_posts <- corpus[username %in% seeds]
cat(sprintf("Seed posts: %d, unique descriptions: %d\n",
            nrow(seed_posts), uniqueN(seed_posts$video_description)))

# ---- Local expansion: same description, near in time --------------------

# For each (seed_account, seed_desc, seed_ts), find non-seed accounts
# posting the same desc within ±DELTA_EXPAND_S seconds.

setkey(corpus, video_description)
expand_rows <- list()
for (i in seq_len(nrow(seed_posts))) {
  s <- seed_posts[i]
  candidates <- corpus[J(s$video_description), nomatch = NULL]
  same_desc <- candidates[username != s$username &
                          abs(as.numeric(ts) - as.numeric(s$ts)) <= DELTA_EXPAND_S]
  if (nrow(same_desc) == 0L) next
  expand_rows[[length(expand_rows)+1L]] <- same_desc[, .(
    seed_account = s$username,
    seed_id      = s$id,
    seed_ts      = s$ts,
    seed_desc    = substr(s$video_description, 1, 100),
    match_account = username,
    match_id      = id,
    match_ts      = ts,
    delta_s       = abs(as.numeric(ts) - as.numeric(s$ts)),
    period        = period
  )]
}
expanded <- rbindlist(expand_rows, fill = TRUE)
cat(sprintf("Expansion edges (seed→match): %d, unique match accounts: %d\n",
            nrow(expanded), uniqueN(expanded$match_account)))

# ---- Expanded account list ----------------------------------------------

expanded_accts <- expanded[, .(
  n_matches      = .N,
  n_distinct_descs = uniqueN(seed_desc),
  partners       = paste(sort(unique(seed_account)), collapse=", "),
  first_match    = format(min(match_ts), "%Y-%m-%d"),
  last_match     = format(max(match_ts), "%Y-%m-%d"),
  periods_active = paste(sort(unique(as.character(period))), collapse=" | ")
), by = match_account][order(-n_matches)]

fwrite(expanded_accts, "data-raw/coortweet/expanded_accounts.csv")
fwrite(expanded,       "data-raw/coortweet/expanded_edges.csv")

cat("\n=== Expanded account list (top 30 by # matches) ===\n")
print(head(expanded_accts, 30))

# ---- Temporal drift: which seeds + matches are active per period --------

cat("\n=== Network composition by period (seeds + matches) ===\n")
all_active_by_period <- rbindlist(list(
  seed_posts[, .(account = username, role = "seed", period)],
  expanded[, .(account = match_account, role = "match", period)]
), fill = TRUE)[!is.na(period)]

period_summary <- all_active_by_period[, .(
  n_accounts   = uniqueN(account),
  seed_active  = paste(sort(unique(account[role=="seed"])), collapse=", "),
  match_active = paste(sort(unique(account[role=="match"])), collapse=", ")
), by = period][order(period)]

print(period_summary[, .(period, n_accounts, seed_active)], nrows=10)
cat("\nMatch accounts by period:\n")
for (i in seq_len(nrow(period_summary))) {
  cat(sprintf("  %s: %s\n",
              period_summary$period[i],
              substr(period_summary$match_active[i], 1, 200)))
}

# ---- Description sample per period -------------------------------------

cat("\n=== Sample seed descriptions per period (5 each) ===\n")
sd_per_period <- seed_posts[, .(
  desc = head(unique(substr(video_description, 1, 100)), 5)
), by = period]
for (i in seq_len(nrow(sd_per_period))) {
  cat(sprintf("\n[%s]\n  - %s\n", sd_per_period$period[i], sd_per_period$desc[i]))
}

cat("\nResults written to data-raw/coortweet/expanded_*.csv\n")
