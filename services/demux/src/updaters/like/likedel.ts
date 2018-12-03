const likedel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING LIKES ] ===========')
  await payload.data.vLikeIds.forEach((id: any) => {
    console.log(id)
    db.likes.destroy({ id: id })
  })
  console.log('======= [ FINISHED DELETING LIKES ] =======')
}

export { likedel }