const express = require("express")

const router = express.Router()

//Services
const AuthenticationServices = require("../controllers/authentication")
const FeatureServices = require("../controllers/users/features")
const { checkJWTToken } = require("../middlewares/auth/checkJWT")

// Authentication routes
router.post("/auth/register", AuthenticationServices.registerUser)
router.post("/auth/login", AuthenticationServices.loginUser)

// Middleware
router.use(checkJWTToken)

router.get("/features", FeatureServices.getAll)

module.exports = router
