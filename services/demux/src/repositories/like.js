const masterRepository = require('./master')

class likeRepository extends masterRepository {
  
  async create(data) {
    return this.db.likes.insert(data)
  }

  async destroy(ids, time) {
    return await ids.forEach((id) => {
      this.db.likes.update({ id: id }, {deletedat: time})
    })
  }
}

module.exports = likeRepository