const UserFeatureQueries = require("../../queries/user_features")
const { Op } = require("sequelize")

/**
 * @api {get} /v1/features Get Feature
 * @apiName GetAll
 * @apiGroup Users
 * @apiDescription Get All features acccessable by user
 *
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "features": FeaturePayload
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "features": FeaturePayload
 * }
 *
 * @apiError {Object} error Error object if the update process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "error": "Error message"
 * }
 */
const getAll = async (req, res, next) => {
  try {
    const { user } = req

    // Get All features with child table data
    const getAllFeatures = await UserFeatureQueries.getAll({
      where: {
        user_id: user?.id,
        // Only get access type read and write
        access:{[Op.ne]:"none"},
        // Nested where clause, only get active features for users
        ["$features.active$"]: true,
      },
      include: { all: true },
    })

    res.status(200).json(getAllFeatures)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
}
