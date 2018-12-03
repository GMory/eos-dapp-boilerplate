const stuffdel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING STUFF ] ===========')
  await payload.data.vStuffIds.forEach((id: any) => {
    console.log(id)
    db.stuff.destroy({ id: id })
  })
  console.log('======= [ FINISHED DELETING STUFF ] =======')
}

export { stuffdel }