const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const ACCESS_TOKEN_EXPIRES_MILISECONDS = 60 * 60  * 1000
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

    const hashedPassword = await bcrypt.hash(password,10)
    console.log("Hashed Password:", hashedPassword)

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        topScore: 0,
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
            {expiresIn: "1hr"}
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
        res.cookie('jwt', refreshToken, {httpOnly:true,sameSite:'None',secure:true, maxAge: 24 * 60* 60 * 1000});
        res.json({accessToken, expiresIn: Date.now() + ACCESS_TOKEN_EXPIRES_MILISECONDS});
    }else{
        res.status(401)
        throw new Error("Email or Password is not valid")
    }
})

//@desc Current User info
//@route POST /users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{

    const user = await User.findById(req.user.id)
    
    res.json({username: user.username, email: user.email, topScore: user.topScore})
})


const handleLogout = asyncHandler(async (req,res)=>{
    const cookies = req.cookies

    if(!cookies?.jwt){
        res.sendStatus(204); //change to 204 no change
        return
    }

    const refreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken });

    console.log(user)

    if(!user){
        res.clearCookie('jwt', {httpOnly: true,sameSite:'None',secure:true})
        res.sendStatus(204)
        return
    }

    
    const refreshRes = await User.findByIdAndUpdate(
        user.id,
        {
            refreshToken: ""
        },
        {
        returnDocument: 'after',
        runValidators: true
        },
    )

    console.log(refreshRes)
    
    res.clearCookie('jwt', {httpOnly: true,sameSite:'None',secure:true})
    res.sendStatus(204)
    
})

const handleRefreshToken = asyncHandler(async (req,res)=>{
    const cookies = req.cookies

    if(!cookies?.jwt){
        res.status(401);
    }

    const refreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken });
    if (user ){
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err,decoded)=>{

                if(err || user.id !== decoded.user.id) return res.sendStatus(403)
                const accessToken = jwt.sign({
                        user:{
                            username: user.username,
                            email: user.email,
                            id: user.id,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '1hr'}
                )

                res.json({accessToken, expiresIn: Date.now() + ACCESS_TOKEN_EXPIRES_MILISECONDS})

            }
        )
        
    }else{
        res.status(403)
        throw new Error("Forbidden")
    }
})


module.exports = {registerUser, loginUser, currentUser, handleLogout, handleRefreshToken};