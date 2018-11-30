import { BlockInfo } from "demux"
import { getInlineActionResult } from '../../helpers'

const acctadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  // console.info("\n\n==== Account Updater ====")
  // console.info("\n\nUpdater Payload >>> \n", payload)
  // console.info("\n\nUpdater Block Info >>> \n", blockInfo)

  // console.info("\n================= INLINE ACTIONS ========================")
  // console.log(payload.inlineActions[0].act.name)
  // console.log(payload.inlineActions[0].act.data)
  // console.log(payload.inlineActions[0].act.data.type)
  // console.log(payload.inlineActions[0].act.data.id)
  // console.info("=============================================================\n")

  
  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  const data = {
    id: id,
    address: null,
    avatar: payload.data.avatar,
    city: payload.data.city,
    country: payload.data.country,
    first_name: null,
    last_name: null,
    state: payload.data.state,
    username: payload.data.username,
    zip: payload.data.zip,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
    // created_block: blockInfo.blockNumber,
    // created_trx: payload.transactionId,
  }

  console.log('=========== [ ADDING ACCOUNT ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.accounts.insert(data)
}

export { acctadd }