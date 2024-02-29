const Joi = require("joi");
const { ValidationException } = require("../exceptions/httpsExceptions");

//Queries
const QuestionsQueries = require("../queries/questions");
const TestQueries = require("../queries/tests");

const addQuestionAndAnswers = async (req, res, next) => {
    const data = req.body;

    const schema = Joi.object({
        test_id: Joi.number().required(),
        title: Joi.string().required(),
        options: Joi.array().min(1).items(
            Joi.object({
                title: Joi.string().required(),
                is_correct: Joi.boolean().required()
            })
        ).required(),
    });

    const validationResult = schema.validate(data, { abortEarly: false });

    try {

        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        const testAlreadyExists = await TestQueries.getTests({ id: data.test_id });

        if (!testAlreadyExists || !testAlreadyExists.length > 0) throw new ValidationException(null, "Test Not Found!");

        //Create Questions
        await QuestionsQueries.createQuestionsAndAnswers(data);

        res.status(200).send("Questions Added");

    } catch (err) {
        next(err);
    }
}

module.exports = {
    addQuestionAndAnswers
}