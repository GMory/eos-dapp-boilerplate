const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffupdate = async (db, payload, blockInfo) => {
  // create the stuff
  await new stuffRepository(db).update(payload.data.vStuffIds, {
    category_id: payload.data.updates.category_id,
    condition_id: payload.data.updates.condition_id,
    description: payload.data.updates.description,
    media: payload.data.updates.media,
    min_trade_value: payload.data.updates.min_trade_value,
    name: payload.data.updates.name,
    status: payload.data.updates.status,
    value: payload.data.updates.value,
    updated_at: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffupdate