const conditionRepository = require('../../repositories/condition')
const helpers = require('../../helpers')

const condadd = async (db, payload, blockInfo) => {
  // get the id
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  // create the condition
  const condition = await new conditionRepository(db).create(id, payload, blockInfo)

  // log it to the console
  helpers.logger(condition)
}

module.exports = condadd