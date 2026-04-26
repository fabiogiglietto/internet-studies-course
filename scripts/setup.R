#!/usr/bin/env Rscript

needed <- c(
  "httr2", "traktok", "cld3", "arrow", "stringdist", "optparse",
  "dplyr", "tidyr", "readr", "purrr", "igraph", "glue", "jsonlite",
  "lubridate", "fs", "here"
)

missing <- needed[!vapply(needed, requireNamespace, logical(1), quietly = TRUE)]

if (length(missing) == 0) {
  message("All packages already installed.")
  quit(status = 0)
}

message("Installing: ", paste(missing, collapse = ", "))

cran <- intersect(missing, c(
  "httr2", "cld3", "arrow", "stringdist", "optparse",
  "dplyr", "tidyr", "readr", "purrr", "igraph", "glue", "jsonlite",
  "lubridate", "fs", "here"
))

if (length(cran)) {
  install.packages(cran, repos = "https://cloud.r-project.org")
}

if ("traktok" %in% missing) {
  if (!requireNamespace("remotes", quietly = TRUE)) {
    install.packages("remotes", repos = "https://cloud.r-project.org")
  }
  remotes::install_github("JBGruber/traktok")
}

still_missing <- needed[!vapply(needed, requireNamespace, logical(1), quietly = TRUE)]
if (length(still_missing)) {
  stop("Failed to install: ", paste(still_missing, collapse = ", "))
}
message("Setup complete.")
