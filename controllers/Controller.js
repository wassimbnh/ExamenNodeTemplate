const User = require("../models/userModel")
const {Router} = require("express")
const route = Router();

const server = require("http").createServer(route);
const io = require("socket.io")(server);

function sendNotification(msg) {
    io.emit("notification", msg);
    console.log(msg);
  }

const Controller = {

getAll : async (req,res) => {
 const users = await  User.find()

 sendNotification("Users fetched ");
 res.status(200).json(users)
},

getOne : async (req,res) => {
    const name = req.params.name;
    //check if the name exists 
    const user = await User.findOne({name})
    if(user){
        return res.status(200).json(user)
    }
    return res.status(401).json({msg: "User does not exists"})
},

addOne : async (req,res) => {

    
    if(!req.body){
        res.status(400).json({msg : "Please enter the name and email"})
    }
    
   
    
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email
    })
      res.status(200).json(newUser)
},

deleteOne: async (req, res) => {
    const name = req.params.name;
    const user = await User.findOne({ name });
  
    if (!user) {
      res.status(400).json({ msg: "User does not exist" });
      return;
    }
  
    await User.findOneAndRemove({ name });
    res.status(200).json({ msg: "User deleted" });
  }
,  

updateOne : async (req,res) =>{
const idUp = req.params.id;

const user = await User.findById(idUp)
if(!user){
    res.status(400).json({msg : " does not exists"})
    return;
}
await User.findByIdAndUpdate(idUp,req.body)
res.status(200).json({msg:"Updated"})
}


};

module.exports = Controller ;