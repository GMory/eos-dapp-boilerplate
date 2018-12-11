const accountRepository = require('../../repositories/account')
const helpers = require('../../helpers')

const acctadd = async (db, payload, blockInfo) => {
  // get the id
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  
  // create the account
  const account = await new accountRepository(db).create({
    id: generateid.id,
    address: null,
    avatar: payload.data.avatar,
    city: payload.data.city,
    country: payload.data.country,
    first_name: null,
    last_name: null,
    state: payload.data.state,
    username: payload.data.username,
    zip: payload.data.zip,
    createdAt: blockInfo.timestamp,
    updatedAt: null,
    deletedAt: null,
  })

  // log it to the console
  helpers.logger(account)
}

module.exports = acctadd