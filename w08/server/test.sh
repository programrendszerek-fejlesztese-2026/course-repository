#!/usr/bin/env bash
set -euo pipefail

# Simple test script for JWT/bcrypt endpoints
# Usage: 
#   cd server
#   ./test.sh
# Optionally set BASE_URL env var, e.g. BASE_URL=http://localhost:3000/api ./test.sh

BASE_URL=${BASE_URL:-http://localhost:3000/api}

if ! command -v jq >/dev/null 2>&1; then
  echo "Warning: 'jq' not found. Outputs will not be pretty-printed and token extraction may fail."
fi

echo "Base URL: $BASE_URL"

echo
echo "1) Register tester"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.hu","password":"titok"}' | jq . || true

echo
echo "2) Login tester and save token"
USER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.hu","password":"titok"}' | jq -r '.token')
echo "USER_TOKEN=$USER_TOKEN"

echo
echo "3) Admin login (seed admin)"
ADMIN_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@recept.hu","password":"admin123"}' | jq -r '.token')
echo "ADMIN_TOKEN=$ADMIN_TOKEN"

echo
echo "4) Admin creates a category (should succeed)"
curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"TesztKategória"}' | jq . || true

echo
echo "5) Admin creates a recipe (use categoryId '1' if exists)"
curl -s -X POST "$BASE_URL/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"title":"TesztRecept","description":"Leírás","categoryId":"1","ingredients":[{"name":"víz","quantity":"1 l"}],"instructions":"Főzd."}' | jq . || true

echo
echo "6) User creates a rating for recipeId=1"
RATING_JSON=$(curl -s -X POST "$BASE_URL/ratings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"recipeId":"1","score":5,"comment":"Nagyon jó!"}')
echo "$RATING_JSON" | jq . || true
RATING_ID=$(echo "$RATING_JSON" | jq -r '.id')
echo "RATING_ID=$RATING_ID"

echo
echo "7) Owner updates their rating"
curl -s -X PUT "$BASE_URL/ratings/$RATING_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"score":4,"comment":"Kicsit módosítva."}' | jq . || true

echo
echo "8) Register another user and try to edit the rating (should fail 403)"
curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d '{"username":"masik","email":"masik@example.hu","password":"titok2"}' | jq . || true
OTHER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"masik@example.hu","password":"titok2"}' | jq -r '.token')
echo "OTHER_TOKEN=$OTHER_TOKEN"
curl -i -s -X PUT "$BASE_URL/ratings/$RATING_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OTHER_TOKEN" \
  -d '{"score":1,"comment":"Nem az én értékelésem."}' | sed -n '1,200p' || true

echo
echo "9) Owner deletes their rating"
curl -s -X DELETE "$BASE_URL/ratings/$RATING_ID" -H "Authorization: Bearer $USER_TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo
echo "Done."