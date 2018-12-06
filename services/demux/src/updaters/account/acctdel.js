const accountRepository = require('../../repositories/account')
const helpers = require('../../helpers')

const acctdel = async (db, payload) => {
  // delete the account
  const account = await new accountRepository(db).destroy(payload.data.username)

  // log it to the console
  helpers.logger(account)
}

module.exports = acctdel