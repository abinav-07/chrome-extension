const express = require("express")
const { checkAdmin, checkJWTToken } = require("../middlewares/auth/checkJWT")

const router = express.Router()

//Services
const UserServices = require("../controllers/admin/users")
const FeatureServices = require("../controllers/admin/features")

router.use(checkJWTToken, checkAdmin)

// User Routes
router.get("/members", UserServices.getAll)

// Features routes
router.get("/feature", FeatureServices.getAll)
router.post("/feature/create", FeatureServices.create)
router.post("/feature/user/create", FeatureServices.createUserfeatures)
router.patch("/feature/update", FeatureServices.update)
router.delete("/feature/:feature_id/delete", FeatureServices.deleteOne)

// User Routes
router.patch("/user/update", UserServices.update)
router.delete("/user/delete", UserServices.deleteOne)

module.exports = router
