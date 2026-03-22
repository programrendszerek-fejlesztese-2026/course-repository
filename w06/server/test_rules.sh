#!/usr/bin/env bash
set -u

BASE_URL=${BASE_URL:-http://localhost:4000/api}

if ! command -v jq >/dev/null 2>&1; then
  echo "Please install 'jq' to run this script (used to parse JSON)."
  exit 1
fi

echo "Base URL: $BASE_URL"

run_request() {
  local method=$1; shift
  local url=$1; shift
  local data=$1; shift
  local token=$1; shift

  local auth_hdr=()
  if [ -n "$token" ]; then
    auth_hdr=( -H "Authorization: Bearer $token" )
  fi

  if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
    HTTP_BODY=$(curl -s -o /tmp/resp.$$ -w "%{http_code}" -X "$method" "$url" "${auth_hdr[@]}")
  else
    HTTP_BODY=$(curl -s -o /tmp/resp.$$ -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" "${auth_hdr[@]}" -d "$data")
  fi
  local status=$HTTP_BODY
  local body
  body=$(cat /tmp/resp.$$)
  rm -f /tmp/resp.$$
  echo "$status|$body"
}

expect() {
  local descr=$1; shift
  local method=$1; shift
  local path=$1; shift
  local data=$1; shift
  local token=$1; shift
  local expected=$1; shift

  printf "%-60s" "$descr"
  res=$(run_request "$method" "$BASE_URL$path" "$data" "$token")
  status=${res%%|*}
  body=${res#*|}
  if [ "$status" = "$expected" ]; then
    echo " PASS ($status)"
  else
    echo " FAIL (got $status, expected $expected)"
    echo "  Response body: $body" | sed 's/^/    /'
  fi
}

echo
echo "== Obtain tokens for seed users =="
ADMIN_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@recept.hu","password":"admin123"}' | jq -r '.token')
USER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"pista@recept.hu","password":"pista123"}' | jq -r '.token')
echo "ADMIN_TOKEN=${ADMIN_TOKEN:0:10}..."
echo "USER_TOKEN=${USER_TOKEN:0:10}..."

echo
echo "== Categories (/api/categories) =="
expect "GET categories as guest" GET "/categories" "" "" 200
expect "GET categories as user" GET "/categories" "" "$USER_TOKEN" 200
expect "GET categories as admin" GET "/categories" "" "$ADMIN_TOKEN" 200

CAT_DATA='{"name":"TesztKategória-roles","description":"teszt"}'
res=$(run_request POST "$BASE_URL/categories" "$CAT_DATA" "$ADMIN_TOKEN")
CAT_STATUS=${res%%|*}
CAT_BODY=${res#*|}
CAT_ID=$(echo "$CAT_BODY" | jq -r '.id // empty')
if [ -n "$CAT_ID" ]; then echo "Created category id: $CAT_ID (status $CAT_STATUS)"; else echo "Admin create category returned $CAT_STATUS"; fi

expect "POST category as admin (should allow)" POST "/categories" "$CAT_DATA" "$ADMIN_TOKEN" 201
expect "POST category as user (should deny)" POST "/categories" "$CAT_DATA" "$USER_TOKEN" 403
expect "POST category as guest (should deny 401)" POST "/categories" "$CAT_DATA" "" 401

if [ -n "$CAT_ID" ]; then
  UPD_DATA='{"name":"Updated-by-admin"}'
  expect "PUT category as admin" PUT "/categories/$CAT_ID" "$UPD_DATA" "$ADMIN_TOKEN" 200
  expect "PUT category as user (deny)" PUT "/categories/$CAT_ID" "$UPD_DATA" "$USER_TOKEN" 403
  expect "PUT category as guest (401)" PUT "/categories/$CAT_ID" "$UPD_DATA" "" 401

  expect "DELETE category as user (deny)" DELETE "/categories/$CAT_ID" "" "$USER_TOKEN" 403
  expect "DELETE category as guest (401)" DELETE "/categories/$CAT_ID" "" "" 401
  expect "DELETE category as admin" DELETE "/categories/$CAT_ID" "" "$ADMIN_TOKEN" 204
fi

echo
echo "== Recipes (/api/recipes) =="
expect "GET recipes as guest" GET "/recipes" "" "" 200
expect "GET recipes as user" GET "/recipes" "" "$USER_TOKEN" 200
expect "GET recipes as admin" GET "/recipes" "" "$ADMIN_TOKEN" 200

RECIPE_DATA='{"title":"TesztRecept-roles","description":"leírás","categoryId":"1","ingredients":[{"name":"víz","quantity":"1 l"}],"instructions":"Főzd."}'
res=$(run_request POST "$BASE_URL/recipes" "$RECIPE_DATA" "$ADMIN_TOKEN")
RECIPE_STATUS=${res%%|*}
RECIPE_BODY=${res#*|}
RECIPE_ID=$(echo "$RECIPE_BODY" | jq -r '.id // empty')
if [ -n "$RECIPE_ID" ]; then echo "Created recipe id: $RECIPE_ID (status $RECIPE_STATUS)"; else echo "Admin create recipe returned $RECIPE_STATUS"; fi

expect "POST recipe as admin (allow)" POST "/recipes" "$RECIPE_DATA" "$ADMIN_TOKEN" 201
expect "POST recipe as user (deny)" POST "/recipes" "$RECIPE_DATA" "$USER_TOKEN" 403
expect "POST recipe as guest (401)" POST "/recipes" "$RECIPE_DATA" "" 401

if [ -n "$RECIPE_ID" ]; then
  RECIPE_UPD='{"title":"Updated Recipe"}'
  expect "PUT recipe as admin" PUT "/recipes/$RECIPE_ID" "$RECIPE_UPD" "$ADMIN_TOKEN" 200
  expect "PUT recipe as user (deny)" PUT "/recipes/$RECIPE_ID" "$RECIPE_UPD" "$USER_TOKEN" 403
  expect "PUT recipe as guest (401)" PUT "/recipes/$RECIPE_ID" "$RECIPE_UPD" "" 401

  expect "DELETE recipe as user (deny)" DELETE "/recipes/$RECIPE_ID" "" "$USER_TOKEN" 403
  expect "DELETE recipe as guest (401)" DELETE "/recipes/$RECIPE_ID" "" "" 401
  expect "DELETE recipe as admin" DELETE "/recipes/$RECIPE_ID" "" "$ADMIN_TOKEN" 204
fi

echo
echo "== Ingredients (/api/recipes/:id/ingredients) =="
if [ -n "$RECIPE_ID" ]; then
  # check if endpoint exists
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/recipes/$RECIPE_ID/ingredients")
  if [ "$code" = "404" ]; then
    echo "SKIP ingredients: endpoint not implemented (404)"
  else
    ING_DATA='{"name":"só","quantity":"1 kk"}'
    expect "POST ingredient as admin" POST "/recipes/$RECIPE_ID/ingredients" "$ING_DATA" "$ADMIN_TOKEN" 201
    expect "POST ingredient as user (deny)" POST "/recipes/$RECIPE_ID/ingredients" "$ING_DATA" "$USER_TOKEN" 403
    expect "GET ingredients as guest" GET "/recipes/$RECIPE_ID/ingredients" "" "" 200
  fi
else
  echo "SKIP ingredients tests (no recipe id available)"
fi

echo
echo "== Ratings (reviews) (/api/ratings) =="
expect "GET ratings as guest" GET "/ratings" "" "" 200
expect "GET ratings as user" GET "/ratings" "" "$USER_TOKEN" 200
expect "GET ratings as admin" GET "/ratings" "" "$ADMIN_TOKEN" 200

# Create a rating as user
RATE_DATA='{"recipeId":"1","score":5,"comment":"Teszt értékelés"}'
res=$(run_request POST "$BASE_URL/ratings" "$RATE_DATA" "$USER_TOKEN")
RATE_STATUS=${res%%|*}
RATE_BODY=${res#*|}
RATE_ID=$(echo "$RATE_BODY" | jq -r '.id // empty')
if [ -n "$RATE_ID" ]; then echo "Created rating id: $RATE_ID (status $RATE_STATUS)"; else echo "User create rating returned $RATE_STATUS"; fi

expect "POST rating as user (allow)" POST "/ratings" "$RATE_DATA" "$USER_TOKEN" 201
expect "POST rating as admin (deny per matrix)" POST "/ratings" "$RATE_DATA" "$ADMIN_TOKEN" 403
expect "POST rating as guest (401)" POST "/ratings" "$RATE_DATA" "" 401

if [ -n "$RATE_ID" ]; then
  # Owner updates
  UP_RATE='{"score":4}'
  expect "PUT rating as owner (user)" PUT "/ratings/$RATE_ID" "$UP_RATE" "$USER_TOKEN" 200
  expect "PUT rating as admin (deny per matrix)" PUT "/ratings/$RATE_ID" "$UP_RATE" "$ADMIN_TOKEN" 403

  # Create another user to test non-owner
  TS=$(date +%s)
  curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d '{"username":"other'$TS'","email":"other'$TS'@example.hu","password":"titok"}' >/dev/null
  OTHER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"other'$TS'@example.hu","password":"titok"}' | jq -r '.token')
  expect "PUT rating as non-owner (deny)" PUT "/ratings/$RATE_ID" "$UP_RATE" "$OTHER_TOKEN" 403

  expect "DELETE rating as non-owner (deny)" DELETE "/ratings/$RATE_ID" "" "$OTHER_TOKEN" 403
  expect "DELETE rating as guest (401)" DELETE "/ratings/$RATE_ID" "" "" 401
  expect "DELETE rating as admin (allow)" DELETE "/ratings/$RATE_ID" "" "$ADMIN_TOKEN" 204
fi

echo
echo "== Auth endpoints =="
TS=$(date +%s)
NEW_EMAIL="guest${TS}@example.hu"
REG_DATA='{"username":"guesttest","email":"'"$NEW_EMAIL"'","password":"pw"}'
expect "Register as guest (allow)" POST "/auth/register" "$REG_DATA" "" 201

expect "Login as admin" POST "/auth/login" '{"email":"admin@recept.hu","password":"admin123"}' "" 200
expect "Login as user" POST "/auth/login" '{"email":"pista@recept.hu","password":"pista123"}' "" 200

echo
echo "All done. Note: some expected failures are per your permission matrix and might differ from current server behavior."
