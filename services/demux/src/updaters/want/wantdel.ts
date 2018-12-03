const wantdel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING WANTS ] ===========')
  await payload.data.vWantIds.forEach((id: any) => {
    console.log(id)
    db.wants.destroy({ id: id })
  })
  console.log('======= [ FINISHED DELETING WANTS ] =======')
}

export { wantdel }