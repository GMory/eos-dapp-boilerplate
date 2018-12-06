const masterRepository = require('./master')

class likeRepository extends masterRepository {
  
  async create(data) {
    return this.db.likes.insert(data)
  }

  async destroy(ids) {
    return await ids.forEach((id) => {
      this.db.likes.destroy({ id: id })
    })
  }
}

module.exports = likeRepository