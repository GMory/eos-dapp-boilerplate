const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const offeradd = async (db, payload, blockInfo) => {
  // get the id
  const id = await helpers.getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const offerStuffIds = await helpers.getInlineAction(payload.inlineActions, 'offerstuffid')
  
  // create the offer
  const offer = await new offerRepository(db).create(id, payload, blockInfo)

  // log it to the console
  helpers.logger(offer)

  // create offerStuff
  await new offerStuffRepository(db).create(offerStuffIds, offer)

  // log it to the console
  helpers.logger(offerStuffIds)
}

module.exports = offeradd