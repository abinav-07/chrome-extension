const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { UnauthorizedException } = require("../../exceptions/httpsExceptions");

//Secret Key
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

// Middleware
const checkJWTToken = (req, res, next) => {
    try {
        // Get token from headers
        let jwtToken = req.headers.authorization;
        if (jwtToken.startsWith("Bearer")) {
            jwtToken = jwtToken.split(" ")[1];//Bearer xa2132
        }
        // Decode the token from the header with the token that we signed in during login/register
        var decodedToken = jwt.verify(jwtToken, jwtSecretKey);
        req.user = decodedToken;
        // Call next middleware if all is good
        next();
    } catch (err) {
        // Throw err
        next(new UnauthorizedException(null, "Invalid JWT Token"));
    };
};

module.exports = checkJWTToken;

