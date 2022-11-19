const { findOne } = require("../models/authorModel")

const login=async function (req,res){
    const data=req.body
    const find=await findOne({emailId:data.emailId,password:data.password})
    const token=jwt.sign({_id:find._id.toString(),password:find.password},"")
}