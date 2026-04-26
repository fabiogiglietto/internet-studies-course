#!/usr/bin/env Rscript
# Fetch TikTok Research API videos. Two modes:
#   --mode=corpus   : broad keyword/hashtag pull (background corpus, Step 1a)
#   --mode=accounts : per-account video history (Step 2)
#
# Auth: TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in env or .Renviron.

suppressPackageStartupMessages({
  library(httr2)
  library(dplyr)
  library(tidyr)
  library(readr)
  library(purrr)
  library(arrow)
  library(glue)
  library(lubridate)
  library(fs)
  library(here)
  library(optparse)
  library(stringr)
})
have_franc <- requireNamespace("franc", quietly = TRUE)
if (have_franc) suppressPackageStartupMessages(library(franc))

API_BASE  <- "https://open.tiktokapis.com/v2"
TOKEN_URL <- glue("{API_BASE}/oauth/token/")
QUERY_URL <- glue("{API_BASE}/research/video/query/")

VIDEO_FIELDS <- paste(c(
  "id", "username", "create_time", "video_description", "voice_to_text",
  "hashtag_names", "view_count", "like_count", "comment_count", "share_count",
  "video_duration", "region_code"
), collapse = ",")

# ---- Auth ----------------------------------------------------------------

token_cache_path <- function() here("data-raw", ".tiktok_token.rds")

tiktok_token <- function() {
  cache <- token_cache_path()
  if (file.exists(cache)) {
    tok <- readRDS(cache)
    if (tok$expires_at - 60 > as.numeric(Sys.time())) return(tok$access_token)
  }
  key    <- Sys.getenv("TIKTOK_CLIENT_KEY")
  secret <- Sys.getenv("TIKTOK_CLIENT_SECRET")
  if (key == "" || secret == "") {
    stop("Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in .Renviron")
  }
  resp <- request(TOKEN_URL) |>
    req_method("POST") |>
    req_headers("Content-Type" = "application/x-www-form-urlencoded") |>
    req_body_form(
      client_key    = key,
      client_secret = secret,
      grant_type    = "client_credentials"
    ) |>
    req_perform()
  body <- resp_body_json(resp)
  saveRDS(
    list(access_token = body$access_token,
         expires_at   = as.numeric(Sys.time()) + body$expires_in),
    cache
  )
  body$access_token
}

# ---- Query helpers -------------------------------------------------------

# Build the body for query/video/. `query` is a named list matching the API's
# AND/OR/NOT condition structure, e.g.:
#   list(and = list(
#     list(operation="IN", field_name="hashtag_name", field_values=c("deepfake")),
#     list(operation="IN", field_name="region_code",  field_values=c("IT"))
#   ))
build_body <- function(query, start_date, end_date,
                       max_count = 100, cursor = NULL, search_id = NULL) {
  body <- list(
    query      = query,
    start_date = format(start_date, "%Y%m%d"),
    end_date   = format(end_date,   "%Y%m%d"),
    max_count  = max_count
  )
  if (!is.null(cursor))    body$cursor    <- cursor
  if (!is.null(search_id)) body$search_id <- search_id
  body
}

tiktok_query_page <- function(body, token, max_retries = 3) {
  for (try in seq_len(max_retries)) {
    resp <- tryCatch(
      request(QUERY_URL) |>
        req_method("POST") |>
        req_url_query(fields = VIDEO_FIELDS) |>
        req_headers(
          "Authorization" = paste("Bearer", token),
          "Content-Type"  = "application/json"
        ) |>
        req_body_json(body) |>
        req_retry(max_tries = 3, backoff = ~ 2 ^ .x) |>
        req_perform(),
      error = function(e) e
    )
    if (inherits(resp, "error")) {
      message("Request error (try ", try, "): ", conditionMessage(resp))
      Sys.sleep(2 ^ try)
      next
    }
    # CRITICAL: parse with bigint_as_char so 19-digit video IDs aren't
    # corrupted by double-precision rounding. resp_body_json doesn't
    # forward bigint flags so go through raw text + jsonlite::fromJSON.
    parsed <- jsonlite::fromJSON(resp_body_string(resp),
                                 simplifyVector = FALSE,
                                 bigint_as_char = TRUE)
    if (!is.null(parsed$error) && parsed$error$code != "ok") {
      message("API error: ", parsed$error$code, " — ", parsed$error$message)
      Sys.sleep(2 ^ try)
      next
    }
    return(parsed$data)
  }
  stop("query/video/ failed after ", max_retries, " retries")
}

