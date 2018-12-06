const tradeRepository = require('../../repositories/trade')
const stuffRepository = require('../../repositories/stuff')
const helpers = require('../../helpers')

const stuffsent = async (db, payload, blockInfo) => {
  // instantiate our data
  let data = {
    updated_at = blockInfo.timestamp
  }
  
  // get the account
  const account = await helpers.getAccountByUsername(db, payload.data.username)

  // get the trade
  const trade = await db.trades.findOne({ id: payload.data.trade_id })
  
  // get the trade's offer
  const offer = await db.offers.findOne({ id: trade.offer_id })
  
  // see if user's ID matches offer creator ID
  if (offer.creator_id === account.id) {
    data.creator_stuff_sent = true
  }
  
  // see if user's ID matches offer recipient ID
  if (offer.recipient_id === account.id) {
    data.recipient_stuff_sent = true
  }
  
  // check if stuff was updated (meaning the trade is complete)
  const stuffToUpdate = await helpers.getInlineByName(payload.inlineActions, 'stuffupdate', true)
  
  if (stuffToUpdate) {
    // add completed at to data
    data.completed_at = blockInfo.timestamp
    // update stuff
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
  }

  // update the trade with data
  await new tradeRepository(db).stuffsent(payload.data.trade_id, data)

  // log it to the console
  helpers.logger("Stuff sent")
}

module.exports = stuffsent