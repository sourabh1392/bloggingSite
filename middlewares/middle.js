const blogModel = require("../models/blogModel")

const blogIDexist = async function(req,res,next)
{ try{
let blogId= req.params.blogId
     let abc = await blogModel.find({_id: blogId})
        if(abc.isDeleted== true){
     return res.status(404).send({status : false , message: "blogId does not exist"})
        }
        req.blogId= blogId
        next()
    }
        catch(err){
            res.status(500).send(err.message)
        }
    
    }
 

  module.exports.blogIDexist=blogIDexist
    