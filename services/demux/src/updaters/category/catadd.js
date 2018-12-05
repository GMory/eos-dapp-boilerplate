const categoryRepository = require('../../repositories/category')
const helpers = require('../../helpers')

const catadd = async (db, payload, blockInfo) => {
  // get the id
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  // create the category
  const category = await new categoryRepository(db).create(id, payload, blockInfo)

  // log it to the console
  helpers.logger(category)
}

module.exports = catadd