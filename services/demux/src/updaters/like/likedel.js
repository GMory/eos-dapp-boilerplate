const likeRepository = require('../../repositories/like')
const helpers = require('../../helpers')

const likedel = async (db, payload) => {
  // create the like
  await new likeRepository(db).destroy(payload.data.vLikeIds, blockInfo.timestamp)

  // log it to the console
  helpers.logger(payload.data.vLikeIds)
}

module.exports = likedel