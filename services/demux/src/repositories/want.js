const masterRepository = require('./master')

class wantRepository extends masterRepository {
  
  async create(data) {
    return this.db.wants.insert(data)
  }

  async destroy(ids, time) {
    return await ids.forEach((id) => {
      this.db.wants.update({ id: id }, {deletedat: time})
    })
  }
}

module.exports = wantRepository