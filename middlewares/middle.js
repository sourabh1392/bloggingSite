const authorModel = require("../models/authorModel")
const jwt=require('jsonwebtoken')
const blogModel = require("../models/blogModel")

const authenticate=function(req,res,next){
    try{
        const header=req.headers["x-api-key"]
        if(!header) return res.status(404).send({status:false,message:"Required Token Not Found"})
        const verify=jwt.verify(header,"pass123")
        if(verify){
            req.verify=verify
            next()
        }
        else return res.status(401).send("Not Authenticated")
    }
    catch(err){
        res.status(500).send(err.message)
    }
}


// const authorisation = async function (req, res, next) {
//     try {
//       let authorId2 = req.query.authorId;
//       let authorLogin_ = req.decoded.authorId;
//       let blogId = req.params.blogId
//       if(blogId){
//         let blogs = await blogModel.findById(blogId);
//         let authorId2 = blogs.authorId;
//         //console.log(authorId1);
//         if (authorId2 != req.authorlog) {
//           return res.status(403).send({ status: false, msg: "you do n0t have access" });
//         }
//         next();
//       }else{
//         if (authorId2 != authorLogin_) {
//           return res
//             .status(403)
//             .send({ status: false, msg: "you do not have access" });
//         }
//         next();
//       }
//     } catch (error) {
//       return res.status(500).send({ status: false, msg: error.message });
//     }
//   };


module.exports.authenticate=authenticate
