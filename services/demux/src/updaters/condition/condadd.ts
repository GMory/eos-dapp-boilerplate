import { BlockInfo } from "demux"
import { getInlineActionResult } from '../../helpers'

const condadd = async (db: any, payload: any, blockInfo: BlockInfo) => {

  const id = await getInlineActionResult(payload.inlineActions, 'generateid', 'id')

  const data = {
    id: id,
    name: payload.data.name,
    created_at: blockInfo.timestamp,
    updated_at: null,
    deleted_at: null,
  }

  console.log('=========== [ ADDING CONDITION ] ===========')
  console.log('DATA', data)
  console.log('============================================')

  await db.conditions.insert(data)
}

export { condadd }