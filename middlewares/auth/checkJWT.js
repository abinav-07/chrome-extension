const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { UnauthorizedException } = require("../../exceptions/httpsExceptions");

//Secret Key
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

const checkJWTToken = (req, res, next) => {

    try {
        let jwtToken = req.headers.authorization;
        if (jwtToken.startsWith("Bearer")) {
            jwtToken = jwtToken.split(" ")[1];//Bearer xa2132
        }
        var decodedToken = jwt.verify(jwtToken, jwtSecretKey);
        req.user = decodedToken;
        next();
    } catch (err) {
        next(new UnauthorizedException(null, "Invalid JWT Token"));
    };
};

module.exports = checkJWTToken;

