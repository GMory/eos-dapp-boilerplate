const wantRepository = require('../../repositories/want')
const helpers = require('../../helpers')

const wantadd = async (db, payload, blockInfo) => {
  // get the id & account
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the want
  const want = await new wantRepository(db).create({
    id: generateid.id,
    account_id: account.id,
    category_id: payload.data.category_id,
    createdat: blockInfo.timestamp,
    updatedat: blockInfo.timestamp,
    deletedat: null,
  })

  // log it to the console
  helpers.logger(want)
}

module.exports = wantadd