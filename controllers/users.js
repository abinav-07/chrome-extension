const Joi = require("joi");
const { ValidationException } = require("../exceptions/httpsExceptions");

//Queries
const QuestionsQueries = require("../queries/questions");
const UserQueries = require("../queries/users");
const TestQueries = require("../queries/tests");

const getAvailableTestsForUsers = async (req, res, next) => {

    try {

        const getTests = await TestQueries.getTests({ is_available: true });

        if (!getTests || !getTests.length > 0) {
            res.status(200).json({ message: "No Tests Available" }); return;
        }

        const getAllAvailableTests = getTests.map(data => ({
            test_id: data.id,
            title: data.title,
            description: data.description,
            is_available: data.is_available
        }));

        res.status(200).json(getAllAvailableTests);

    } catch (err) {
        next(err);
    }
}

const createUserTestReport = async (req, res, next) => {
    const { user_id } = req.user;

    const data = req.body;
    const schema = Joi.object({
        test_id: Joi.number().required(),
        user_answers: Joi.array().min(1).items(
            Joi.object({
                question_id: Joi.number().required(),
                option_id: Joi.number().required()
            })
        ).required(),
    });

    const validationResult = schema.validate(data, { abortEarly: false });

    try {

        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        const correctAnswers = await QuestionsQueries.getCorrectAnswers({ test_id: data.test_id });

        //Sorting Answers for Correct Comparisons of objects
        const sortedCorrectAnswers = JSON.stringify(correctAnswers.sort((a, b) => a.question_id - b.question_id));

        const sortedUserAnswers = JSON.stringify(data.user_answers.sort((a, b) => a.question_id - b.question_id));

        //Both Lengths must be equal to insure user answered all questions
        if (sortedCorrectAnswers.length !== sortedUserAnswers.length) throw new ValidationException(null, "All test question not sent in body!");

        const has_passed = sortedCorrectAnswers === sortedUserAnswers;

        await UserQueries.createUserTestReport({
            test_id: data.test_id,
            user_id: user_id,
            has_passed: has_passed
        });

        const payload = {
            test_id: data.test_id,
            has_passed: has_passed
        };

        res.status(200).json(payload);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUserTestReport,
    getAvailableTestsForUsers
}