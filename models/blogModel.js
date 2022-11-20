const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        required: true,
        type: ObjectId,
        ref: "Author"
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subcategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt:String,
    deletedAt:String
}, { timestamps: true })

module.exports = mongoose.model('Blogs', blogSchema)
