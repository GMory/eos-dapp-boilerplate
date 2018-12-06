const accountRepository = require('../../repositories/account')
const helpers = require('../../helpers')

const acctupdate = async (db, payload, blockInfo) => {
  // update the account
  const account = await new accountRepository(db).update(payload.data.username, {
    avatar: payload.data.avatar,
    city: payload.data.city,
    country: payload.data.country,
    state: payload.data.state,
    zip: payload.data.zip,
    updated_at: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(account)
}

module.exports = acctupdate