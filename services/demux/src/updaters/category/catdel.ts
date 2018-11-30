const catdel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING CATEGORY ] ===========')
  console.log('CATEGORY', payload.data.category_id)
  console.log('============================================')
  await db.categories.destroy({ id: payload.data.category_id })
}

export { catdel }