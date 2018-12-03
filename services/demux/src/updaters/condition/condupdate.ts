import { BlockInfo } from "demux"

const condupdate = async (db: any, payload: any, blockInfo: BlockInfo) => {

  // TODO: Handle inlines

  // Formulate data
  let data = {
    name: payload.data.name,
    updated_at: blockInfo.timestamp
  }

  // Validate
  if (data.name === "") {
    delete data.name
  }
  
  // Update
  console.log('=========== [ UPDATING CONDITION ] ===========')
  console.log('DATA', data)
  console.log('============================================')
  await db.conditions.update({ id: payload.data.condition_id }, data)
}

export { condupdate }