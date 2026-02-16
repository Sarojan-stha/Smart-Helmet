const User = require('../model/user');
const bcrypt = require('bcrypt')

const createUser = async (req, res) => {
    const {username,email,password,role} = req.body;
    
    
    try {

        //check for existing User
        const existingUser = await User.findOne({email});
        console.log(existingUser);
        
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }
        
        //generate hashed password
        const hashedPassword =  await bcrypt.hash(password, 10)

        //create user 
        const user = await User.create({ 
           username,email,password:hashedPassword,role
         });
   
        console.log('User created successfully');
        res.status(201).json(user);

    } catch (err) {
        console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const getAllUsers = async (req,res)=>{
    try {
        const users = await User.find();
        res.status(201).json(users)
    } catch (error) {
        res.send(error)
    }
}

const updateUser = async (req,res)=>{   
    const {username,email} = req.body;
    try {
        const user = await User.findOneAndUpdate({email},{username})
        res.json(user)
    } catch (error) {
        res.send(error);
    }
}

const deleteUser = async (req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOneAndDelete({email})
        res.json({
            "User":user,
            "message":"User Deleted"
        })
        
    } catch (error) {
        res.send(error)
        
    }
}

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser


} 