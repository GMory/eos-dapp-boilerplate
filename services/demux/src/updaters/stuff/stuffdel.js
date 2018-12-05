const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffdel = async (db, payload, blockInfo) => {
  // create the stuff
  await new stuffRepository(db).destroy(payload)

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffdel