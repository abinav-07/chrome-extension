const Joi = require("joi");
const { ValidationException } = require("../exceptions/httpsExceptions");

//Queries
const TestQueries = require("../queries/tests");

const createTests = async (req, res, next) => {
    const data = req.body;
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        is_available: Joi.boolean().required()
    });

    const validationResult = schema.validate(data, { abortEarly: false });

    try {
        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        const testAlreadyExists = await TestQueries.getTests({ title: data.title });

        if (testAlreadyExists && testAlreadyExists.length > 0) throw new ValidationException(null, "Test Already Exists!");

        const testData = await TestQueries.createTests(data);

        res.status(200).json(testData);

    } catch (err) {
        next(err);
    }
};

const getTestDetails = async (req, res, next) => {
    const { test_id } = req.params || {};

    try {

        if (!test_id) throw new ValidationException(null, "Test id missing in params!");

        const testData = await TestQueries.getTests({ id: test_id });

        const getTestQuestion = testData.map(data => (
            data["test_questions"]
        )).flat(); //Flat Out any Extra Unnecessary Array From Map

        res.status(200).json(getTestQuestion);

    } catch (err) {
        next(err);
    }

}

const getTestUserReport = async (req, res, next) => {
    const { has_passed } = req.body;

    const schema = Joi.object({
        has_passed: Joi.boolean()
    });

    const validationResult = schema.validate(req.body, { abortEarly: false });

    try {
        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        const userReport = await TestQueries.getTestUserReport({ has_passed: has_passed });

        res.status(200).json(userReport);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    createTests,
    getTestUserReport,
    getTestDetails
}