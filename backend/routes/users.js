const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
// register  
router.post("/register",async (req,res)=>{


    try {
      // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password,salt);

    //create new user
    const newUser = new User({
        username:res.body.username,
        email:res.body.email,
        password:hashedpassword,

    })

    //save user and send response
    const user = await newUser.save();
    res.status(200).json(user);   
    } catch (err) {
        res.status(500).json(err);   
    }



   



})


// login

router.post("/login",async (req,res)=>{
    try {
        // find user
        const user = await User.findOne({username:req.body.username})
        !user && res.status(400).json("Wrong username");

        //check password

        const Validpassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !Validpassword && res.status(400).json("Wrong password");
        res.status(200).json({_id:user._id,username:user.username});  
    } catch (err) {
        res.status(500).json(err);  
    }

})

module.exports = router;