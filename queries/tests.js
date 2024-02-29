const { Tests, Questions, Options, UserTestReport, Users, Sequelize } = require("../models");

class TestsQueries {
    table() {
        return Tests;
    }

    async getTests(filter = null) {
        const query = {
            attributes: ["id", "title", "description", "is_available"],
            include: [
                {
                    model: Questions,
                    attributes: [["id", "question_id"], "title", "type", "test_id"],
                    as: "test_questions",
                    required: false,
                    include: [
                        {
                            model: Options,
                            attributes: [["id", "option_id"], "title", "question_id"],
                            as: "options",
                            required: false
                        }
                    ]
                }
            ]
        };

        if (filter) query.where = filter;

        return await this.table().findAll(query);
    }

    async createTests(data) {
        return await this.table().create(data);
    }

    async getTestUserReport(filter = null) {

        const query = {
            attributes: [
                ["id", "test_id"], "title", "description", "is_available"
            ],
            include: [
                {
                    raw: true,
                    model: UserTestReport,
                    attributes: [
                        "has_passed",
                    ],
                    as: "user_test_report",
                    include: [
                        {
                            model: Users,
                            attributes: [["id", "user_id"], "first_name", "last_name", "email"],
                            as: "user_detail"
                        }
                    ]
                }
            ]
        };

        if (filter.has_passed) query.include[0]["where"] = filter;

        return await Tests.findAll(query);

    };

}

module.exports = new TestsQueries();