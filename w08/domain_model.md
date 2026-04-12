# Domain model

This document describes the current data model inferred from the in-memory repository files under `server/repositories`.

**Collections**

- **users**
  - Description: Application users with roles and hashed passwords.
  - Example source: `server/repositories/userRepository.js`
  - Fields:
    - `id` (string) — application ID (stored as string in repositories)
    - `username` (string)
    - `email` (string)
    - `role` (string) — e.g. `admin`, `user`
    - `password` (string) — bcrypt hash (store only hashed passwords)
    - `createdAt` (Date / ISO timestamp)
  - Notes: `password` values must be bcrypt hashes (existing code uses `bcrypt.hashSync(..., 10)`).

- **categories**
  - Description: Recipe categories.
  - Example source: `server/repositories/categoryRepository.js`
  - Fields:
    - `id` (string)
    - `name` (string)
    - `description` (string)
  - Notes: Small static-like lookup collection.

- **recipes**
  - Description: Recipe documents.
  - Example source: `server/repositories/recipeRepository.js`
  - Fields:
    - `id` (string)
    - `title` (string)
    - `description` (string)
    - `categoryId` (string) — references `categories.id`
    - `ingredients` (array of objects) — each: `{ name: string, quantity: string }`
    - `createdBy` (string) — references `users.id`
    - `createdAt` (Date / ISO timestamp)
  - Notes: `categoryId` and `createdBy` should be stored as references (ObjectId in a Mongo migration) or kept as string IDs consistently.

- **ratings**
  - Description: User ratings for recipes.
  - Example source: `server/repositories/ratingRepository.js`
  - Fields:
    - `id` (string)
    - `userId` (string) — references `users.id`
    - `recipeId` (string) — references `recipes.id`
    - `score` (number)
    - `comment` (string)
    - `createdAt` (Date / ISO timestamp)
  - Notes: `userId` and `recipeId` are relational references; prefer ObjectId references in MongoDB for joins/lookup.

**Reference usage / recommendations**

- Current code uses string IDs in-memory. When moving to MongoDB:
  - Either continue using string IDs (keep compatibility) or convert to MongoDB ObjectId for natural Mongo relations.
  - For relations (recipes.createdBy, recipes.categoryId, ratings.userId, ratings.recipeId) prefer storing ObjectId references and create appropriate indexes for queries (e.g., index `createdBy`, `categoryId`, `recipeId`).

- Password handling:
  - Never store plain-text passwords. Store bcrypt hashes as currently done in `userRepository.js`.
  - When seeding data (init script), insert the already-hashed values (as implemented in `server/docker-init/mongo-init.js`).

**Collections-to-create mapping (seed data present)**

- `users` — seeded with admin and demo user (bcrypt-hashed passwords).
- `categories` — seeded with three categories: Leves, Főétel, Desszert.
- `recipes` — seeded with three sample recipes referencing categories and users.
- `ratings` — seeded with two sample ratings referencing recipes and users.

If you want, I can:
- convert repository layers to use MongoDB (replace in-memory arrays with a Mongoose or native Mongo layer), or
- migrate IDs to ObjectId and update services/routes accordingly.
