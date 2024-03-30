const express = require("express")
const checkJWTToken = require("../middlewares/auth/checkJWT")

const router = express.Router()

//Services
const UserServices = require("../controllers/users")

// User UD routes
router.use(checkJWTToken)
router.patch("/user/update", UserServices.update)
router.delete("/user/delete", UserServices.deleteOne)

module.exports = router
