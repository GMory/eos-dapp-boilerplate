const offerRepository = require('../../repositories/offer')
const helpers = require('../../helpers')

const offeraccpt = async (db, payload, blockInfo) => {
  // create the offer
  const offer = await new offerRepository(db).accept(payload, blockInfo)

  // log it to the console
  helpers.logger(offer)
}

module.exports = offeraccpt