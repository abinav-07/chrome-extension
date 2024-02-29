const { HttpExceptions } = require("../exceptions/httpsExceptions");

const errorHandler = (error, req, res, next) => {

    if (error instanceof HttpExceptions) {
        return res.status(error.getStatusCode()).json({
            message: error.getMessage()
        })
    }

    //Log Console
    console.log(error);

    res.status(500).json({
        message: "Unhandle Error Found"
    })
}

module.exports = errorHandler;