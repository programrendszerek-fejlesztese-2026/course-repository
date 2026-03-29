const recipeRepo = require('../repositories/recipeRepository');
const categoryRepo = require('../repositories/categoryRepository');

module.exports = {
  async findAll(categoryId) {
    if (categoryId) {
      return await recipeRepo.findByCategoryId(categoryId);
    }
    return await recipeRepo.findAll();
  },
  async findById(id) {
    const recipe = await recipeRepo.findById(id);
    if (!recipe) throw { status: 404, message: 'Recept nem található.' };
    return recipe;
  },
  async create(data) {
    // Map ownerId (from routes) to createdBy (domain model / seeds)
    if (data.ownerId && !data.createdBy) {
      data.createdBy = data.ownerId;
      delete data.ownerId;
    }
    if (!data.title || data.title.trim() === '') {
      throw { status: 400, message: 'A recept neve kötelező.' };
    }
    if (!data.categoryId) {
      throw { status: 400, message: 'A categoryId kötelező.' };
    }
    const category = await categoryRepo.findById(data.categoryId);
    if (!category) {
      throw { status: 400, message: 'A megadott categoryId nem létezik.' };
    }
    return await recipeRepo.create(data);
  },
  async update(id, data) {
    if (data.title !== undefined && data.title.trim() === '') {
      throw { status: 400, message: 'A recept neve nem lehet üres.' };
    }
    if (data.categoryId !== undefined) {
      const category = await categoryRepo.findById(data.categoryId);
      if (!category) {
        throw { status: 400, message: 'A megadott categoryId nem létezik.' };
      }
    }
    const updated = await recipeRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Recept nem található.' };
    return updated;
  },
  async delete(id) {
    const ok = await recipeRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Recept nem található.' };
    return true;
  }
};
