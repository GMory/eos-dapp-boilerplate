const masterRepository = require('./master')

class offerStuffRepository extends masterRepository {
  
  async create(offerStuff, offer) {
    return await offerStuff.forEach((stuff) => {
      if (stuff.offer_id === offer.id) {
        this.db.offerstuff.insert({
          id: stuff.id,
          stuff_id: stuff.stuff_id,
          offer_id: stuff.offer_id
        })
      } else {
        console.log('error')
      }
    })
  }

  async destroy(ids, time) {
    return await ids.forEach((id) => {
      this.db.offerstuff.update({ id: id }, {deletedat: time})
    })
  }
}

module.exports = offerStuffRepository