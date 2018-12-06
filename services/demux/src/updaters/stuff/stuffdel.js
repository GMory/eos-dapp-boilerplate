const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffdel = async (db, payload) => {
  // create the stuff
  await new stuffRepository(db).destroy(payload.data.vStuffIds)

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffdel