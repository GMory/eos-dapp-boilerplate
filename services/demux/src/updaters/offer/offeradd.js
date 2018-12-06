const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const offeradd = async (db, payload, blockInfo) => {
  // get the id
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstuffid')

  // create the offer
  const offer = await new offerRepository(db).create({
    id: generateid.id,
    creator_id: payload.data.creator_id,
    recipient_id: payload.data.recipient_id,
    recipient_response: 0,
    expires_at: payload.data.expires_at,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  })

  // log it to the console
  helpers.logger(offer)
  
  // create offerStuff
  await new offerStuffRepository(db).create(offerStuff, offer)

  // log it to the console
  helpers.logger(offerStuff)
}

module.exports = offeradd