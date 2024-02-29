const { USER_TYPES } = require('../../enums');
const { UnauthorizedException } = require("../../exceptions/httpsExceptions");

const authenticateAdmin = (req, res, next) => {
    const { user } = req;
    if (user && user.role === USER_TYPES.ADMIN) {
        return next();
    }
    next(new UnauthorizedException(null, "FATAL: Admin Access Violated!"));
}

module.exports = authenticateAdmin;