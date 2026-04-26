# Frontend: modul- és komponens terv

Ez a dokumentum a Receptgyűjtemény kliens-oldali Angular alkalmazásának modul- és komponens-tervét tartalmazza a `receptgyujtemeny_specifikacio.md` alapján.

## Összefoglaló

- Moduláris felépítés lazy-loaded feature modulokkal a gyors indulás és jól elkülöníthető felelősségek érdekében.
- Fő célok: recept böngészés/részletek, értékelések kezelése, admin CRUD kategóriákra és receptekre, autentikáció JWT-vel.

## Fő modulok

### AppModule
- Gyökérmodul; importálja a `CoreModule`, `SharedModule`, `AppRoutingModule`; bootstrap.

### CoreModule
- Singleton szolgáltatások és app-szintű elemek: `AuthService`, `NotificationService`, `AuthInterceptor`, `ErrorInterceptor`, `AuthGuard`, `AdminGuard`.
- Globális komponensek: `HeaderComponent`, `FooterComponent`.
- Csak egyszer importálandó (AppModule-ban).

### SharedModule
- Újrafelhasználható UI elemek és Angular Material export: `MaterialModule`, `RecipeCardComponent`, `CategoryChipComponent`, `RatingStarsComponent`, `ConfirmDialogComponent`.
- Exportálja a `CommonModule`, `ReactiveFormsModule` és gyakran használt pipe-okat/directive-okat.

### AuthModule
- Route-ok: `/auth/login`, `/auth/register`.
- Komponensek: `LoginComponent`, `RegisterComponent`.
- Szolgáltatás: `AuthService` (login/register, token kezelés).

### RecipesModule (lazy)
- Route-ok: `/recipes`, `/recipes/:id`, `/recipes/new`, `/recipes/:id/edit`.
- Komponensek: `RecipeListComponent`, `RecipeDetailComponent`, `RecipeFormComponent` (create/edit, admin védett), `IngredientListComponent`, `RecipeSearchComponent`, `RecipeCardComponent` (shared).
- Szolgáltatások: `RecipeService`.
- Segédfunkciók: `RecipeResolver` a részletoldalhoz, pagination és filter komponensek.

### CategoriesModule
- Komponensek: `CategoryListComponent` (admin CRUD), `CategoryFormComponent`, `CategoryFilterComponent` (nyilvános szűréshez).
- Szolgáltatás: `CategoryService`.

### RatingsModule
- Komponensek: `RatingFormComponent` (1–5 + komment), `RatingListComponent`, `RatingItemComponent`.
- Szolgáltatás: `RatingService`.
- Jogosultságok: bejelentkezett felhasználó hozhat létre/ módosíthat/ törölhet saját értékelést; admin teljes moderáció.

### AdminModule (lazy, `/admin`)
- Komponensek: `AdminDashboardComponent`, `RecipeManagementComponent`, `CategoryManagementComponent`, `RatingModerationComponent`.
- Védve `AdminGuard`-dal.

### UserModule
- Komponensek: `ProfileComponent`, `MyRatingsComponent`.
- Szolgáltatás: `UserService`.

## Adatmodellek (interfaces)

- `Recipe` { id, title, description, ingredients: Ingredient[], categoryId, authorId, createdAt, updatedAt }
- `Ingredient` { name, quantity, unit }
- `Category` { id, name }
- `Rating` { id, recipeId, userId, score, comment, createdAt }
- `User` { id, username, email, roles: string[] }

## Szolgáltatások (röviden)

- `AuthService` — login/register, token kezelés (localStorage/session), token refresh ha szükséges.
- `RecipeService` — listázás, szűrés, részlet, létrehozás, módosítás, törlés.
- `CategoryService` — kategória CRUD és nyilvános lista.
- `RatingService` — értékelés létrehozás/módosítás/törlés, admin moderáció.
- `UserService` — profil, saját értékelések lekérése.
- `NotificationService` — snackbar/alert wrapper.

## Guardok és interceptorok

- `AuthInterceptor` — JWT hozzáadása minden kimenő kéréshez.
- `ErrorInterceptor` — egységes hibakezelés és hibaüzenetek átadása `NotificationService`-nek.
- `LoadingInterceptor` (opcionális) — globális betöltés indikátor.
- `AuthGuard` — a bejelentkezést ellenőrzi.
- `AdminGuard` — role-based hozzáférés (admin).

## Routing (fő útvonal-mapping)

- `/` → redirect `/recipes` vagy `HomeComponent` (RecipeList)
- `/recipes` → `RecipeListComponent`
- `/recipes/:id` → `RecipeDetailComponent` (resolver használata ajánlott)
- `/recipes/new` → `RecipeFormComponent` (admin)
- `/auth/login`, `/auth/register` → AuthModule
- `/admin` → AdminModule (aloldalak: `/admin/categories`, `/admin/recipes`, `/admin/ratings`)
- `/profile` → `ProfileComponent`

## UI / technikai megjegyzések

- Használjuk az Angular Material komponenseit (Shared `MaterialModule`).
- Űrlapok: `ReactiveFormsModule` és `FormArray` a hozzávalók dinamikus kezeléséhez.
- Lazy-loading a `RecipesModule` és `AdminModule`-hoz a kisebb kezdő bundle-ért.
- Állapot: kezdetben szolgáltatás alapú (BehaviorSubject), később szükség esetén NgRx bevezetése.
- Tesztelés: komponens- és szolgáltatás tesztek (Vitest/Karma/Jest projekt konzisztenciája alapján).
- Reszponzív kialakítás: Material + Flexbox/CSS Grid.

## Javasolt fájlszerkezet a `src/app` alatt

```
app/
├─ core/
│  ├─ services/
│  ├─ interceptors/
│  └─ header/, footer/
├─ shared/
│  ├─ components/ (RecipeCard, RatingStars...)
│  └─ material.module.ts
├─ auth/
│  ├─ login/, register/
├─ recipes/
│  ├─ list/, detail/, form/, components/
├─ categories/
├─ ratings/
├─ admin/
└─ user/
```

## Következő lépések

1. Jóváhagynád-e a tervet?
2. Ha igen: generálhatom a modul- és komponens-skeletonokat Angular CLI-vel (file-ok, routing, lazy-loading), vagy először csak a mappastruktúrát szeretnéd?

---
Dokumentum generálva a specifikáció alapján. Ha szeretnéd, létrehozom a scaffoldot is.
