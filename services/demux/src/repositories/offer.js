const masterRepository = require('./master')

class offerRepository extends masterRepository {
  
  async create(id, payload, blockInfo) {
    const data = {
      id: id,
      creator_id: payload.data.creator_id,
      recipient_id: payload.data.recipient_id,
      recipient_response: 0,
      expires_at: null,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.offers.insert(data)
  }

  async accept(payload, blockInfo) {
    let data = {
      recipient_response: 1,
      updated_at: blockInfo.timestamp
    }
    return await this.db.offers.update({ id: payload.data.offer_id }, data)
  }

  async decline(payload, blockInfo) {
    let data = {
      recipient_response: 2,
      updated_at: blockInfo.timestamp
    }
    return await this.db.offers.update({ id: payload.data.offer_id }, data)
  }

  async renew(payload, blockInfo) {
    let data = {
      expires_at: payload.data.expires_at,
      updated_at: blockInfo.timestamp
    }
    return await this.db.offers.update({ id: payload.data.offer_id }, data)
  }

  async destroy(ids) {
    return await ids.forEach((id) => {
      this.db.offers.destroy({ id: id })
    })
  }
}

module.exports = offerRepository