const { default: mongoose } = require("mongoose")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlog= async function(req,res){
    try{
    const data=req.body
    const validId=await authorModel.findOne({_id:data.authorId})
    if(!validId) return res.status(400).send("Invalid Author")
    const create=await blogModel.create(data)
    res.status(201).send({status:true,msg:create})
    }
    catch(err){
    res.status(500).send(err.message)
    }
}

const getBlog=async function(req,res){
    try{
        const blogdata=await blogModel.find({isDeleted:false},{isPublished:true}).populate("authorId")
        if(!blogdata) return res.status(404).send("No Such Blog Found")
        res.status(200).send({status:true,msg:blogdata})


    }
    catch(err){
        res.status(500).send(err.message)
    }

}
const getPerticularBlog=async function(req,res){
    try{
        const data=req.query
        const getdata=await blogModel.find({$or:[{authorId:data.authorId},{category:data.category},{tags:data.tags},{subcategory:data.subcategory }]}).populate("authorId")
        res.status(200).send({status:true,msg:getdata})
    }
    catch(err){
        res.status(500).send(err.message)
    }

}


module.exports.createBlog=createBlog
module.exports.getBlog=getBlog
module.exports.getPerticularBlog=getPerticularBlog