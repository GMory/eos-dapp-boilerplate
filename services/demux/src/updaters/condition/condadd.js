const conditionRepository = require('../../repositories/condition')
const helpers = require('../../helpers')

const condadd = async (db, payload, blockInfo) => {
  // get the id
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)

  // create the condition
  const condition = await new conditionRepository(db).create({
    id: generateid.id,
    name: payload.data.name,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  })

  // log it to the console
  helpers.logger(condition)
}

module.exports = condadd