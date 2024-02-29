const { Roles, Users, UserTestReport, Sequelize } = require('../models');

class UserQueries {
  table() {
    return this.Users;
  }

  async getUser(filter = null) {
    const query = {
      raw: true,
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'password',
        [Sequelize.col('user_role.role'), 'role'],
      ],
      include: [
        {
          model: Roles,
          attributes: [],
          as: 'user_role',
        },
      ],
    };

    if (filter) query.where = filter;

    return await this.table().findOne(query);
  }

  async createUser(userData) {
    return await this.table().create(userData);
  }

  async createUserTestReport(userTestReport) {
    return await UserTestReport.create(userTestReport);
  }
}

module.exports = new UserQueries();
