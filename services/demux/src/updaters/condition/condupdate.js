const conditionRepository = require('../../repositories/condition')
const helpers = require('../../helpers')

const condupdate = async (db, payload, blockInfo) => {
  // update the condition
  const condition = await new conditionRepository(db).update(payload.data.condition_id, {
    name: payload.data.name,
    updated_at: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(condition)
}

module.exports = condupdate