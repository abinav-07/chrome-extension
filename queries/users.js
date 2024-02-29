const { Users } = require('../models');

/*
 Create a class named UserQueries which will be used to 
 communicate with the database using sequelize
*/
class UserQueries {
  table() {
    return this.Users;
  }

  // Get User using id or any fitler
  async getUser(filter = null) {
    const query = {
      raw: true,
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'password',
      ],
    };

    if (filter) query.where = filter;

    return await this.table().findOne(query);
  }

  // Create new user
  async createUser(userData) {
    return await this.table().create(userData);
  }

  // update user using id and values
  async updateUser(id,values) {
    return await this.table().update(
      {...values},
      {
        where:{
          id,
        },
        // Return updated values
        returning: true,
      }
    )
  }

  // delete user using id
  async deleteUser(id) {
    return await this.table().destroy({
      where:{
        id,
      }
    })
  }
}

module.exports = new UserQueries();
