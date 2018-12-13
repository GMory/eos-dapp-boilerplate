const accountRepository = require('../../repositories/account')
const likeRepository = require('../../repositories/like')
const offerRepository = require('../../repositories/offer')
const offerStuffRepository = require('../../repositories/offerStuff')
const privateDataRepository = require('../../repositories/privateData')
const stuffRepository = require('../../repositories/stuff')
const wantRepository = require('../../repositories/want')
const helpers = require('../../helpers')

const acctdel = async (db, payload) => {
  // delete the account
  const account = await new accountRepository(db).destroy(payload.data.username)


  // delete stuff if it exists
  const stuffToDelete = await helpers.getInlineByName(payload.inlineActions, 'stuffdel', true)
  if (stuffToDelete) {
    await new stuffRepository(db).destroy(stuffToDelete.vStuffIds)
  }

  // delete offers if it exists
  const offersToDelete = await helpers.getInlineByName(payload.inlineActions, 'offerdel', true)
  if (offersToDelete) {
    await new offerRepository(db).destroy(offersToDelete.vOfferIds)
  }

  // delete offerstuff if it exists
  const offerStuff = await helpers.getInlineByName(payload.inlineActions, 'offerstufdel', true)
  if (offerStuff) {
    await new offerStuffRepository(db).destroy(offerStuff.vOfferStuffIds)
  }

  // delete wants if it exists
  const wants = await helpers.getInlineByName(payload.inlineActions, 'wantdel', true)
  if (wants) {
    await new wantRepository(db).destroy(wants.vWantIds)
  }
  
  // delete likes if it exists
  const likes = await helpers.getInlineByName(payload.inlineActions, 'likedel', true)
  if (likes) {
    await new likeRepository(db).destroy(likes.vLikeIds)
  }

  // delete private info
  await new privateDataRepository(db).destroy(payload.data.username)

  // log it to the console
  helpers.logger(account)
}

module.exports = acctdel