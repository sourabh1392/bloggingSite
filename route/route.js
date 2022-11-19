const express=require("express")
const router=express.Router()
const author=require("../controller/authorcontroller")
const blog=require("../controller/blogController")
const calmidd = require("../middlewares/middle")

router.post("/authors", author.createAuthor)
router.post("/login", author.login)
router.post("/blogs",calmidd.authenticate, blog.createBlog)
router.get("/blogs",calmidd.authenticate, blog.getBlog)
router.put("/blogs/:blogId" ,calmidd.authenticate, blog.putblogs)
router.delete("/blogs/:blogId",calmidd.authenticate, blog.deleteblog)
router.delete("/blogs" ,calmidd.authenticate, blog.deleteQueryBlog)

module.exports=router