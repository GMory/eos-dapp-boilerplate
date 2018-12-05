const accountRepository = require('../../repositories/account')
const helpers = require('../../helpers')

const acctupdate = async (db, payload, blockInfo) => {
  // update the account
  const account = await new accountRepository(db).update(payload, blockInfo)

  // log it to the console
  helpers.logger(account)
}

module.exports = acctupdate