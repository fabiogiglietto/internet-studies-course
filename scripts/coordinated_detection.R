#!/usr/bin/env Rscript
# Coordinated-behaviour detection on the TikTok corpus, via CooRTweet.
#
# Pipeline (matches the canonical CooRTweet workflow used in
# /home/fg/projects/sna-luiss-2026/scripts/coortweet_demo.R):
#   1. prep_data() — standardise to (object_id, account_id, content_id, timestamp_share)
#   2. detect_groups() — find accounts that co-post within `time_window`
#   3. generate_coordinated_network() — bipartite/account graph
#   4. CooRTweetPost::export_all_results() — write outputs
#
# Mapping for TikTok corpus:
#   object_id       = video_description
#   account_id      = username
#   content_id      = id (19-digit string, kept as character)
#   timestamp_share = create_time (Unix seconds)
#
# Output dir: data-raw/coortweet/<time_window>s/   (one per τ swept)

suppressPackageStartupMessages({
  library(data.table)
  library(arrow)
  library(dplyr)
  library(stringr)
  library(fs)
  library(here)
  library(igraph)
  library(CooRTweet)
  library(franc)
})
have_post <- requireNamespace("CooRTweetPost", quietly = TRUE)
if (have_post) suppressPackageStartupMessages(library(CooRTweetPost))

# τ values to sweep. Canonical CooRTweet uses 60s. For TikTok video
# descriptions we also sweep wider windows because operators may template
# captions and post over longer intervals than tweet-style coordination.
TIME_WINDOWS <- c(60L, 600L, 3600L)
MIN_PARTICIPATION <- 2L
EDGE_WEIGHT_QUANTILE <- 0  # keep all edges; filter later in analysis
MIN_TEXT_LEN <- 20L  # ignore very short descriptions

corpus_dir <- here("data-raw", "corpus_videos")
out_root   <- here("data-raw", "coortweet")
dir_create(out_root)

# ---- Load corpus --------------------------------------------------------

message("Loading corpus from ", corpus_dir)
files <- dir_ls(corpus_dir, recurse = TRUE, glob = "*.parquet")
if (length(files) == 0L) stop("No parquet files in ", corpus_dir)

corpus <- bind_rows(lapply(files, read_parquet)) |>
  select(id, username, create_time, video_description, voice_to_text, region_code, track) |>
  filter(!is.na(video_description),
         nchar(str_squish(video_description)) >= MIN_TEXT_LEN,
         !is.na(create_time)) |>
  distinct(id, .keep_all = TRUE) |>
  as.data.table()

message(sprintf("  raw: %d videos, %d unique accounts",
                nrow(corpus), uniqueN(corpus$username)))

# Italian-language filter. Two-stage:
#   1. drop videos whose region_code is clearly non-IT
#   2. detect language on description (+ optional voice transcript) via franc;
#      keep ita / und (undetermined — short text, hashtag-only)
non_it_regions <- c("br","mx","es","fr","us","co","ar","pe","ng","ve","ec",
                    "gb","cl","de","ph","sa","ma","tn","tr","ro")
corpus <- corpus[!(tolower(region_code) %in% non_it_regions)]
message(sprintf("  after region filter: %d videos", nrow(corpus)))

# Concatenate description + transcript for stronger language signal
corpus[, combined_text := paste(
  ifelse(is.na(video_description), "", video_description),
  ifelse(is.na(voice_to_text),     "", voice_to_text)
)]
corpus[, lang := vapply(combined_text, function(x) {
  if (nchar(str_squish(x)) < 20L) return("und")
  tryCatch(franc::franc(x, min_length = 20L), error = function(e) "und")
}, character(1))]
corpus <- corpus[lang %in% c("ita", "und")]
message(sprintf("  after Italian language filter: %d videos, %d accounts",
                nrow(corpus), uniqueN(corpus$username)))
message(sprintf("  language distribution kept: %s",
                paste(sprintf("%s=%d", names(table(corpus$lang)),
                              as.integer(table(corpus$lang))),
                      collapse=", ")))

# ---- Prep for CooRTweet -------------------------------------------------

# CooRTweet expects: object_id, account_id, content_id, timestamp_share.
# Keep id as character (preserves 19-digit precision).
data_prepared <- prep_data(
  x               = corpus,
  object_id       = "video_description",
  account_id      = "username",
  content_id      = "id",
  timestamp_share = "create_time"
)
data_prepared <- data_prepared[trimws(object_id) != ""]

