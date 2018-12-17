const masterRepository = require('./master')

class tradeRepository extends masterRepository {
  async create(data) {
    return this.db.trades.insert(data)
  }

  async stuffsent(id, data) {
    return await this.db.trades.update({ id: id }, data)
  }

  async stuffrecv(id, data) {
    return await this.db.trades.update({ id: id }, data)
  }

  async complete(id, data) {
    return await this.db.trades.update({ id: id }, data)
  }

  async destroy(id, data) {
    return await this.db.trades.update({ id: id }, data)
  }
}

module.exports = tradeRepository