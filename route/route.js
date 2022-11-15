const express=require("express")
const router=express.Router()
const author=require("../controller/authorcontroller")
const blog=require("../controller/blogController")
const calmidd = require("../middlewares/middle")

router.post("/authors",author.createAuthor)
router.post("/blogs",blog.createBlog)
router.get("/getblogs",blog.getBlog)

router.put("/blogs/:blogId" ,calmidd.blogIDexist, blog.putblogs)
router.delete("/blogs/:blogId" ,calmidd.blogIDexist, blog.deleteblog)

router.delete("/blogs" ,blog.deleteQueryBlog)

module.exports=router