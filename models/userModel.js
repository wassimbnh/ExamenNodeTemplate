const {Schema,model} = require("mongoose")

const userSchema = new Schema ({

    name : {
        type : String,
        trim : true
    },
    email : {
        type :String,
        trim : true ,  
    },
    age : {
        type : Number,
    }






}, {timestamp : true}
) 
const User = model("User", userSchema)
module.exports = User;