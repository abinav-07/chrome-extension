const Joi = require("joi")
const { ValidationException } = require("../exceptions/httpsExceptions")

//Queries
const UserQueries = require("../queries/users")

/**
 * Update a user.
 * @param {string} first_name - first name of the person
 * @param {string} last_name - last name of the person
 * @param {string} email - email of the person
 * @param {string} password - password
 * @param {string} confirm_password - final Password
 * @returns {JSON} Returns the json value
 */
const update = async (req, res, next) => {
  // Get autheticated user from our req payload, set in JWT
  const { user_id } = req.user
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
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists in our DB
    const checkUser = await UserQueries.getUser({ id: user_id })

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Check if email already exists
    const user = await UserQueries.getUser({ email: data.email })

    if (user && user.email) throw new ValidationException(null, "Email Already Exists!")

    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    //Remove Confirmed Password from body data
    delete data.confirm_password

    // Update user
    const updateUser = await UserQueries.updateUser(user_id, data)

    const payload = {
      user_id: updateUser.id,
      first_name: updateUser.first_name,
      last_name: updateUser.last_name,
      email: updateUser.email,
    }

    res.status(200).json({
      success: true,
      user: payload,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete currently logged in user.
 * @returns {JSON} Returns the json value
 */
const deleteOne = async (req, res, next) => {
  // Get autheticated user from our req payload, set in JWT
  const { user_id } = req.user

  try {
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
