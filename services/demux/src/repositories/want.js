const masterRepository = require('./master')

class wantRepository extends masterRepository {
  
  async create(data) {
    return this.db.wants.insert(data)
  }

  async destroy(ids) {
    return await ids.forEach((id) => {
      this.db.wants.destroy({ id: id })
    })
  }
}

module.exports = wantRepository