
const { isValidObjectId } = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const validation = require("../validator/validator")
let { isEmpty, isValidName } = validation

const createBlog = async function (req, res) {
    try {
        const data = req.body
        let { title, body, authorId, category } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter Data to Create Blogs" })
        if (!isEmpty(title))
            return res.status(400).send({ status: false, message: "title Should Be Present" })
        if (!isEmpty(category))
            return res.status(400).send({ status: false, message: "category Should Be Present" })
        if (!isEmpty(body))
            return res.status(400).send({ status: false, message: "body Should Be Present" })
        if (!isEmpty(authorId))
            return res.status(400).send({ status: false, message: "authorId Should Be Present" })

        if (!isValidName(title))
            return res.status(400).send({ status: false, message: "Enter valid title" })
        if (!isValidName(category))
            return res.status(400).send({ status: false, message: "Enter valid category " }) 

        const validId = await authorModel.findOne({ _id: data.authorId })
        if (!validId)
            return res.status(400).send("You are not authorised")
        if (!isValidObjectId(data.authorId))
            return res.status(400).send({ status: false, message: "Enter Valid AuthorId" })
        const create = await blogModel.create(data)
        res.status(201).send({ status: true, message: "Blog Created Successfully", data: create })
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

const getBlog = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory } = req.query
        if (!authorId && !category && !tags && !subcategory) {
            const blogdata = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true}]}).populate("authorId")
            if (!blogdata)
                return res.status(404).send({ status: false, msg: "No Such Blog Found" })
            return res.status(200).send({ message: "success", data: blogdata })
        }
        const getdata = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }] })
        const getblogs = getdata.filter(a => a.isDeleted == false && a.isPublished == true)
        if (!getblogs)
            return res.status(404).send({ status: false, message: "Invalid Query" })
        return res.status(200).send({ status: true, message: "Blogs", data: getblogs })
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

const putblogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, message: "Enter Valid BlogId" })
        let blog = await blogModel.findById(blogId)
        if (!blog)
            return res.status(404).send({ status: false, message: "blog does not exist" })
        if (blog.authorId != req.verify.authorId) {
            return res.status(403).send({ status: false, message: "User Not Authorised" })
        }
        if (blog.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Blog does not exist" })
        }
        const data = req.body
        const { title, body, subcategory, tags } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data to be updated" })
        let blogdata = await blogModel.findOneAndUpdate({ _id: blogId, isPublished: false }, { $set: { title, body, isPublished: true, publishedAt: new Date().toJSON() }, $push: { subcategory, tags } }, { new: true })
        if (!blogdata)
            return res.status(404).send({ status: false, message: "Data not Updated" })
        else
            return res.status(200).send({ message: "Documents Updated", data: blogdata })
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId))
            return res.status(400).send("Enter valid blogId")
        let blog = await blogModel.findById(blogId)
        if (!blog)
            return res.status(404).send({ status: false, message: "Blog does not exist" })
        if (blog.authorId != req.verify.authorId) {
            return res.status(403).send({ status: false, message: "User Not Authorised" })
        }
        if (blog.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Blog already deleted" })
        }
        let deleteData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date().toJSON() } }, { new: true })
        return res.status(200).send()
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

const deleteQueryBlog = async function (req, res) {
    try {
        const reqQuery = req.query;
        const { authorId, category, tags, subcategory, isPublished } = reqQuery;
        if (authorId || category || tags || subcategory || isPublished) {
            const findBlog = await blogModel.find({ $and: [{ authorId: req.verify.authorId }, reqQuery] });
            if (findBlog.length === 0) return res.status(404).send({ status: false, message: 'blog not found.' });
            const findAuthor = findBlog[0].authorId;
            if (findAuthor) {
                const allBlog = await blogModel.updateMany(
                    { $and: [reqQuery, { authorId: req.verify.authorId }, { isDeleted: false }] },
                    { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }
                );
                if (allBlog.modifiedCount === 0) return res.status(400).send({ status: false, message: 'No blog to be deleted' });
                else return res.status(200).send({ status: true, data: `${allBlog.modifiedCount} blog deleted` });
            } else return res.status(400).send({ status: false, message: 'Found author is not valid.' });
        } else return res.status(400).send({ status: false, message: 'Invalid query.' });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.putblogs = putblogs
module.exports.deleteblog = deleteblog
module.exports.deleteQueryBlog = deleteQueryBlog






