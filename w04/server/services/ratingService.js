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
    return ratingRepo.create(data);
  },
  update(id, data) {
    if (data.score !== undefined) {
      if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5) {
        throw { status: 400, message: 'A score 1–5 közötti egész szám lehet.' };
      }
    }
    const updated = ratingRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Értékelés nem található.' };
    return updated;
  },
  delete(id) {
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
