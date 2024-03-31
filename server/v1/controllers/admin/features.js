const Joi = require("joi")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const FeatureQueries = require("../../queries/features")
const UserFeatureQueries = require("../../queries/user_features")
const {  sequelize } = require("../../models")
const { Op, QueryTypes } = require("sequelize")


/**
 * @api {get} /v1/admin/feature Get All Feature
 * @apiName GetAll
 * @apiGroup Features
 * @apiDescription Get All features with child table
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

const getAll=async(req,res,next)=>{
    try{
        // Get All features with child table data
        const getAllFeatures=await sequelize.query("SELECT `features`.*,`user_features`.`user_id`,`user_features`.`access`,`user_features`.`enabled`  FROM `features` LEFT JOIN `user_features` ON `user_features`.`feature_id`=`features`.`id`", { type: QueryTypes.SELECT })

        res.status(200).json(getAllFeatures)
    }catch(err){
        next(err)
    }
}

/**
 * @api {post} /v1/admin/feature/create Create Feature
 * @apiName CreateFeature
 * @apiGroup Features
 * @apiDescription Create feature
 *
 * @apiParam {String} feature_name Name of feature
 * @apiParam {Boolean} active Active status of features
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "success": true
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
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
const create=async(req,res,next)=>{
    // get payload
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    feature_name: Joi.string().required(),
    active: Joi.boolean().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })
  try{

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)


    const checkDuplicate=await FeatureQueries.getFeature({
        feature_name:data?.feature_name
    })
    if(checkDuplicate) throw new ValidationException(null, "Feature name already exists!")

    await FeatureQueries.createFeature(data)

    res.status(200).json({
        success: true,
      })

  }catch(err){
    next(err)
  }
}


/**
 * @api {patch} /v1/admin/feature/update Update Feature
 * @apiName UpdateFeature
 * @apiGroup Features
 * @apiDescription Update currently selected feature
 *
 * @apiParam {String} feature_name Name of feature
 * @apiParam {Boolean} active Active status of features
 * @apiParam {Number} user_id User id.
 * @apiParam {Number} feature_id Feature id.
 * @apiParam {String} access Access type.
 * @apiParam {Boolean} enabled If feature is enabled for user or not
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "success": true
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
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
const update = async (req, res, next) => {
  // get payload
  let t;
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    feature_name: Joi.string().required(),
    active: Joi.boolean().required(),
    user_id: Joi.number().required(),
    feature_id: Joi.number().required(),
      access: Joi.string().required(),
      enabled: Joi.boolean().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // First, we start a transaction from your connection and save it into a variable
    t=await sequelize.transaction();


    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Required Payloads
    const featuresPayload={
        feature_name:data?.feature_name,
        active:data?.active,
    }

    const usersFeaturesPayload={
        user_id:data?.user_id,
        feature_id:data?.feature_id,
        access:data?.access,
        enabled:data?.enabled,
    }

        // Check if features exists in our DB
        const checkFeatures = await FeatureQueries.getFeature({ id: data?.feature_id })

        if (!checkFeatures) throw new ValidationException(null, "Feature not found!")

        // Check if features name already exists in our DB
        const checkDuplicate = await FeatureQueries.getFeature(
            { id: {
            [Op.ne]:data?.feature_id
            },
            feature_name:data?.feature_name
        })

        if (checkDuplicate) throw new ValidationException(null, "Duplicate feature name found!")

        // Update Features
        await FeatureQueries.updateFeature(data?.feature_id,featuresPayload,t)
    
        // Update Create UserFeatures
        // Check if userFeatures exists in our DB and upsert
        const checkUserFeatures = await UserFeatureQueries.getOne({ feature_id: data?.feature_id,user_id: data?.user_id })

        if(!checkUserFeatures){
            await UserFeatureQueries.create(usersFeaturesPayload,t)
        } else{
            await UserFeatureQueries.update(usersFeaturesPayload,t)
        }

    await t.commit()
    res.status(200).json({
      success: true,
    })
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

/**
 * @api {post} /v1/admin/feature/user/create Create Users Features
 * @apiName CreateUserFeatures
 * @apiGroup Features
 * @apiDescription Create feature and user many to many data
 *
 * @apiParam {number} feature_id feature id
 * @apiParam {string} access Access status of features
 * @apiParam {number} user_id User id
 * @apiParam {boolean} enabled enabled status 
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "success": true
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
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
const createUserfeatures=async(req,res,next)=>{
    // get payload
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    feature_id: Joi.number().required(),
    user_id: Joi.number().required(),
    access: Joi.string().required(),
    enabled: Joi.boolean().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })
  try{

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)


    const checkDuplicate=await UserFeatureQueries.getOne({
        feature_id:data?.feature_id,
        user_id:data?.user_id,
    })
    if(checkDuplicate) throw new ValidationException(null, "User Feature already exists!")

    await UserFeatureQueries.create(data)

    res.status(200).json({
        success: true,
      })

  }catch(err){
    next(err)
  }
}


/**
 * @api {delete} /v1/admin/feature/:feature_id/delete Delete Feature
 * @apiName DeleteOne
 * @apiGroup Features
 * @apiDescription Delete Features and its child datas
 *
 * @apiParam {number} feature_id Feature id
 * 
 * @apiSuccess {Object} Returns the JSON object representing the success message.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiError {Object} error Error object if the deletion process fails.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Err message."
 *     }
 */
const deleteOne = async (req, res, next) => {
// get payload
const data = req.params
let t
    try {

        // First, we start a transaction from your connection and save it into a variable
   t = await sequelize.transaction();
    
            // Check if features exists in our DB
            const checkFeatures = await FeatureQueries.getFeature({ id: data?.feature_id })

            if (!checkFeatures) throw new ValidationException(null, "Feature not found!")


            // Delete User Features
            await UserFeatureQueries.delete(data?.feature_id)
            await FeatureQueries.delete(data?.feature_id)

    const payload = {
      success: true,
    }

    await t.commit()

    res.status(200).json(payload)
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

module.exports = {
    create,
    getAll,
  update,
  createUserfeatures,
  deleteOne,
}
