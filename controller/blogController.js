
const { isValidObjectId } = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require('jsonwebtoken')
const validation = require("../validator/validator")
let { isEmpty, isValidName } = validation

const createBlog = async function (req, res) {
    try {
        const data = req.body
        let { title, body, authorId, category } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "fields are Mandatory to Create Blogs" })
        if (!isEmpty(title)) return res.status(400).send({ status: false, message: "title Should Be Present" })
        if (!isEmpty(category)) return res.status(400).send({ status: false, message: "category Should Be Present" })
        if (!isEmpty(body)) return res.status(400).send({ status: false, message: "body Should Be Present" })
        if (!isEmpty(authorId)) return res.status(400).send({ status: false, message: "authorId Should Be Present" })

        if (!isValidName(title)) return res.status(400).send({ status: false, message: "title is wrong" })
        if (!isValidName(category)) return res.status(400).send({ status: false, message: "category is wrong" })
        const validId = await authorModel.findOne({ _id: data.authorId })
        if (!validId) return res.status(400).send("Author is Not Present")
        if (!isValidObjectId(data.authorId)) return res.status(400).send({ status: false, message: "Not A Valid AuthorId" })
        const create = await blogModel.create(data)
        res.status(201).send({ status: true, message: "Blog Created", data: create })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const getBlog = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory } = req.query
        if (!authorId && !category && !tags && !subcategory) {
            const blogdata = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }]}).populate("authorId")
            if (!blogdata) return res.status(404).send({ status: false, msg: "No Such Blog Found" })
            return res.status(200).send({ message: "success", data: blogdata })
        }
        const getdata = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }] })
        const getblogs = getdata.filter(a => a.isDeleted == false && a.isPublished == true)
        if (!getblogs) return res.status(404).send({ status: false, message: "No data found" })
        return res.status(200).send({ status: true, message: "Blogs", data: getblogs })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const putblogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, message: "Enter Valid BlogId" })
        let blog = await blogModel.findById(blogId)
        console.log(blog.authorId)
        if (!blog) return res.status(404).send({ status: false, message: "BlogId Not Found" })
        if (blog.authorId != req.verify.authorId) {
            return res.status(403).send({ status: false, message: "User Not Authorised" })
        }
        if (blog.isDeleted == true) {
            return res.status(404).send({ status: false, message: "blog does not exist" })
        }
        const data = req.body
        const { title, body, subcategory, tags } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Updated Data Not Available" })
    
        if (!isEmpty(title)) return res.status(400).send({ status: false, message: "title Should Be Present" })
        if (!isEmpty(subcategory)) return res.status(400).send({ status: false, message: "subcategory Should Be Present" })
        if (!isEmpty(body)) return res.status(400).send({ status: false, message: "body Should Be Present" })
        if (!isEmpty(tags)) return res.status(400).send({ status: false, message: "tags Should Be Present" })

        let blogdata = await blogModel.findOneAndUpdate({ _id: blogId, isPublished: false }, { $set: { title, body, isPublished: true, publishedAt: new Date().toJSON() }, $push: { subcategory, tags } }, { new: true })
        if (!blogdata) return res.status(404).send({ status: false, message: "Data not Updated" })
        res.status(200).send({ message: "Documents Updated", data: blogdata })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) return res.status(400).send("Enter valid blogId")
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, message: "BlogId Not Found" })
        if (blog.authorId != req.verify.authorId) {
            return res.status(403).send({ status: false, message: "User Not Authorised" })
        }
        if (blog.isDeleted == true) {
            return res.status(404).send({ status: false, message: "blogId does not exist" })
        }
        let deleteData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date().toJSON() } }, { new: true })
        res.status(200).send()
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteQueryBlog = async function (req, res) {
    try {
        const data = req.query
        console.log(req.verify.authorId)
        const { category, authorId, tags, subcategory } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Deleted Data Not Available" })
        if (!category && !authorId && !tags && !subcategory) {
            return res.status(404).send({ status: false, message: "no documents for deletion" })
        }
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: "Not A Valid AuthorId" })
        let data1 = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }], isPublished: false })
        let data2 = data1.filter(a => a.isDeleted == true)
        if (data2.length > 0) return res.status(400).send({ status: false, message: "Document Already Deleted" })
        let data3 = data2.filter(a => a.authorId != req.verify.authorId)
        if (data3.length == 0) return res.status(403).send({status:false,msg:"user not authorised "})
        let deletedata = await blogModel.updateMany({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }], isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deletedata) return res.status(404).send({ status: false, message: "Document Not Deleted" })
        res.status(200).send({ status: true, message: "Deleted Successful" })
    }

    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.putblogs = putblogs
module.exports.deleteblog = deleteblog
module.exports.deleteQueryBlog = deleteQueryBlog






