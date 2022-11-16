
const { isValidObjectId } = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require('jsonwebtoken')

const createBlog = async function (req, res) {
    try {
        const data = req.body
        let { title, body, authorId, category } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "fields are Mandatory to Create Blogs" })
        if (!body || !category || !authorId || !title) return res.status(400).send({ status: false, msg: "Some fields are missing" })
        if (!isEmpty(title)) return res.status(400).send({ status: false, message: "title Should Be Present" })
        if (!isEmpty(category)) return res.status(400).send({ status: false, message: "category Should Be Present" })
        if (!isEmpty(body)) return res.status(400).send({ status: false, message: "body Should Be Present" })
        if (!isEmpty(authorId)) return res.status(400).send({ status: false, message: "authorId Should Be Present" })

        if (!isValidName(title)) return res.status(400).send({ status: false, message: "title is wrong" })
        if (!isValidName(category)) return res.status(400).send({ status: false, message: "category is wrong" })
        const validId = await authorModel.findOne({ _id: data.authorId })
        if (!validId) return res.status(400).send("Author Not Present")
        if (!isValidObjectId(data.authorId)) return res.status(400).send({ status: false, message: "Not A Valid AuthorId" })
        const create = await blogModel.create(data)
        res.status(201).send({ status: true, message: "Blog Created", data: create })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const login = async function (req, res) {
    try {
        const emailId = req.body.emailId
        const password = req.body.password
        const check = await authorModel.findOne({ emailId: emailId }, { password: password })
        if (!check) return res.status(400).send({ status: false, message: "EmailId or Password Not found" })
        const create = jwt.sign({ emailId: emailId, password: password }, "pass123")
        res.setHeaders('x-api-key', create)
        res.status(201).send({ status: true, message: "Token Created", data: create })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const getBlog = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory } = req.query
        if (!authorId && !category && !tags && !subcategory) {
            const blogdata = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] }).populate("authorId")
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
        if (!isValidObjectId(blogId)) return res.status(400).send("Enter valid blogId")
        let abc = await blogModel.find({ _id: blogId })
        if (!abc) return res.status(404).send({ status: false, message: "BlogId Not Found" })
        if (abc.isDeleted == true) {
            return res.status(404).send({ status: false, message: "blog does not exist" })
        }
        const data = req.body
        const { title, body, subcategory, tags } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Updated Data Not Available" })
        if (!title && !body && !subcategory && !tags)
            return res.status(400).send("the documents needs to be updated is not present")
        let blogdata = await blogModel.findOneAndUpdate({ _id: blogId, isPublished: false }, { $set: { title, body, isPublished: true, publishedAt: new Date().toJSON() }, $push: { subcategory, tags } }, { new: true })
        if (!blogdata) return res.status(404).send({ status: false, msg: "Data not Updated" })
        res.status(200).send({ msg: "the updated documents", data: blogdata })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) return res.status(400).send("Enter valid blogId")
        let abc = await blogModel.find({ _id: blogId })
        if (!abc) return res.status(404).send({ status: false, message: "BlogId Not Found" })
        if (abc.isDeleted == true) {
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
        const { category, authorId, tags, subcategory, isPublished } = req.query
        if (!category && !authorId && !tags && !subcategory && !isPublished) {
            return res.status(404).send({ status: false, message: "no documents for deletion" })
        }
        let data = await blogModel.find({ $or: [{ _id: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }], isDeleted: true })
        if (data) return res.status(400).send({ status: false, message: "Document Already Deleted" })
        let deletedata = await blogModel.updateMany({ $or: [{ _id: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }], isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deletedata) return res.status(404).send({ status: false, msg: "Document Not Deleted" })
        res.status(200).send({ status:true,msg: "Deleted Successful" })
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
module.exports.login = login

