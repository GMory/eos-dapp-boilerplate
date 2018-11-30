const conddel = async (db: any, payload: any) => {

  // TODO: Handle inlines

  // Delete
  console.log('=========== [ DELETING CONDITION ] ===========')
  console.log('CONDITION', payload.data.condition_id)
  console.log('============================================')
  await db.conditions.destroy({ id: payload.data.condition_id })
}

export { conddel }