const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const offerdel = async (db, payload, blockInfo) => {
  // delete offer
  await new offerRepository(db).destroy(payload.data.vOfferIds, blockInfo.timestamp) // need to return first of offer array here (TODO fix)

  // delete offerstuff
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel', true)
  await new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds, blockInfo.timestamp)

  // log it to the console
  helpers.logger(payload.data.vOfferIds)
}

module.exports = offerdel