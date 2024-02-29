const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { ValidationException } = require("../exceptions/httpsExceptions");

//Queries
const UsersQueries = require("../queries/users");
const RoleQueries = require("../queries/role");


const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

const registerUser = async (req, res, next) => {
    const data = req.body;

    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})'))
            .messages({
                'string.pattern.base': "Password must contain alphabets and numbers",
                'string.required': 'Password is required'
            }),
        confirm_password: Joi.string().equal(Joi.ref("password")).required()
            .messages({
                'any.only': "Passwords do not match",
                'string.required': 'Confirm Password is required'
            }),
        role_id: Joi.number().required()
    });

    const validationResult = schema.validate(data, { abortEarly: false });

    try {
        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        //Hash Password
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        data.password = hashedPassword;

        //Remove Confirmed Password from body data 
        delete data.confirm_password;

        const user = await UsersQueries.getUser({ email: data.email });

        const roleResponse = await RoleQueries.getRoles({ id: data.role_id });

        //Check Role and User
        if (!roleResponse || !roleResponse.role) throw new ValidationException(null, "Role Not Found!");

        if (user && user.email) throw new ValidationException(null, "User Already Registered!");

        const registerResponse = await UsersQueries.createUser(data);

        const payload = {
            user_id: registerResponse.id,
            first_name: registerResponse.first_name,
            last_name: registerResponse.last_name,
            email: registerResponse.email,
            role: roleResponse.role
        }

        const token = jwt.sign(payload, jwtSecretKey);

        res.status(200).json({
            user: payload,
            token
        });

    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    const data = req.body;

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    const validationResult = schema.validate(data, { abortEarly: false });

    try {
        if (validationResult && validationResult.error) throw new ValidationException(null, validationResult.error);

        const user = await UsersQueries.getUser({ email: data.email });

        if (!user || !user.email) throw new ValidationException(null, "User Not Registered");

        if (user && (user.password && !bcrypt.compareSync(data.password, user.password))) throw new ValidationException(null, "Password did not match");

        const payload = {
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, jwtSecretKey);

        res.status(200).json({
            user: payload,
            token
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
  registerUser,
  loginUser
};
