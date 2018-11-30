const acctdel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING ACCOUNT ] ===========')
  console.log('ACCOUNT', payload.data.username)
  console.log('============================================')
  await db.accounts.destroy({ username: payload.data.username })
}

export { acctdel }