const getInlineActionResult = async (inlineActions: any, name: string, value: string) => {
  let result: any = []
  inlineActions.forEach((action: any) => {
    if (action.act.name === name) {
      result = action.act.data[value]
    }
  })
  return result
}

const getInlineAction = async (inlineActions: any, name: string) => {
  let result: any = []
  inlineActions.forEach((action: any) => {
    if (action.act.name === name) {
      result.push(action.act.data)
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
  console.log(info)
  console.log('')
  console.log('====================================')
  console.log('======')
  console.log('===')
  console.log('=')
  console.log('')
}
export { getInlineActionResult, getInlineAction, getAccountByUsername, logger }