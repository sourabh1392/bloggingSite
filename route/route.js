const express=require("express")
const router=express.Router()
const author=require("../controller/authorcontroller")
const blog=require("../controller/blogController")

router.post("/authors",author.createAuthor)
router.post("/blogs",blog.createBlog)
router.get("/blogs",blog.getBlog)
router.get("/getPerticularBlog",blog.getPerticularBlog)

module.exports=router