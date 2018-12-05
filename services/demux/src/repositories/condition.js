const masterRepository = require('./master')

class conditionRepository extends masterRepository {
  
  async create(id, payload, blockInfo) {
    const data = {
      id: id,
      name: payload.data.name,
      created_at: blockInfo.timestamp,
      updated_at: null,
      deleted_at: null,
    }
    
    return this.db.conditions.insert(data)
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

    return await this.db.conditions.update({ id: payload.data.condition_id }, data)
  }

  async destroy(payload) {
    return await this.db.conditions.destroy({ id: payload.data.condition_id })
  }
}

module.exports = conditionRepository