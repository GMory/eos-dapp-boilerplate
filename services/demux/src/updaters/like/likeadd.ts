import { BlockInfo } from "demux"
import { getInlineActionResult, getAccountByUsername } from '../../helpers'

const likeadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await getAccountByUsername(db, payload.data.username)

  const data = {
    id: id,
    account_id: account.id,
    stuff_id: payload.data.stuff_id,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }

  console.log('=========== [ ADDING LIKE ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.likes.insert(data)
}

export { likeadd }