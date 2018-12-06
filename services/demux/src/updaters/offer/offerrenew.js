const offerRepository = require('../../repositories/offer')
const helpers = require('../../helpers')

const offerrenew = async (db, payload, blockInfo) => {
  // renew offerStuff
  const offerStuff = await new offerRepository(db).renew(payload.data.offer_id, {
    expires_at: payload.data.expires_at,
    updated_at: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger(offerStuff)
}

module.exports = offerrenew