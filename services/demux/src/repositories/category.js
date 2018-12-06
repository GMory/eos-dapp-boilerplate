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

  async destroy(id) {
    return await this.db.categories.destroy({ id: id })
  }
}

module.exports = categoryRepository