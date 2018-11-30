import { BlockInfo } from "demux"

const catupdate = async (db: any, payload: any, blockInfo: BlockInfo) => {

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
  console.log('=========== [ UPDATING CATEGORY ] ===========')
  console.log('CATEGORY', payload.data.category_id)
  console.log('--')
  console.log('DATA', data)
  console.log('============================================')
  await db.categories.update({ id: payload.data.category_id }, data)
}

export { catupdate }