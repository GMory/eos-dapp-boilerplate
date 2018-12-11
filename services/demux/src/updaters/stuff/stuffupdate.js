const stuffRepository = require('../../repositories/stuff')
const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const stuffupdate = async (db, payload, blockInfo) => {
  // update the stuff
  await new stuffRepository(db).update(payload.data.vStuffIds, {
    category_id: payload.data.updates.category_id,
    condition_id: payload.data.updates.condition_id,
    description: payload.data.updates.description,
    media: payload.data.updates.media,
    min_trade_value: payload.data.updates.min_trade_value,
    name: payload.data.updates.name,
    status: payload.data.updates.status,
    value: payload.data.updates.value,
    updatedAt: blockInfo.timestamp
  })

  // delete offers if it exists
  const offersToDelete = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  if (offersToDelete) {
    await new offerRepository(db).destroy(offersToDelete.vOfferIds)
  }

  // delete offerstuff if it exists
  const batchesOfOfferStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel')
  if (batchesOfOfferStuff) {
    await batchesOfOfferStuff.forEach(offerStuff => {
      new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds)
    });
  }

  // log it to the console
  helpers.logger(payload.data.vStuffIds)
}

module.exports = stuffupdate