#!/usr/bin/env bash
set -eu

BASE_URL=${BASE_URL:-http://localhost:3000/api}
Q=${1:-Gulyásleves}

if ! command -v jq >/dev/null 2>&1; then
  echo "Please install 'jq' to run this script."
  exit 1
fi

echo "Searching for: $Q"
res=$(curl -s -w "%{http_code}" "$BASE_URL/recipes/search?q=$(printf '%s' "$Q" | jq -s -R -r @uri)")
status=${res: -3}
body=${res:0:-3}

echo "HTTP $status"
echo "$body" | jq . || true

if [ "$status" != "200" ]; then
  echo "Search failed (status $status)"
  exit 2
fi

count=$(echo "$body" | jq 'length')
if [ "$count" -eq 0 ]; then
  echo "No results found for '$Q'."
  exit 3
fi

echo "Found $count result(s)."
