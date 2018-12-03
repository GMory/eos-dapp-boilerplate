import { BlockInfo } from "demux"
import { getInlineActionResult, getAccountByUsername } from '../../helpers'

const wantadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await getAccountByUsername(db, payload.data.username)

  const data = {
    id: id,
    account_id: account.id,
    category_id: payload.data.category_id,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }

  console.log('=========== [ ADDING WANT ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.wants.insert(data)
}

export { wantadd }