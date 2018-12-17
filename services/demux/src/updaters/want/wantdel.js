const wantRepository = require('../../repositories/want')
const helpers = require('../../helpers')

const wantdel = async (db, payload, blockInfo) => {
  // create the want
  await new wantRepository(db).destroy(payload.data.vWantIds, blockInfo.timestamp)

  // log it to the console
  helpers.logger(payload.data.vWantIds)
}

module.exports = wantdel