const masterRepository = require('./master')

class stuffRepository extends masterRepository {
  
  async create(data) {
    return this.db.stuff.insert(data)
  }

  async update(ids, data) {
    // Validate
    if (data.category_id === "" || data.category_id === 4294967295) {
      delete data.category_id
    }
    if (data.condition_id === "" || data.condition_id === 4294967295) {
      delete data.condition_id
    }
    if (data.description === "") {
      delete data.description
    }
    if (data.media === "") {
      delete data.media
    }
    if (data.min_trade_value === "" || parseInt(data.min_trade_value) === -1) {
      delete data.min_trade_value
    }
    if (data.name === "") {
      delete data.name
    }
    if (data.status === "" || data.status === -1) {
      delete data.status
    }
    if (data.value === "" || parseInt(data.value) === -1) {
      delete data.value
    }

    return await ids.forEach((id) => {
      this.db.stuff.update({ id: id }, data)
    })
  }

  async destroy(ids, time) {
    return await ids.forEach((id) => {
      this.db.stuff.update({ id: id }, {deletedat: time})
    })
  }
}

module.exports = stuffRepository