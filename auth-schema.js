import { match } from 'assert';
import mangooge from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.OjbecjId,
    email:{type:String, required:true, unique:true, match:/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/},
    password:{type:String,required:true},

})

export const User = mongoose.model("User",userSchema)