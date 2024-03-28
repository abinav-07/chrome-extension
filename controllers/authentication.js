const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../exceptions/httpsExceptions")

//Queries
const UsersQueries = require("../queries/users")

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @method Register User
 * 
 * @description POST Request-> Register a user
 * 
 * @param POST  /auth/register
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
const registerUser = async (req, res, next) => {
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
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    //Remove Confirmed Password from body data
    delete data.confirm_password

    const user = await UsersQueries.getUser({ email: data.email })

    if (user && user.email) throw new ValidationException(null, "User Already Registered!")

    // Create new user
    const registerResponse = await UsersQueries.createUser(data)

    const payload = {
      user_id: registerResponse.id,
      first_name: registerResponse.first_name,
      last_name: registerResponse.last_name,
      email: registerResponse.email,
    }

    // Auth sign in
    const token = jwt.sign(payload, jwtSecretKey)

    res.status(200).json({
      user: payload,
      token,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @method Login User
 * 
 * @description POST Request-> Log in user
 * 
 * @param POST /auth/login
 * @param {string} email - first name of the person
 * @param {string} password - password
 * 
 * @example 
 * {
    "email":"test@mailinator.com",
    "password":"Test@123"
 * }
 *
 * @returns {Object} Returns a JSON object representing the updated user data.
 * @throws {Error} Throws an error if the update process fails.
 */
const loginUser = async (req, res, next) => {
  const data = req.body

  // Joi validation
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists
    const user = await UsersQueries.getUser({ email: data.email })

    if (!user || !user.email) throw new ValidationException(null, "User Not Registered")

    if (user && user.password && !bcrypt.compareSync(data.password, user.password))
      throw new ValidationException(null, "Password did not match")

    const payload = {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }

    // Auth sign in
    const token = jwt.sign(payload, jwtSecretKey)

    res.status(200).json({
      user: payload,
      token,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
}
