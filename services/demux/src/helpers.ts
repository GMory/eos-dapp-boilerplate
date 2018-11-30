const getInlineActionResult = async (inlineActions: any, name: string, value: string) => {
  var result = null
  inlineActions.forEach((action: any) => {
    if (action.act.name === name) {
      result = action.act.data[value]
    }
  })
  return result
}

export { getInlineActionResult }