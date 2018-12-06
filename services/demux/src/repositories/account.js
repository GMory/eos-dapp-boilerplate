const masterRepository = require('./master')

class accountRepository extends masterRepository {
  
  async create(data) {
    return this.db.accounts.insert(data)
  }

  async update(username, data) {
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

    return await this.db.accounts.update({ username: username }, data)
  }

  async destroy(username) {
    return await this.db.accounts.destroy({ username: username })
  }
}

module.exports = accountRepository
