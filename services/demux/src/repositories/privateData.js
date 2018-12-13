const masterRepository = require('./master')

class accountRepository extends masterRepository {
  
  async stampId(username, id) {
    return await this.db.private_account_data.update({ username: username }, {account_id: id})
  }
}

module.exports = accountRepository
