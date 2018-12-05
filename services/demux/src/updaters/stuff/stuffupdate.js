const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffupdate = async (db, payload, blockInfo) => {
  // create the stuff
  await new stuffRepository(db).update(payload, blockInfo)

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffupdate