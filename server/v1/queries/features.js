const { Features } = require("../models")

/*
 Create a class named FeatureQueries which will be used to
 communicate with the database using sequelize
*/
class FeatureQueries {
  table() {
    return Features
  }

  async getAll(query){
    return await this.table().findAll(query)
  }

  // Get User using id or any fitler
  async getFeature(filter = null) {
    const query = {
      raw: true,
    }

    if (filter) query.where = filter

    return await this.table().findOne(query)
  }

  // Create new feature
  async createFeature(featureData,transaction=null) {
    return await this.table().create({...featureData},{transaction})
  }

  // update feature using id and values
  async updateFeature(id, values,transaction=null) {
    
    return await this.table().update(
      { ...values },
      {
        where: {
          id,
        },
        transaction
      },
    )
  }

  // delete feature using id
  async delete(id,transaction) {
    return await this.table().destroy({
      where: {
        id,
      },
      transaction
    })
  }
}

module.exports = new FeatureQueries()
