const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: [true, "Please add the Username"],
    },
    email: {
        type: String,
        required: [true, "Please add the email address"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add the password"],
    },
    refreshToken: {
        type:String
    },
    currGame:{
        type:String
    },
    topScore:{
        type:Number
    }

},
{
    timestamps:true,
})

module.exports = mongoose.model("User", userSchema)