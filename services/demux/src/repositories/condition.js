const masterRepository = require('./master')

class conditionRepository extends masterRepository {
  
  async create(data) {
    return this.db.conditions.insert(data)
  }

  async update(id, data) {
    // Validate
    if (data.name === "") {
      delete data.name
    }

    return await this.db.conditions.update({ id: id }, data)
  }

  async destroy(id) {
    return await this.db.conditions.destroy({ id: id })
  }
}

module.exports = conditionRepository