const getInlineActionResult = async (inlineActions: any, name: string, value: string) => {
  var result = null
  inlineActions.forEach((action: any) => {
    if (action.act.name === name) {
      result = action.act.data[value]
    }
  })
  return result
}

const getAccountByUsername = async (db: any, username: any) => {
  return db.accounts.findOne({ username: username })
}

const logger = (info: any) => {
  console.log('')
  console.log('=')
  console.log('===')
  console.log('======')
  console.log('============ [ LOGGER ] ============')
  console.log('')
  console.log('DATA', info)
  console.log('')
  console.log('====================================')
  console.log('======')
  console.log('===')
  console.log('=')
  console.log('')
}
export { getInlineActionResult, getAccountByUsername, logger }