const { UserFeatures } = require("../models")

/*
 Create a class named UserFeatures which will be used to
 communicate with the database using sequelize
*/
class UserFeaturesQueries {
  table() {
    return UserFeatures
  }

  async getAll(query){
    return await this.table().findAll(query)
  }

  // Get using id or any fitler
  async getOne(filter = null) {
    const query = {
      raw: true,
    }

    if (filter) query.where = filter

    return await this.table().findOne(query)
  }

  // Create new 
  async create(userFeatures,transaction=null) {
    return await this.table().create({...userFeatures},{transaction})
  }

  // update using id and values
  async update(values,transaction=null) {
    return await this.table().update(
      { ...values },
      {
        where: {
          feature_id:values?.feature_id,
          user_id:values?.user_id,
        },
        transaction
      },
    )
  }

  // delete using id
  async delete(id,transaction=null) {
    return await this.table().destroy({
      where: {
        id,
      },
      transaction
    })
  }
}

module.exports = new UserFeaturesQueries()
