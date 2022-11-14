const { getMaxListeners } = require("process")
const authorModel=require("../models/authorModel")

const createAuthor= async function(req,res){
    try{
    const data=req.body
    const email=data.emailId
    const pattern=/@gmail.com$/
    const validmail=email.match(pattern)
    if(!validmail) return res.send("Enter Valid EmailId")
    const create=await authorModel.create(data)
    res.status(201).send({status:true,message:"Author Created",data:create})
    }
    catch(err){
    res.status(500).send(err.message)
    }
}

module.exports.createAuthor=createAuthor

