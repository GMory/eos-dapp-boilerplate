const wantRepository = require('../../repositories/want')
const helpers = require('../../helpers')

const wantadd = async (db, payload, blockInfo) => {
  // get the id & account
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the want
  const want = await new wantRepository(db).create(id, account, payload, blockInfo)

  // log it to the console
  helpers.logger(want)
}

module.exports = wantadd