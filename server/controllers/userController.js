const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

//@desc Register a User
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req,res)=> {

    console.log("starting register")
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!")

    }


    //Hashed Password
    const hashedPassword = await bcrypt.hash(password,10)
    console.log("Hashed Password:", hashedPassword)

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    console.log(`User Created: ${user}`)
    if (user){
        res.status(201).json({_id: user.id, email:user.email})
    }else{
        res.status(400)
        throw new Error("User data is not valid")
    }
})

//@desc Login a User
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("Need to provide email and password!");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign(
            {
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "30s"}
        );
        const refreshToken = jwt.sign(
            {
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"}
        );

        const refreshUser = await User.findByIdAndUpdate(user.id , 
            {
                refreshToken
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
        if(!refreshUser){
            res.status(500);
            throw new Error("Failed to Generate Token");
        }
        res.status(200);
        res.cookie('jwt', refreshToken, {httpOnly:true, maxAge: 24 * 60* 60 * 1000});
        res.json({accessToken});
    }else{
        res.status(401)
        throw new Error("Email or Password is not valid")
    }
})

//@desc Current User info
//@route POST /users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user)
})


const refresh = asyncHandler(async (req,res)=>{
    res.json({message:"new access token"})
})


module.exports = {registerUser, loginUser, currentUser};