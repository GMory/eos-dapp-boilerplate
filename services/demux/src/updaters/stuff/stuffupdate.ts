import { BlockInfo } from "demux"

const stuffupdate = async (db: any, payload: any, blockInfo: BlockInfo) => {

  // TODO: Handle inlines

  // Formulate data
  const data = {
    category_id: payload.data.updates.category_id,
    condition_id: payload.data.updates.condition_id,
    description: payload.data.updates.description,
    media: payload.data.updates.media,
    min_trade_value: payload.data.updates.min_trade_value,
    name: payload.data.updates.name,
    status: payload.data.updates.status,
    value: payload.data.updates.value,
    updated_at: blockInfo.timestamp
  }
  
  // Validate
  if (data.category_id === "" || data.category_id === 4294967295) {
    delete data.category_id
  }
  if (data.condition_id === "" || data.condition_id === 4294967295) {
    delete data.condition_id
  }
  if (data.description === "") {
    delete data.description
  }
  if (data.media === "") {
    delete data.media
  }
  if (data.min_trade_value === "" || parseInt(data.min_trade_value) === -1) {
    delete data.min_trade_value
  }
  if (data.name === "") {
    delete data.name
  }
  if (data.status === "" || data.status === -1) {
    delete data.status
  }
  if (data.value === "" || parseInt(data.value) === -1) {
    delete data.value
  }
  
  // Update
  console.log('=========== [ UPDATING STUFF ] ===========')
  await payload.data.vStuffIds.forEach((id: any) => {
    console.log(id)
    db.stuff.update({ id: id }, data)
  })
  console.log('==========================================')
  console.log(db.stuff.findOne({id: 0}))
}

export { stuffupdate }