const express = require('express');
const route = require('./route/route');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://garimasachan:w2kLOYcomIOBytoJ@blogprojectcluster4.i8kenbl.mongodb.net/blogproject", {
   useNewUrlParser: true 
})
.then( () => {console.log( "MongoDb is connected")}  )
.catch( err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
