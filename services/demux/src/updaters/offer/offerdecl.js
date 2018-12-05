const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const offerdecl = async (db, payload, blockInfo) => {
  // decline the offer
  await new offerRepository(db).decline(payload, blockInfo)
  
  // delete offer
  const offer = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  helpers.logger(offer)
  await new offerRepository(db).destroy(offer.vOfferIds) // need to return first of offer array here (TODO fix)

  // delete offerstuff
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel', true)
  helpers.logger(offerStuff)
  await new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds)

  // log it to the console
  helpers.logger(offer)
}

module.exports = offerdecl