const { Questions, Options, Sequelize } = require("../models");

class QuestionsQueries {
    table() {
        return Questions;
    }

    async getCorrectAnswers(filter) {
        const query = {
            raw: true,
            attributes: [
                ["id", "question_id"],
                [Sequelize.col("Options.id"), "option_id"]
            ],
            include: [
                {
                    model: Options,
                    as: "options",
                    attributes: [],
                    where: {
                        is_correct: true
                    }
                }
            ]
        }

        if (filter) query.where = filter;

        return await this.table().findAll(query);
    }

    async createQuestionsAndAnswers(data) {
        return await this.table()
            .create({ title: data.title, test_id: data.test_id }) //Create Question First
            .then(async questionData => {

                let question_id = questionData.id;

                //Bulk Add Question id to options
                let options = data.options.map(optionData => ({
                    title: optionData.title,
                    is_correct: optionData.is_correct,
                    question_id: question_id
                }));

                //Bulk Create Options
                await Options.bulkCreate(options);
            });
    }
}

module.exports = new QuestionsQueries();