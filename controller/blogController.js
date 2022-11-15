const mongoose = require("mongoose")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlog = async function (req, res) {
    try {
        const data = req.body
        const validId = await authorModel.findOne({ _id: data.authorId })
        if (!validId) return res.status(400).send("Invalid Author")
        const create = await blogModel.create(data)
        res.status(201).send({ status: true, message: "Blog Created", data: create })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const getBlog = async function (req, res) {
    try {
        const {authorId,category,tags,subcategory} = req.query
        if (!authorId&&!category&&!tags&&!subcategory){
            const blogdata = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] }).populate("authorId")
            if (!blogdata) return res.status(404).send("No Such Blog Found")
            return res.send({message:"success",data:blogdata})
        }
        const getdata = await blogModel.find({$or:[{ authorId: authorId}, { category: category }, { tags: tags } ,{ subcategory: subcategory }]})
        for (let i = 0; i < getdata.length; i++) {
            if (getdata[i].isDeleted == false && getdata[i].isPublished == true) {
                return res.status(200).send({ status: true, message: "Filtered Blog", data: getdata })
            }
            else return res.status(200).send({ status: true, message: "bloglist", data: blogdata })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }

}

const putblogs= async function(req,res){
    try{
     let blogId= req.params.blogId
     let {title ,body , subcategory, tags} = req.body 
     if(!title && !body && !subcategory && !tags) 
     return res.status(400).send("the documents needs to be updated is not present")
     let blogdata= await blogModel.findByIdAndUpdate({_id: blogId}, {$set:title},{new : true})
     res.status(200).send({msg : "the updated documents", data:blogdata})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}





module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.putblogs=putblogs
