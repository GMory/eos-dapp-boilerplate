const masterRepository = require('./master')

class stuffRepository extends masterRepository {
  
  async create(id, account, payload, blockInfo) {
    const data = {
      id: id,
      account_id: account.id,
      category_id: payload.data.category_id,
      condition_id: payload.data.condition_id,
      description: payload.data.description,
      media: payload.data.media,
      min_trade_value: payload.data.minimum_trade_value,
      name: payload.data.name,
      status: 1,
      value: payload.data.value,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.stuff.insert(data)
  }

  async update(payload, blockInfo) {
    // Formulate data
    let data = {
      category_id: payload.data.updates.category_id,
      condition_id: payload.data.updates.condition_id,
      description: payload.data.updates.description,
      media: payload.data.updates.media,
      min_trade_value: payload.data.updates.min_trade_value,
      name: payload.data.updates.name,
      status: payload.data.updates.status,
      value: payload.data.updates.value,
      updated_at: blockInfo.timestamp
    }

    // Validate
    if (data.category_id === "" || data.category_id === 4294967295) {
      delete data.category_id
    }
    if (data.condition_id === "" || data.condition_id === 4294967295) {
      delete data.condition_id
    }
    if (data.description === "") {
      delete data.description
    }
    if (data.media === "") {
      delete data.media
    }
    if (data.min_trade_value === "" || parseInt(data.min_trade_value) === -1) {
      delete data.min_trade_value
    }
    if (data.name === "") {
      delete data.name
    }
    if (data.status === "" || data.status === -1) {
      delete data.status
    }
    if (data.value === "" || parseInt(data.value) === -1) {
      delete data.value
    }

    return await payload.data.vStuffIds.forEach((id) => {
      this.db.stuff.update({ id: id }, data)
    })
  }

  async destroy(payload) {
    return await payload.data.vStuffIds.forEach((id) => {
      this.db.stuff.destroy({ id: id })
    })
  }
}

module.exports = stuffRepository