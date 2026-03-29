const ratingRepo = require('../repositories/ratingRepository');
const recipeRepo = require('../repositories/recipeRepository');

module.exports = {
  async findAll() {
    return await ratingRepo.findAll();
  },
  async findById(id) {
    const rating = await ratingRepo.findById(id);
    if (!rating) throw { status: 404, message: 'Értékelés nem található.' };
    return rating;
  },
  async create(data) {
    if (!data.recipeId) {
      throw { status: 400, message: 'A recipeId kötelező.' };
    }
    const recipe = await recipeRepo.findById(data.recipeId);
    if (!recipe) {
      throw { status: 400, message: 'A megadott recipeId nem létezik.' };
    }
    if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5) {
      throw { status: 400, message: 'A score 1–5 közötti egész szám lehet.' };
    }
    if (!data.userId) throw { status: 400, message: 'A userId kötelező.' };
    return await ratingRepo.create(data);
  },

  async update(id, data, actor) {
    if (data.score !== undefined) {
      if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5) {
        throw { status: 400, message: 'A score 1–5 közötti egész szám lehet.' };
      }
    }
    const existing = await ratingRepo.findById(id);
    if (!existing) throw { status: 404, message: 'Értékelés nem található.' };
    // only owner can update (role-based checks removed)
    if (!idsEqual(actor.id, existing.userId)) {
      throw { status: 403, message: 'Nincs jogosultsága módosítani ezt az értékelést.' };
    }
    const updated = await ratingRepo.update(id, data);
    return updated;
  },
  async delete(id, actor) {
    const existing = await ratingRepo.findById(id);
    if (!existing) throw { status: 404, message: 'Értékelés nem található.' };
    // allow admin to delete any rating, otherwise only owner can delete
    if (actor.role !== 'admin' && !idsEqual(actor.id, existing.userId)) {
      throw { status: 403, message: 'Nincs jogosultsága törölni ezt az értékelést.' };
    }
    const ok = await ratingRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Értékelés nem található.' };
    return true;
  },
  async findByRecipeId(recipeId) {
    return await ratingRepo.findByRecipeId(recipeId);
  },
  async findByUserId(userId) {
    return await ratingRepo.findByUserId(userId);
  }
};

function idsEqual(a, b) {
  // both null/undefined
  if (!a && !b) return true;
  if (!a || !b) return false;
  const { ObjectId } = require('mongodb');
  try {
    const ao = new ObjectId(String(a));
    const bo = new ObjectId(String(b));
    return ao.equals(bo);
  } catch (e) {
    return String(a) === String(b);
  }
}
