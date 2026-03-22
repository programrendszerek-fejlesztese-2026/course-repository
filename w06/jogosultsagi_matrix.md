# Receptgyűjtemény – CRUD jogosultsági mátrix

## Szerepkörök

| Jelölés | Szerepkör | Leírás |
|---------|-----------|--------|
| **Admin** | Adminisztrátor | Előre regisztrált fiók (seed adat) |
| **User** | Felhasználó | Regisztrációs felületen keresztül létrehozott fiók |
| **Guest** | Vendég | Nem bejelentkezett látogató |

## Jelölések

- ✅ – Teljes hozzáférés
- 🔒 – Csak saját erőforrásra vonatkozik
- ❌ – Nincs hozzáférés

---

## 1. Kategóriák (`/api/categories`)

| Művelet | Admin | User | Guest |
|---------|-------|------|-------|
| **Create** – Új kategória létrehozása | ✅ | ❌ | ❌ |
| **Read** – Kategóriák listázása | ✅ | ✅ | ✅ |
| **Update** – Kategória módosítása | ✅ | ❌ | ❌ |
| **Delete** – Kategória törlése | ✅ | ❌ | ❌ |

> Middleware: `authMiddleware` + `roleMiddleware('admin')` a CUD műveletekre.

---

## 2. Receptek (`/api/recipes`)

| Művelet | Admin | User | Guest |
|---------|-------|------|-------|
| **Create** – Új recept létrehozása | ✅ | ❌ | ❌ |
| **Read** – Receptek böngészése, részletek | ✅ | ✅ | ✅ |
| **Update** – Recept módosítása | ✅ | ❌ | ❌ |
| **Delete** – Recept törlése | ✅ | ❌ | ❌ |

> Middleware: `authMiddleware` + `roleMiddleware('admin')` a CUD műveletekre.

---

## 3. Hozzávalók (`/api/recipes/:id/ingredients`)

| Művelet | Admin | User | Guest |
|---------|-------|------|-------|
| **Create** – Hozzávaló hozzáadása recepthez | ✅ | ❌ | ❌ |
| **Read** – Hozzávalók megtekintése | ✅ | ✅ | ✅ |
| **Update** – Hozzávaló módosítása | ✅ | ❌ | ❌ |
| **Delete** – Hozzávaló törlése | ✅ | ❌ | ❌ |

> Middleware: `authMiddleware` + `roleMiddleware('admin')` a CUD műveletekre. A hozzávalók a recepthez kötöttek, az admin a recept részeként kezeli őket.

---

## 4. Értékelések (`/api/reviews`)

| Művelet | Admin | User | Guest |
|---------|-------|------|-------|
| **Create** – Értékelés írása recepthez | ❌ | ✅ | ❌ |
| **Read** – Értékelések megtekintése | ✅ | ✅ | ✅ |
| **Update** – Értékelés módosítása | ❌ | 🔒 | ❌ |
| **Delete** – Értékelés törlése | ✅ | 🔒 | ❌ |

> **Admin**: moderátorként bármely értékelést törölheti, de nem ír és nem módosít értékeléseket.
> **User**: csak a saját értékelését módosíthatja és törölheti (ABAC ellenőrzés: `req.user.id === review.userId`).
> Middleware: `authMiddleware` a Create/Update/Delete műveletekre; Delete esetén az admin számára `roleMiddleware('admin')` VAGY tulajdonos-ellenőrzés a handler-ben.

---

## 5. Felhasználók / Autentikáció (`/api/auth`)

| Művelet | Admin | User | Guest |
|---------|-------|------|-------|
| **Regisztráció** (`POST /register`) | ❌ | ❌ | ✅ |
| **Bejelentkezés** (`POST /login`) | ✅ | ✅ | ❌ |

> A regisztráció csak vendégeknek elérhető (új fiók létrehozása). A bejelentkezés minden regisztrált felhasználónak (admin és user egyaránt).

---

## Összefoglaló – Middleware alkalmazás

| Végpont | Middleware lánc |
|---------|-----------------|
| `GET /api/categories` | – (nyilvános) |
| `POST/PUT/DELETE /api/categories` | `authMiddleware` → `roleMiddleware('admin')` |
| `GET /api/recipes` | – (nyilvános) |
| `POST/PUT/DELETE /api/recipes` | `authMiddleware` → `roleMiddleware('admin')` |
| `GET /api/reviews` | – (nyilvános) |
| `POST /api/reviews` | `authMiddleware` |
| `PUT /api/reviews/:id` | `authMiddleware` → tulajdonos-ellenőrzés handler-ben |
| `DELETE /api/reviews/:id` | `authMiddleware` → admin VAGY tulajdonos ellenőrzés |
| `POST /api/auth/register` | – (nyilvános) |
| `POST /api/auth/login` | – (nyilvános) |
