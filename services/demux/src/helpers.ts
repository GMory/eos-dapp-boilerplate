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
    // if (action.act.inline_traces.length > 0) {
    //   console.log('going')
    //   result.push(getInlineAction(action.act.inline_traces, name))
    // }
  })
  return result
}

const getInlineByName = async (inlineActions: any, name: string, returnFirstResult: boolean) => {
  returnFirstResult = (returnFirstResult) ? returnFirstResult : false
  var result: any = []
  let actions = await getInlines(inlineActions)

  actions.forEach((action: any) => {
    if (action.name === name) {
      result.push(action.data)
    }
  })

  return (returnFirstResult) ? result[0] : result
}

const getInlines = async (inlineActions: any) => {
  
  var result: any = []

  return await extractAction(inlineActions, result)
}

const extractAction = async (inlineActions: any, result: any) => {

  inlineActions.forEach(async (action: any) => {
    const name: any = action.act.name
    const data: any = action.act.data
    result.push({name: name, data: data})
    
    // get any nested actions too
    if (action.inline_traces.length > 0) {
      await extractAction(action.inline_traces, result)
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
export { getInlineActionResult, getInlineAction, getAccountByUsername, getInlines, getInlineByName, logger }