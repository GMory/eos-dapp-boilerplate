const conditionRepository = require('../../repositories/condition')
const helpers = require('../../helpers')

const conddel = async (db, payload) => {
  // delete the condition
  const condition = await new conditionRepository(db).destroy(payload)

  // log it to the console
  helpers.logger(condition)
}

module.exports = conddel