import { BlockInfo } from "demux"
import { getInlineActionResult, getInlineAction, logger } from '../../helpers'

const offeradd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  let offerStuffIds = await getInlineAction(payload.inlineActions, 'offerstuffid')
  logger(offerStuffIds)
  const data = {
    id: id,
    creator_id: payload.data.creator_id,
    recipient_id: payload.data.recipient_id,
    recipient_response: 0,
    expires_at: null,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }
  
  console.log('=========== [ ADDING OFFER ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  const res = await db.offers.insert(data)
  
  await offerStuffIds.forEach((value: any) => {
    logger(value)
    if (value.offer_id === res.id) {
      db.offerStuff.insert({
        id: value.id,
        stuff_id: value.stuff_id,
        offer_id: value.offer_id
      })
    } else {
      console.log('error')
    }
  })
    
}

export { offeradd }