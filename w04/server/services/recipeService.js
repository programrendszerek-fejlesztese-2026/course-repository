const recipeRepo = require('../repositories/recipeRepository');
const categoryRepo = require('../repositories/categoryRepository');

module.exports = {
  findAll(categoryId) {
    if (categoryId) {
      return recipeRepo.findByCategoryId(categoryId);
    }
    return recipeRepo.findAll();
  },
  findById(id) {
    const recipe = recipeRepo.findById(id);
    if (!recipe) throw { status: 404, message: 'Recept nem található.' };
    return recipe;
  },
  create(data) {
    if (!data.title || data.title.trim() === '') {
      throw { status: 400, message: 'A recept neve kötelező.' };
    }
    if (!data.categoryId) {
      throw { status: 400, message: 'A categoryId kötelező.' };
    }
    const category = categoryRepo.findById(data.categoryId);
    if (!category) {
      throw { status: 400, message: 'A megadott categoryId nem létezik.' };
    }
    return recipeRepo.create(data);
  },
  update(id, data) {
    if (data.title !== undefined && data.title.trim() === '') {
      throw { status: 400, message: 'A recept neve nem lehet üres.' };
    }
    if (data.categoryId !== undefined) {
      const category = categoryRepo.findById(data.categoryId);
      if (!category) {
        throw { status: 400, message: 'A megadott categoryId nem létezik.' };
      }
    }
    const updated = recipeRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Recept nem található.' };
    return updated;
  },
  delete(id) {
    const ok = recipeRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Recept nem található.' };
    return true;
  }
};
