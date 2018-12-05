const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffadd = async (db, payload, blockInfo) => {
  // get the id & account
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the stuff
  const stuff = await new stuffRepository(db).create(id, account, payload, blockInfo)

  // log it to the console
  helpers.logger(stuff)
}

module.exports = stuffadd