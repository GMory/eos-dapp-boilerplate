const likeRepository = require('../../repositories/like')
const helpers = require('../../helpers')

const likeadd = async (db, payload, blockInfo) => {
  // get the id & account
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // create the like
  const like = await new likeRepository(db).create(id, account, payload, blockInfo)

  // log it to the console
  helpers.logger(like)
}

module.exports = likeadd