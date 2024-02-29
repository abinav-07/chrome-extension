const { Roles } = require("../models");

class RoleQueries {
    table() {
        return Roles;
    }

    async getRoles(filter = null) {
        const query = {};

        if (filter) query.where = filter;

        return await this.table().findOne(query);
    }
}

module.exports = new RoleQueries();