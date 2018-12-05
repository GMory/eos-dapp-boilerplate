const masterRepository = require('./master')

class wantRepository extends masterRepository {
  
  async create(id, account, payload, blockInfo) {
    const data = {
      id: id,
      account_id: account.id,
      category_id: payload.data.category_id,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.wants.insert(data)
  }

  async destroy(payload) {
    return await payload.data.vWantIds.forEach((id) => {
      this.db.wants.destroy({ id: id })
    })
  }
}

module.exports = wantRepository