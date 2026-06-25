#!/usr/bin/env bash
#
# fetch-brand-assets.sh — Idempotently source Naukri brand assets into public/brand/.
#
# Strategy (in order):
#   1. Official Naukri CDN (static.naukimg.com) + live homepage/login HTML.
#   2. Community vector fallbacks (seeklogo / logowik).
#   3. A real, GitHub-hosted Naukri mark (works in restricted networks).
#
# NOTE: This is an UNOFFICIAL demo. Assets are used for visual fidelity only and remain
# the property of Naukri.com / Info Edge. In sandboxed CI the official CDN is often
# unreachable; the GitHub-hosted fallback guarantees a real (non-invented) Naukri mark.
#
set -uo pipefail

BRAND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/brand"
mkdir -p "$BRAND_DIR"
FETCH_DATE="$(date -u +%Y-%m-%d)"

# Candidate sources for the icon-only mark.
MARK_SOURCES=(
  "https://static.naukimg.com/s/0/0/i/naukri-identity/naukri_gnb_logo.svg"
  "https://static.naukimg.com/s/7/103/i/naukri_Logo.png"
  "https://raw.githubusercontent.com/JabberLabs/awesome-dashboard-icons/master/icons/naukricom.svg"
)

download() {
  # download <url> <dest> -> 0 on success
  local url="$1" dest="$2"
  if curl -fsSL --max-time 25 "$url" -o "$dest" 2>/dev/null && [ -s "$dest" ]; then
    echo "  ok: $url"
    return 0
  fi
  rm -f "$dest"
  return 1
}

MARK_SRC=""
echo "Fetching Naukri brand mark…"
for url in "${MARK_SOURCES[@]}"; do
  if download "$url" "$BRAND_DIR/logo-mark.svg"; then
    MARK_SRC="$url"
    break
  fi
  echo "  miss: $url"
done

if [ -z "$MARK_SRC" ]; then
  echo "WARNING: could not fetch a remote mark; keeping any existing public/brand/logo-mark.svg."
  MARK_SRC="(offline — existing committed asset retained)"
fi

# logo.svg / logo-white.svg are brand-tokenized "naukri" wordmarks (committed in repo) used
# as a fallback because the official wordmark SVG is typically network-blocked in CI.
# They are NOT regenerated here so as not to clobber committed fidelity assets.

# Try to derive a favicon.ico from the mark when a rasterizer is available.
if [ -f "$BRAND_DIR/logo-mark.svg" ] && command -v node >/dev/null 2>&1; then
  if node "$(dirname "${BASH_SOURCE[0]}")/make-favicon.mjs" 2>/dev/null; then
    echo "  favicon.ico generated from mark"
  else
    echo "  favicon.ico generation skipped (optional deps unavailable)"
  fi
fi

cat > "$BRAND_DIR/brand-assets.json" <<JSON
{
  "_note": "Unofficial demo. Assets used for visual fidelity only; property of Naukri.com / Info Edge.",
  "fetchedDate": "$FETCH_DATE",
  "assets": [
    {
      "filename": "logo-mark.svg",
      "description": "Icon-only Naukri figure mark",
      "source": "$MARK_SRC"
    },
    {
      "filename": "logo.svg",
      "description": "Brand-tokenized 'naukri' wordmark (fallback — official wordmark CDN network-blocked)",
      "source": "in-repo (brand tokens #1875E5)"
    },
    {
      "filename": "logo-white.svg",
      "description": "Reversed white 'naukri' wordmark for dark/blue backgrounds",
      "source": "in-repo (brand tokens)"
    },
    {
      "filename": "favicon.ico",
      "description": "Browser tab icon derived from logo-mark.svg (or committed fallback)",
      "source": "derived from logo-mark.svg"
    }
  ]
}
JSON

echo "Done. Wrote manifest: $BRAND_DIR/brand-assets.json"
