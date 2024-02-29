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
 * Register a user.
 * @param {string} first_name - first name of the person
 * @param {string} last_name - last name of the person
 * @param {string} email - email of the person
 * @param {string} password - password
 * @param {string} confirm_password - final Password
 * @returns {JSON} Returns the json value
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
 * Login a user.
 * @param {string} email - first name of the person
 * @param {string} password - password
 * @returns {JSON} Returns the json value
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
