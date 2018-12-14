const accountRepository = require('../../repositories/account')
const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const helpers = require('../../helpers')

const acctupdate = async (db, payload, blockInfo) => {
  // update the account
  const account = await new accountRepository(db).update(payload.data.username, {
    avatar: payload.data.avatar,
    city: payload.data.city,
    country: payload.data.country,
    state: payload.data.state,
    zip: payload.data.zip,
    updatedat: blockInfo.timestamp
  })

  // delete offers if it exists
  const offersToDelete = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  if (offersToDelete) {
    await new offerRepository(db).destroy(offersToDelete.vOfferIds, blockInfo.timestamp)

  }
  
  // delete offerstuff if it exists
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel', true)
  if (offerStuff) {
    await new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds, blockInfo.timestamp)
  }
  
  // log it to the console
  helpers.logger("Account updated")
}

module.exports = acctupdate