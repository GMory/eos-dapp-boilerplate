const likeRepository = require('../../repositories/like')
const helpers = require('../../helpers')

const likeadd = async (db, payload, blockInfo) => {
  // get the id & account
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the like
  const like = await new likeRepository(db).create({
    id: generateid.id,
    account_id: account.id,
    stuff_id: payload.data.stuff_id,
    createdat: blockInfo.timestamp,
    updatedat: null,
    deletedat: null,
  })

  // log it to the console
  helpers.logger(like)
}

module.exports = likeadd