message(sprintf("  prepared: %d rows, %d accounts, %d objects",
                nrow(data_prepared),
                uniqueN(data_prepared$account_id),
                uniqueN(data_prepared$object_id)))

# ---- Sweep time windows -------------------------------------------------

summary_rows <- list()

for (tw in TIME_WINDOWS) {
  out_dir <- paste0(as.character(out_root), "/", sprintf("%ds", tw))
  dir_create(out_dir)
  message(sprintf("\n=== detect_groups(time_window=%ds) ===", tw))

  coordinated_groups <- tryCatch(
    detect_groups(
      x                 = data_prepared,
      min_participation = MIN_PARTICIPATION,
      time_window       = tw
    ),
    error = function(e) { message("  detect_groups error: ", conditionMessage(e)); NULL }
  )
  if (is.null(coordinated_groups) || nrow(coordinated_groups) == 0L) {
    message("  no coordinated groups at this τ")
    summary_rows[[length(summary_rows)+1L]] <- data.table(
      time_window=tw, n_pairs=0L, n_accounts=0L,
      n_components=0L, max_component=0L, modularity=NA_real_)
    next
  }
  message(sprintf("  pairs returned: %d", nrow(coordinated_groups)))

  # Account-only network (objects=FALSE). Also save bipartite for inspection.
  g <- generate_coordinated_network(
    coordinated_groups,
    edge_weight = EDGE_WEIGHT_QUANTILE,
    subgraph    = 1,
    objects     = FALSE
  )

  # Stats
  n_acc <- vcount(g)
  n_edg <- ecount(g)
  comp  <- components(g)
  mod   <- if (n_acc > 1L && n_edg > 0L) {
    com <- cluster_louvain(g)
    modularity(g, membership(com))
  } else NA_real_

  message(sprintf("  network: %d accounts, %d edges, %d components, max=%d, mod=%.3f",
                  n_acc, n_edg, comp$no, max(comp$csize, 0), mod %||% NA))

  # Per-account features
  if (n_acc > 0L) {
    com <- if (n_edg > 0L) cluster_louvain(g) else NULL
    accts <- data.table(
      username    = V(g)$name,
      degree      = degree(g),
      component   = comp$membership,
      community   = if (!is.null(com)) membership(com)[V(g)$name] else NA_integer_,
      n_coord     = strength(g)
    )
    setorder(accts, -degree)
    fwrite(accts, file.path(out_dir, "coordinated_accounts.csv"))

    # Bipartite (account × object) for inspection — limit to coord components
    g_bip <- generate_coordinated_network(
      coordinated_groups,
      edge_weight = EDGE_WEIGHT_QUANTILE,
      subgraph    = 1,
      objects     = TRUE
    )
    write_graph(g_bip, file.path(out_dir, "coord_network_bipartite.graphml"), format = "graphml")
    write_graph(g,     file.path(out_dir, "coord_network_accounts.graphml"),  format = "graphml")
    fwrite(coordinated_groups, file.path(out_dir, "coordinated_groups.csv"))

    # CooRTweetPost full export (optional — package may not be installed)
    if (have_post) {
      tryCatch(
        export_all_results(
          coordinated_groups = coordinated_groups,
          network_graph      = g,
          output_dir         = path(out_dir, "_export")
        ),
        error = function(e) message("  export_all_results error (non-fatal): ", conditionMessage(e))
      )
    }
  }

  summary_rows[[length(summary_rows)+1L]] <- data.table(
    time_window  = tw,
    n_pairs      = nrow(coordinated_groups),
    n_accounts   = n_acc,
    n_edges      = n_edg,
    n_components = comp$no,
    max_component = max(comp$csize, 0),
    modularity   = mod %||% NA_real_
  )
}

# ---- Summary across τ ---------------------------------------------------

`%||%` <- function(a, b) if (is.null(a) || is.na(a)) b else a

summary_dt <- rbindlist(summary_rows, fill = TRUE)
fwrite(summary_dt, file.path(out_root, "tau_sweep_summary.csv"))
cat("\n=== τ sweep summary ===\n")
print(summary_dt)

message("\nResults under: ", out_root)
