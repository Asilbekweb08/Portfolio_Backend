
const {Schema, model} = require('mongoose')

const UserSchema = Schema({
    fullName:{type:String, required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
     isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },

})

module.exports= model("UserSchema",UserSchema)
