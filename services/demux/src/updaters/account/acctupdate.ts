import { BlockInfo } from "demux"

const acctupdate = async (db: any, payload: any, blockInfo: BlockInfo) => {

  // TODO: Handle inlines

  // Formulate data
  let data = {
    avatar: payload.data.avatar,
    city: payload.data.city,
    country: payload.data.country,
    state: payload.data.state,
    zip: payload.data.zip,
    updated_at: blockInfo.timestamp
  }

  // Validate
  if (data.avatar === "") {
    delete data.avatar
  }
  if (data.city === "") {
    delete data.city
  }
  if (data.country === "") {
    delete data.country
  }
  if (data.state === "") {
    delete data.state
  }
  if (data.zip.toString().length !== 5) {
    delete data.zip
  }
  
  // Update
  console.log('=========== [ UPDATING ACCOUNT ] ===========')
  console.log('ACCOUNT', payload.data.username)
  console.log('--')
  console.log('DATA', data)
  console.log('============================================')
  await db.accounts.update({ username: payload.data.username }, data)
}

export { acctupdate }