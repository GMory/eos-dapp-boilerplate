import { BlockInfo } from "demux"
import { getInlineActionResult } from '../../helpers'

const catadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  const data = {
    id: id,
    name: payload.data.name,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }

  console.log('=========== [ ADDING CATEGORY ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.categories.insert(data)
}

export { catadd }