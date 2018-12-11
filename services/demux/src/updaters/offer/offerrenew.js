const offerRepository = require('../../repositories/offer')
const helpers = require('../../helpers')

const offerrenew = async (db, payload, blockInfo) => {
  // renew offerStuff
  const offerStuff = await new offerRepository(db).renew(payload.data.offer_id, {
    expiresAt: payload.data.expiresAt,
    updatedAt: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(offerStuff)
}

module.exports = offerrenew