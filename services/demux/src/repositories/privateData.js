const masterRepository = require('./master')

class accountRepository extends masterRepository {

  async stampId(username, data) {
    return await this.db.private_account_data.update({ username: username }, data)
  }

  async destroy(username) {
    return await this.db.private_account_data.destroy({ username: username })
  }
}

module.exports = accountRepository
