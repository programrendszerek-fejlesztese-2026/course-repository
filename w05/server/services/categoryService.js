const categoryRepo = require('../repositories/categoryRepository');
const recipeRepo = require('../repositories/recipeRepository');

module.exports = {
  findAll() {
    return categoryRepo.findAll();
  },
  findById(id) {
    const cat = categoryRepo.findById(id);
    if (!cat) throw { status: 404, message: 'Kategória nem található.' };
    return cat;
  },
  create(data) {
    if (!data.name || data.name.trim() === '') {
      throw { status: 400, message: 'A kategória neve kötelező.' };
    }
    return categoryRepo.create(data);
  },
  update(id, data) {
    if (data.name !== undefined && data.name.trim() === '') {
      throw { status: 400, message: 'A kategória neve nem lehet üres.' };
    }
    const updated = categoryRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Kategória nem található.' };
    return updated;
  },
  delete(id) {
    // Ne törölj, ha van hozzá recept!
    const recipes = recipeRepo.findByCategoryId(id);
    if (recipes.length > 0) {
      throw { status: 409, message: 'A kategóriához tartozó receptek vannak, nem törölhető.' };
    }
    const ok = categoryRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Kategória nem található.' };
    return true;
  }
};
