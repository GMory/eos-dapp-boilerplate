const masterRepository = require('./master')

class offerRepository extends masterRepository {
  async create(data) {
    return this.db.offers.insert(data)
  }

  async accept(id, data) {
    return await this.db.offers.update({ id: id }, data)
  }

  async decline(id, data) {
    return await this.db.offers.update({ id: id }, data)
  }

  async renew(id, data) {
    return await this.db.offers.update({ id: id }, data)
  }

  async destroy(ids) {
    return await ids.forEach((id) => {
      this.db.offers.destroy({ id: id })
    })
  }
}

module.exports = offerRepository