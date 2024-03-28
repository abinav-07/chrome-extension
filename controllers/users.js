const Joi = require("joi")
const { ValidationException } = require("../exceptions/httpsExceptions")
const bcrypt = require("bcrypt")

//Queries
const UserQueries = require("../queries/users")

/**
 * @method Update User
 * 
 * @description PATCH Request-> Update currently logged in user
 * 
 * @param PATCH /user/update
 * @param {string} first_name - The updated first name of the user.
 * @param {string} last_name - The updated last name of the user.
 * @param {string} email - The updated email of the user.
 * @param {string} password - The new password.
 * @param {string} confirm_password - The confirmation of the new password.
 * 
 * @example 
 * {
    "first_name":"Test",
    "last_name":"Me",
    "email":"test@mailinator.com",
    "password":"Test@123",
    "confirm_password":"Test@123"
 * }
 *   
 * @returns {Object} Returns a JSON object representing the updated user data.
 * @throws {Error} Throws an error if the update process fails.
 */
const update = async (req, res, next) => {
  // get payload
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})"))
      .messages({
        "string.pattern.base": "Password must contain alphabets and numbers",
        "string.required": "Password is required",
      }),
    confirm_password: Joi.string().equal(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "string.required": "Confirm Password is required",
    }),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    // Get autheticated user from our req payload, set in JWT
    const { user_id } = req.user

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists in our DB
    const checkUser = await UserQueries.getUser({ id: user_id })

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Check if email already exists
    const user = await UserQueries.getUser({ email: data.email })

    // Check if email already exists
    if (user && user.email && checkUser.email !== data.email)
      throw new ValidationException(null, "Email Already Exists!")

    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    //Remove Confirmed Password from body data
    delete data.confirm_password

    // Update user
    await UserQueries.updateUser(user_id, data)

    res.status(200).json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @method Delete User
 *
 * @param DELETE /user/delete
 *
 * @description DELETE Request-> Delete currently logged in user.
 * @returns {Object} Returns the json value
 */
const deleteOne = async (req, res, next) => {
  try {
    // Get autheticated user from our req payload, set in JWT
    const { user_id } = req.user

    // Check if user exists in our DB
    const checkUser = await UserQueries.getUser({ id: user_id })

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Delete User
    await UserQueries.deleteUser(user_id)

    const payload = {
      success: true,
    }

    res.status(200).json(payload)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  update,
  deleteOne,
}
