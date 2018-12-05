const masterRepository = require('./master')

class categoryRepository extends masterRepository {
  
  async create(id, payload, blockInfo) {
    const data = {
      id: id,
      name: payload.data.name,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.categories.insert(data)
  }

  async update(payload, blockInfo) {
    // Formulate data
    let data = {
      name: payload.data.name,
      updated_at: blockInfo.timestamp
    }

    // Validate
    if (data.name === "") {
      delete data.name
    }

    return await this.db.categories.update({ id: payload.data.category_id }, data)
  }

  async destroy(payload) {
    return await this.db.categories.destroy({ id: payload.data.category_id })
  }
}

module.exports = categoryRepository