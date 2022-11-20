const authorModel = require("../models/authorModel")
const jwt = require('jsonwebtoken')
const blogModel = require("../models/blogModel")

const authenticate = function (req, res, next) {
    try {
        const header = req.headers["x-api-key"]
        if (header) {
            const verify = jwt.verify(header, "pass123")
            if (verify) {
                req.verify = verify
                next()
            }
            else {
                return res.status(401).send({ status: false, msg: "Invalid token" })
            }
        }
        else return res.status(401).send("Token Is Missing")
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports.authenticate = authenticate