const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const offerdecl = async (db, payload, blockInfo) => {
  // decline the offer
  await new offerRepository(db).decline(payload.data.offer_id, {
    recipient_response: 2,
    updatedat: blockInfo.timestamp
  })
  
  // delete offer
  const offer = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  await new offerRepository(db).destroy(offer.vOfferIds, blockInfo.timestamp) // need to return first of offer array here (TODO fix)

  // delete offerstuff
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel', true)
  await new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds, blockInfo.timestamp)

  // log it to the console
  helpers.logger(offer)
}

module.exports = offerdecl