paginate <- function(query, start_date, end_date, token,
                     max_pages = 100L, sleep_between = 0.5,
                     pages_cap  = NULL) {
  if (!is.null(pages_cap)) max_pages <- min(max_pages, as.integer(pages_cap))
  out       <- list()
  cursor    <- NULL
  search_id <- NULL
  for (page in seq_len(max_pages)) {
    body <- build_body(query, start_date, end_date,
                       max_count = 100L, cursor = cursor, search_id = search_id)
    data <- tiktok_query_page(body, token)
    videos <- data$videos
    if (is.null(videos) || length(videos) == 0L) break
    out[[page]] <- videos
    if (!isTRUE(data$has_more)) break
    cursor    <- data$cursor
    search_id <- data$search_id
    Sys.sleep(sleep_between)
  }
  bind_videos(out)
}

bind_videos <- function(pages_list) {
  videos <- unlist(pages_list, recursive = FALSE)
  if (length(videos) == 0L) {
    return(tibble(
      id = character(), username = character(), create_time = integer(),
      video_description = character(), voice_to_text = character(),
      hashtag_names = list(), view_count = integer(), like_count = integer(),
      comment_count = integer(), share_count = integer(),
      video_duration = integer(), region_code = character()
    ))
  }
  to_tibble <- function(v) {
    tibble(
      # id is kept as character (bigint_as_char in JSON parse) — never cast to numeric
      id                = as.character(v$id %||% NA_character_),
      username          = v$username %||% NA_character_,
      create_time       = as.numeric(v$create_time %||% NA),
      video_description = v$video_description %||% NA_character_,
      voice_to_text     = v$voice_to_text %||% NA_character_,
      hashtag_names     = list(unlist(v$hashtag_names %||% list(), use.names = FALSE)),
      view_count        = as.numeric(v$view_count %||% NA),
      like_count        = as.numeric(v$like_count %||% NA),
      comment_count     = as.numeric(v$comment_count %||% NA),
      share_count       = as.numeric(v$share_count %||% NA),
      video_duration    = as.numeric(v$video_duration %||% NA),
      region_code       = v$region_code %||% NA_character_
    )
  }
  bind_rows(map(videos, to_tibble))
}

`%||%` <- function(a, b) if (is.null(a) || length(a) == 0L) b else a

# Italian-language post-hoc filter. Combines region check with franc text
# detection (kept "und" — short hashtag-only descriptions). Returns the
# filtered tibble. Does nothing if franc is unavailable.
filter_italian <- function(videos) {
  n0 <- nrow(videos)
  if (n0 == 0L) return(videos)
  # Region check first (cheap)
  non_it_regions <- c("br","mx","es","fr","us","co","ar","pe","ng","ve","ec",
                      "gb","cl","de","ph","sa","ma","tn","tr","ro","au","ca",
                      "in","jp","kr","th","vn","id")
  videos <- videos[!(tolower(as.character(videos$region_code)) %in% non_it_regions), ]
  if (!have_franc || nrow(videos) == 0L) return(videos)
  # Franc on description + voice transcript
  combined <- paste(
    ifelse(is.na(videos$video_description), "", videos$video_description),
    ifelse(is.na(videos$voice_to_text),     "", videos$voice_to_text)
  )
  lang <- vapply(combined, function(x) {
    if (nchar(str_squish(x)) < 20L) return("und")
    tryCatch(franc::franc(x, min_length = 20L), error = function(e) "und")
  }, character(1))
  videos <- videos[lang %in% c("ita", "und"), ]
  message(sprintf("    italian filter: %d/%d kept (%.0f%%)",
                  nrow(videos), n0, 100 * nrow(videos) / n0))
  videos
}

# ---- 30-day chunking -----------------------------------------------------

chunk_windows <- function(start_date, end_date, days = 30L) {
  starts <- seq(as.Date(start_date), as.Date(end_date), by = days)
  ends   <- pmin(starts + (days - 1L), as.Date(end_date))
  tibble(start = starts, end = ends)
}

fetch_window <- function(query, start_date, end_date, token, label = "",
                         pages_cap = NULL) {
  message(glue("[{label}] {start_date} → {end_date}"))
  paginate(query, start_date, end_date, token, pages_cap = pages_cap)
}

# ---- Corpus mode ---------------------------------------------------------

CORPUS_QUERIES <- list(
  trackA_esperia = list(
    and = list(
      list(operation = "IN", field_name = "region_code", field_values = list("IT")),
      list(or = list(
        list(operation = "IN", field_name = "keyword",      field_values = list("esperia", "esperia italia")),
        list(operation = "IN", field_name = "hashtag_name", field_values = list("esperia", "esperiaitalia",
                                                                                "politicaitaliana", "destrasovrana",
                                                                                "sovranita", "dallapartedegliitaliani"))
      ))
    )
  ),
  trackB_ai_deepfake = list(
    and = list(
      list(operation = "IN", field_name = "region_code", field_values = list("IT")),
      list(or = list(
        list(operation = "IN", field_name = "hashtag_name",
             field_values = list("deepfake", "intelligenzaartificiale", "ia",
                                 "fakenews", "disinformazione", "truffa")),
        list(operation = "IN", field_name = "keyword",
             field_values = list("meloni", "salvini", "schlein", "salis", "donzelli",
                                 "tajani", "santanche", "consob"))
      ))
    )
  ),
  # Track C: AI-slop targeting religious engagement. The canonical hashtag on
  # the engagement-bait Christian-AI variant is "#amen🙏" (with the praying-
  # hands emoji baked in); some posters also use the bare "#amen". Region-
  # filter to IT because both are overwhelmingly English-dominated globally.
  # Other Italian religious hashtags (#gesu, #fede, #preghiera, #miracolo)
  # can be added after seeing the initial result.
  trackC_ai_religious = list(
    and = list(
      list(operation = "IN", field_name = "region_code", field_values = list("IT")),
      list(operation = "IN", field_name = "hashtag_name",
           field_values = list("amen", "amen\U0001F64F"))
    )
  )
)

fetch_corpus <- function(start_date, end_date, out_dir, token,
                         tracks = names(CORPUS_QUERIES),
                         pages_cap = NULL) {
  dir_create(out_dir)
  windows <- chunk_windows(start_date, end_date)
  for (track in tracks) {
    track_dir <- path(out_dir, track)
    dir_create(track_dir)
    query <- CORPUS_QUERIES[[track]]
    for (i in seq_len(nrow(windows))) {
      w <- windows[i, ]
      out_path <- path(track_dir, glue("{format(w$start, '%Y%m%d')}_{format(w$end, '%Y%m%d')}.parquet"))
      if (file_exists(out_path)) {
        message(glue("[skip] {out_path}"))
        next
      }
      videos <- tryCatch(
        fetch_window(query, w$start, w$end, token,
                     label = glue("{track} {i}/{nrow(windows)}"),
                     pages_cap = pages_cap),
        error = function(e) {
          message(glue("[FAIL] {track} {i}/{nrow(windows)}: {conditionMessage(e)} — skipping window"))
          NULL
        }
      )
      if (is.null(videos) || nrow(videos) == 0L) next
      videos <- filter_italian(videos)
      if (nrow(videos) == 0L) {
        message(glue("  italian filter dropped all rows; skipping write"))
        next
      }
      videos <- mutate(videos, track = track,
                       window_start = w$start, window_end = w$end)
      write_parquet(videos, out_path)
      message(glue("  wrote {nrow(videos)} rows → {out_path}"))
    }
  }
  invisible()
}

# ---- Accounts mode -------------------------------------------------------

