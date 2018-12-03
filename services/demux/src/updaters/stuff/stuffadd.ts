import { BlockInfo } from "demux"
import { getInlineActionResult, getAccountByUsername } from '../../helpers'

const stuffadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')
  const account = await getAccountByUsername(db, payload.data.username)

  const data = {
    id: id,
    account_id: account.id,
    category_id: payload.data.category_id,
    condition_id: payload.data.condition_id,
    description: payload.data.description,
    media: payload.data.media,
    min_trade_value: payload.data.minimum_trade_value,
    name: payload.data.name,
    status: 1,
    value: payload.data.value,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }

  console.log('=========== [ ADDING STUFF ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.stuff.insert(data)
}

export { stuffadd }