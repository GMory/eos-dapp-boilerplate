const categoryRepository = require('../../repositories/category')
const helpers = require('../../helpers')

const catdel = async (db, payload) => {
  // delete the category
  const category = await new categoryRepository(db).destroy(payload.data.category_id)

  // log it to the console
  helpers.logger(category)
}

module.exports = catdel