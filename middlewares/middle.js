const authorModel = require("../models/authorModel")
const jwt=require('jsonwebtoken')

const authenticate=function(req,res,next){
    try{
        const header=req.headers["x-api-key"]
        if(!header) return res.status(404).send({status:false,message:"Required Token Not Found"})
        const verify=jwt.verify(header,"pass123")
        if(verify){
            req.verify=verify
            next()
        }
        else return res.status(401).send("Not Authenticated")
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const authorise=async function(req,res,next){
    try{
        let authorId=req.params.authorId
        let user=await authorModel.findById(authorId)
        if(!user) return res.status(400).send("User Not Found")
        if(authorId==req.verify.authorId){
            req.authorId=authorId
            next()
        }
        else return res.status(403).send({status:true,message:"Not authorised User"})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}
module.exports.authenticate=authenticate
module.exports.authorise=authorise