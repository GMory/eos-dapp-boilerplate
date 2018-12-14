const categoryRepository = require('../../repositories/category')
const wantRepository = require('../../repositories/want')
const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const catdel = async (db, payload, blockInfo) => {
  // delete the category
  const category = await new categoryRepository(db).destroy(payload.data.category_id, blockInfo.timestamp)

  // delete wants if it exists
  const wants = await helpers.getInlineByName(payload.inlineActions, 'wantdel', true)
  if (wants) {
    await new wantRepository(db).destroy(wants.vWantIds, blockInfo.timestamp)
  }

  // update stuff if it exists
  const stuffToUpdate = await helpers.getInlineByName(payload.inlineActions, 'stuffupdate', true)
  if (stuffToUpdate) {
    await new stuffRepository(db).update(stuffToUpdate.vStuffIds, {
      category_id: stuffToUpdate.updates.category_id,
      condition_id: stuffToUpdate.updates.condition_id,
      description: stuffToUpdate.updates.description,
      media: stuffToUpdate.updates.media,
      min_trade_value: stuffToUpdate.updates.min_trade_value,
      name: stuffToUpdate.updates.name,
      status: stuffToUpdate.updates.status,
      value: stuffToUpdate.updates.value,
      updatedat: blockInfo.timestamp
    })
  }
  // log it to the console
  helpers.logger(category)
}

module.exports = catdel