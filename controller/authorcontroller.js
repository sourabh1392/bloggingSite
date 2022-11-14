const { getMaxListeners } = require("process")
const authorModel=require("../models/authorModel")

const createAuthor= async function(req,res){
    try{
    const data=req.body
    const email=data.emailId
    const isemail=await authorModel.findOne({emailId:email})
    if(!isemail) return res.status(400).send("Enter valid emailId")
    const create=await authorModel.create(data)
    res.status(201).send({status:true,message:"Author Created",data:create})
    }
    catch(err){
    res.status(500).send(err.message)
    }
}

module.exports.createAuthor=createAuthor

