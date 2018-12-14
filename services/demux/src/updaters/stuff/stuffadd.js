const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffadd = async (db, payload, blockInfo) => {
  // get the id & account
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the stuff
  const stuff = await new stuffRepository(db).create({
    id: generateid.id,
    account_id: account.id,
    category_id: payload.data.category_id,
    condition_id: payload.data.condition_id,
    description: payload.data.description,
    media: payload.data.media,
    min_trade_value: payload.data.minimum_trade_value,
    name: payload.data.name,
    status: 1,
    value: payload.data.value,
    createdat: blockInfo.timestamp,
    updatedat: blockInfo.timestamp,
    deletedat: null,
  })

  // log it to the console
  helpers.logger(stuff)
}

module.exports = stuffadd