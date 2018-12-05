const accountRepository = require('../../repositories/account')
const helpers = require('../../helpers')

const acctadd = async (db, payload, blockInfo) => {
  // get the id
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  // create the account
  const account = await new accountRepository(db).create(id, payload, blockInfo)

  // log it to the console
  helpers.logger(account)
}

module.exports = acctadd