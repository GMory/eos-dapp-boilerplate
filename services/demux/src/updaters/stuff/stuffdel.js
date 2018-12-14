const stuffRepository = require('../../repositories/stuff')
const likeRepository = require('../../repositories/like')
const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const stuffdel = async (db, payload) => {
  // create the stuff
  await new stuffRepository(db).destroy(payload.data.vStuffIds)

  // delete offers if it exists
  const offersToDelete = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  if (offersToDelete) {
    await new offerRepository(db).destroy(offersToDelete.vOfferIds, blockInfo.timestamp)
  }

  // delete offerstuff if it exists
  const batchesOfOfferStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel')
  if (batchesOfOfferStuff) {
    await batchesOfOfferStuff.forEach(offerStuff => {
      new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds, blockInfo.timestamp)
    });
  }

  // delete likes if it exists
  const likes = await helpers.getInlineByName(payload.inlineActions, 'likedel', true)
  if (likes) {
    await new likeRepository(db).destroy(likes.vLikeIds, blockInfo.timestamp)
  }

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffdel