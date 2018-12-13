const categoryRepository = require('../../repositories/category')
const helpers = require('../../helpers')

const catupdate = async (db, payload, blockInfo) => {
  // update the category
  const category = await new categoryRepository(db).update(payload.data.category_id, {
    name: payload.data.name,
    updatedat: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(category)
}

module.exports = catupdate