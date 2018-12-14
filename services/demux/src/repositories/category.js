const masterRepository = require('./master')

class categoryRepository extends masterRepository {
  
  async create(data) {
    return this.db.categories.insert(data)
  }

  async update(id, data) {
    // Validate
    if (data.name === "") {
      delete data.name
    }

    return await this.db.categories.update({ id: id }, data)
  }

  async destroy(id, time) {
    return await this.db.categories.update({ id: id }, {deletedat: time})
  }
}

module.exports = categoryRepository