const ratingRepo = require('../repositories/ratingRepository');
const recipeRepo = require('../repositories/recipeRepository');

module.exports = {
  findAll() {
    return ratingRepo.findAll();
  },
  findById(id) {
    const rating = ratingRepo.findById(id);
    if (!rating) throw { status: 404, message: 'Értékelés nem található.' };
    return rating;
  },
  create(data) {
    if (!data.recipeId) {
      throw { status: 400, message: 'A recipeId kötelező.' };
    }
    const recipe = recipeRepo.findById(data.recipeId);
    if (!recipe) {
      throw { status: 400, message: 'A megadott recipeId nem létezik.' };
    }
    if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5) {
      throw { status: 400, message: 'A score 1–5 közötti egész szám lehet.' };
    }
    if (!data.userId) throw { status: 400, message: 'A userId kötelező.' };
    return ratingRepo.create(data);
  },

  update(id, data, actor) {
    if (data.score !== undefined) {
      if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5) {
        throw { status: 400, message: 'A score 1–5 közötti egész szám lehet.' };
      }
    }
    const existing = ratingRepo.findById(id);
    if (!existing) throw { status: 404, message: 'Értékelés nem található.' };
    // only owner can update (role-based checks removed)
    if (actor.id !== existing.userId) {
      throw { status: 403, message: 'Nincs jogosultsága módosítani ezt az értékelést.' };
    }
    const updated = ratingRepo.update(id, data);
    return updated;
  },
  delete(id, actor) {
    const existing = ratingRepo.findById(id);
    if (!existing) throw { status: 404, message: 'Értékelés nem található.' };
    // allow admin to delete any rating, otherwise only owner can delete
    if (actor.role !== 'admin' && actor.id !== existing.userId) {
      throw { status: 403, message: 'Nincs jogosultsága törölni ezt az értékelést.' };
    }
    const ok = ratingRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Értékelés nem található.' };
    return true;
  },
  findByRecipeId(recipeId) {
    return ratingRepo.findByRecipeId(recipeId);
  },
  findByUserId(userId) {
    return ratingRepo.findByUserId(userId);
  }
};
