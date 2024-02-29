const express = require('express');
const checkJWTToken = require('../middlewares/auth/checkJWT');
const router = express.Router();

//Services
const UserServices = require('../controllers/users');
const AuthenticationServices = require('../controllers/authentication');
const TestServices = require('../controllers/tests');

//Routes
router.post('/register-user', AuthenticationServices.registerUser);
router.get('/login-user', AuthenticationServices.loginUser);

router.use(checkJWTToken);
router.get('/all-available-tests', UserServices.getAvailableTestsForUsers);

router.get('/take-test/:test_id?', checkJWTToken, TestServices.getTestDetails);
router.post(
  '/generate-user-test-report',
  checkJWTToken,
  UserServices.createUserTestReport
);

module.exports = router;