fetch_accounts <- function(accounts_csv, start_date, end_date, out_dir, token,
                           clusters = NULL, corpus_skip_threshold = 0L) {
  dir_create(out_dir)
  accts <- read_csv(accounts_csv, show_col_types = FALSE)
  if (!is.null(clusters)) accts <- filter(accts, cluster %in% clusters)
  windows <- chunk_windows(start_date, end_date)

  # Skip accounts already well-represented in the existing corpus
  if (corpus_skip_threshold > 0L) {
    corpus_dir <- here("data-raw", "corpus_videos")
    corpus_files <- if (dir_exists(corpus_dir))
      dir_ls(corpus_dir, recurse = TRUE, glob = "*.parquet") else character()
    if (length(corpus_files) > 0L) {
      corpus_counts <- bind_rows(lapply(corpus_files, function(f) {
        d <- arrow::read_parquet(f, col_select = c("username"))
        data.frame(username = d$username)
      })) |>
        dplyr::count(username, name = "n_in_corpus")
      well_covered <- corpus_counts$username[corpus_counts$n_in_corpus >= corpus_skip_threshold]
      n_skip <- sum(accts$username %in% well_covered)
      if (n_skip > 0L) {
        message(glue("[corpus-skip] {n_skip} account(s) already have ≥{corpus_skip_threshold} posts in corpus; skipping API fetch:"))
        for (u in intersect(accts$username, well_covered)) message("  - @", u)
        accts <- filter(accts, !username %in% well_covered)
      }
    }
  }

  for (i in seq_len(nrow(accts))) {
    acct <- accts[i, ]
    out_path <- path(out_dir, glue("{acct$username}.parquet"))
    if (file_exists(out_path)) {
      message(glue("[skip] {out_path}"))
      next
    }
    message(glue("[{i}/{nrow(accts)}] @{acct$username} ({acct$cluster})"))
    pages <- list()
    for (j in seq_len(nrow(windows))) {
      w <- windows[j, ]
      query <- list(
        and = list(
          list(operation = "IN", field_name = "username",
               field_values = list(acct$username))
        )
      )
      videos <- tryCatch(
        fetch_window(query, w$start, w$end, token,
                     label = glue("@{acct$username} {j}/{nrow(windows)}")),
        error = function(e) {
          message(glue("[FAIL] @{acct$username} {j}/{nrow(windows)}: {conditionMessage(e)} — skipping window"))
          NULL
        }
      )
      if (!is.null(videos) && nrow(videos) > 0L) pages[[j]] <- videos
    }
    if (length(pages) == 0L) next
    out <- bind_rows(pages)
    out <- filter_italian(out)
    if (nrow(out) == 0L) {
      message(glue("  italian filter dropped all rows for @{acct$username}; skipping write"))
      next
    }
    out <- mutate(out, cluster = acct$cluster, source = acct$source)
    write_parquet(out, out_path)
    message(glue("  wrote {nrow(out)} rows → {out_path}"))
  }
  invisible()
}

# ---- CLI -----------------------------------------------------------------

opts <- list(
  make_option(c("-m", "--mode"), type = "character", default = "corpus",
              help = "corpus | accounts"),
  make_option("--start", type = "character", default = "2025-09-01",
              help = "Start date YYYY-MM-DD [default %default]"),
  make_option("--end", type = "character", default = "2026-04-30",
              help = "End date YYYY-MM-DD [default %default]"),
  make_option("--accounts-csv", type = "character",
              default = "data-raw/account_clusters.csv",
              help = "Path to accounts CSV [accounts mode]"),
  make_option("--clusters", type = "character", default = NULL,
              help = "Comma-separated clusters to fetch (accounts mode)"),
  make_option("--out-dir", type = "character", default = NULL,
              help = "Output directory (defaults to data-raw/<mode>_videos/)"),
  make_option("--tracks", type = "character", default = NULL,
              help = "Comma-separated track names (corpus mode)"),
  make_option("--max-pages", type = "integer", default = NULL,
              help = "Cap pagination per window to N pages (corpus mode); save calls"),
  make_option("--corpus-skip-threshold", type = "integer", default = 0L,
              help = "Accounts mode: skip accounts with ≥N posts already in data-raw/corpus_videos/"),
  make_option("--dry-run", action = "store_true", default = FALSE,
              help = "Print plan without making API calls")
)

main <- function(argv = commandArgs(trailingOnly = TRUE)) {
  opt <- parse_args(OptionParser(option_list = opts), args = argv)
  start_date <- as.Date(opt$start)
  end_date   <- as.Date(opt$end)

  if (opt$`dry-run`) {
    cat("DRY RUN — would run with:\n")
    str(opt)
    cat("Windows:\n")
    print(chunk_windows(start_date, end_date))
    return(invisible())
  }

  token <- tiktok_token()

  if (opt$mode == "corpus") {
    out_dir <- opt$`out-dir` %||% here("data-raw", "corpus_videos")
    tracks  <- if (!is.null(opt$tracks)) strsplit(opt$tracks, ",")[[1]]
               else names(CORPUS_QUERIES)
    fetch_corpus(start_date, end_date, out_dir, token,
                 tracks = tracks, pages_cap = opt$`max-pages`)
  } else if (opt$mode == "accounts") {
    out_dir  <- opt$`out-dir` %||% here("data-raw", "raw_videos")
    clusters <- if (!is.null(opt$clusters)) strsplit(opt$clusters, ",")[[1]] else NULL
    fetch_accounts(here(opt$`accounts-csv`), start_date, end_date,
                   out_dir, token, clusters = clusters,
                   corpus_skip_threshold = opt$`corpus-skip-threshold`)
  } else {
    stop("Unknown --mode: ", opt$mode)
  }
}

if (!interactive()) main()
