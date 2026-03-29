const categoryRepo = require('../repositories/categoryRepository');
const recipeRepo = require('../repositories/recipeRepository');

module.exports = {
  async findAll() {
    return await categoryRepo.findAll();
  },
  async findById(id) {
    const cat = await categoryRepo.findById(id);
    if (!cat) throw { status: 404, message: 'Kategória nem található.' };
    return cat;
  },
  async create(data) {
    if (!data.name || data.name.trim() === '') {
      throw { status: 400, message: 'A kategória neve kötelező.' };
    }
    return await categoryRepo.create(data);
  },
  async update(id, data) {
    if (data.name !== undefined && data.name.trim() === '') {
      throw { status: 400, message: 'A kategória neve nem lehet üres.' };
    }
    const updated = await categoryRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Kategória nem található.' };
    return updated;
  },
  async delete(id) {
    // Ne törölj, ha van hozzá recept!
    const recipes = await recipeRepo.findByCategoryId(id);
    if (recipes.length > 0) {
      throw { status: 409, message: 'A kategóriához tartozó receptek vannak, nem törölhető.' };
    }
    const ok = await categoryRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Kategória nem található.' };
    return true;
  }
};
