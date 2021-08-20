const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
/*-------------------*/
// routers
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
/*---------*/









dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("Connected to MongoDB");
});





// routes

app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

app.listen(process.env.PORT || 8800, () =>{
    console.log("server is running!");
})