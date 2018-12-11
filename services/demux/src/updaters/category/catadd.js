const categoryRepository = require('../../repositories/category')
const helpers = require('../../helpers')

const catadd = async (db, payload, blockInfo) => {
  helpers.logger(payload)
  // get the id
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  
  // create the category
  const category = await new categoryRepository(db).create({
    id: generateid.id,
    name: payload.data.name,
    createdAt: blockInfo.timestamp,
    updatedAt: null,
    deletedAt: null,
  })

  // log it to the console
  helpers.logger(category)
}

module.exports = catadd