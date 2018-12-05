const masterRepository = require('./master')

class likeRepository extends masterRepository {
  
  async create(id, account, payload, blockInfo) {
    const data = {
      id: id,
      account_id: account.id,
      stuff_id: payload.data.stuff_id,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.likes.insert(data)
  }

  async destroy(payload) {
    return await payload.data.vLikeIds.forEach((id) => {
      console.log(id)
      this.db.likes.destroy({ id: id })
    })
  }
}

module.exports = likeRepository