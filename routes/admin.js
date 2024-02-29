const express = require('express');
const authenticateAdmin = require('../middlewares/auth/adminVerification');
const checkJWTToken = require('../middlewares/auth/checkJWT');

const router = express.Router();

//Services
const TestsService = require('../controllers/tests');
const QuestionsService = require('../controllers/questions');

//Routes
router.post(
  '/create-tests',
  [checkJWTToken, authenticateAdmin],
  TestsService.createTests
);
router.get(
  '/get-user-report',
  [checkJWTToken, authenticateAdmin],
  TestsService.getTestUserReport
);
router.post(
  '/add-questions-and-answers',
  [checkJWTToken, authenticateAdmin],
  QuestionsService.addQuestionAndAnswers
);

module.exports = router;
