const getInlineByName = async (inlineActions, name, returnFirstResult) => {
  returnFirstResult = (returnFirstResult) ? returnFirstResult : false
  var result = []
  let actions = await getInlines(inlineActions)

  actions.forEach((action) => {
    if (action.name === name) {
      result.push(action.data)
    }
  })

  if (returnFirstResult) {
    if (result.length > 0) {
      return result[0]
    }
    return null
  }
  
  return (result) ? result : null
}

const getInlines = async (inlineActions) => {
  var result = []

  return await extractAction(inlineActions, result)
}

const extractAction = async (inlineActions, result) => {
  inlineActions.forEach(async (action) => {
    const name = action.act.name
    const data = action.act.data
    result.push({name: name, data: data})
    
    // get any nested actions too
    if (action.inline_traces.length > 0) {
      await extractAction(action.inline_traces, result)
    }
  })

  return result
}

const getAccountByUsername = async (db, username) => {
  return db.accounts.findOne({ username: username })
}

const logger = (info) => {
  console.log('.')
  console.log('.')
  console.log('.')
  console.log('============ [ LOGGER ] ============')
  console.log('.')
  console.log(info)
  console.log('.')
  console.log('====================================')
  console.log('.')
  console.log('.')
  console.log('.')
}

module.exports = {getAccountByUsername, getInlineByName, logger }