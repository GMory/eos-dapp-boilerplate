const conditionRepository = require('../../repositories/condition')
const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const conddel = async (db, payload, blockInfo) => {
  // delete the condition
  const condition = await new conditionRepository(db).destroy(payload.data.condition_id)

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
  helpers.logger(condition)
}

module.exports = conddel