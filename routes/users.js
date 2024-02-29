const express = require("express")
const checkJWTToken = require("../middlewares/auth/checkJWT")
const router = express.Router()

//Services
const UserServices = require("../controllers/users")
const AuthenticationServices = require("../controllers/authentication")

//Routes

// Authentication routes
router.use("/auth")
router.post("/register-user", AuthenticationServices.registerUser)
router.get("/login-user", AuthenticationServices.loginUser)

// User UD routes
router.use("/user", checkJWTToken)
router.put("/update", UserServices.update)
router.delete("/update", UserServices.deleteOne)

module.exports = router
