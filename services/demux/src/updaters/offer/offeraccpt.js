const offerRepository = require('../../repositories/offer')
const tradeRepository = require('../../repositories/trade')
const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const offeraccpt = async (db, payload, blockInfo) => {
  
  // create the offer
  await new offerRepository(db).accept(payload.data.offer_id, {
    recipient_response: 1,
    updated_at: blockInfo.timestamp
  })
  
  // create the trade
  const generateid = await helpers.getInlineByName(payload.inlineActions, 'generateid', true)
  await new tradeRepository(db).create({
    id: generateid.id,
    offer_id: payload.data.offer_id,
    creator_stuff_sent: false,
    recipient_stuff_sent: false,
    creator_stuff_received: false,
    recipient_stuff_received: false,
    completed_at: null,
    created_at: blockInfo.timestamp,
    updated_at: null,
  })
  
  // update the stuff
  const stuffToUpdate = await helpers.getInlineByName(payload.inlineActions, 'stuffupdate', true)
  await new stuffRepository(db).update(stuffToUpdate.vStuffIds, {
    category_id: stuffToUpdate.updates.category_id,
    condition_id: stuffToUpdate.updates.condition_id,
    description: stuffToUpdate.updates.description,
    media: stuffToUpdate.updates.media,
    min_trade_value: stuffToUpdate.updates.min_trade_value,
    name: stuffToUpdate.updates.name,
    status: stuffToUpdate.updates.status,
    value: stuffToUpdate.updates.value,
    updated_at: blockInfo.timestamp
  })

  // log it to the console
  helpers.logger('Offer Accepted')
}

module.exports = offeraccpt