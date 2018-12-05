const masterRepository = require('./master')

class accountRepository extends masterRepository {
  
  async create(id, payload, blockInfo) {
    const data = {
      id: id,
      address: null,
      avatar: payload.data.avatar,
      city: payload.data.city,
      country: payload.data.country,
      first_name: null,
      last_name: null,
      state: payload.data.state,
      username: payload.data.username,
      zip: payload.data.zip,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.accounts.insert(data)
  }

  async update(payload, blockInfo) {
    // Formulate data
    let data = {
      avatar: payload.data.avatar,
      city: payload.data.city,
      country: payload.data.country,
      state: payload.data.state,
      zip: payload.data.zip,
      updated_at: blockInfo.timestamp
    }

    // Validate
    if (data.avatar === "") {
      delete data.avatar
    }
    if (data.city === "") {
      delete data.city
    }
    if (data.country === "") {
      delete data.country
    }
    if (data.state === "") {
      delete data.state
    }
    if (data.zip.toString().length !== 5) {
      delete data.zip
    }

    return await this.db.accounts.update({ username: payload.data.username }, data)
  }

  async destroy(payload) {
    return await this.db.accounts.destroy({ username: payload.data.username })
  }
}

module.exports = accountRepository