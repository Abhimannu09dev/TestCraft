const User = require("../model/UserModel.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// Function to create a new User
async function createUser(req, res, next) {
    try{
        const {firstName, lastName, userName, email, password, role} = req.body;
        if(!firstName || !lastName || !userName || !email || !password){
            return res.status(400).json({message: "Enter the all the data"});
        }
        // Check if email is correct or not 
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Enter the correct email"});
        }
        if(password.length < 8){
            return res.status(400).json({message: "The password must be at list 8 characters"});
        }

        // Chek if the name is already taken
        const takenUserName = await User.findOne({userName})
        if(takenUserName){
            return res.status(409).json({message: "UserName is already taken"});
        }
        // Check if the email exists
        const existingUser = await User.findOne({email: email.toLowerCase()});
        if(existingUser){
            return res.status(409).json({message: "User exists"});
        }

        // Hash the password
        const hashPassword =await bcrypt.hash(password,12);

        // Save the user information to databse if the user is not present
        const newUser = new User({
                                firstName,
                                lastName,
                                userName, 
                                email: email.toLowerCase(), 
                                password: hashPassword, 
                                role});
        await newUser.save();
        
        // return message after the user is saved successfully
        return res.status(201).json({
                status: "success",
                message: "User created successfully",
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                },
            });
    }catch (error){
        return res.status(400).json({message: "User Registration Failed"});
    }
}

async function loginUser(req, res, next) {
    try{
        const {email,password} = req.body;
        if(!email || !validator.isEmail(email)){
            return res.status(400).json({message: "Please enter valid email"});
        }
        if(!password){
            return res.status(400).json({message: "Please enter the password field"});
        }
        const user =await User.findOne({email : email.toLowerCase()});
        if(!user){
            return res.status(400).json({message: "Please enter the correct email"});
        }
        
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if(!isCorrectPassword){
            return res.status(400).json({message: "Password doesn't match"});
        }

        const token = jwt.sign(
            {id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET || {expiresIn: "1h"}
        );

        return res.status(200).json({
            status: "Success",
            message:"User LoggedIn Successfull",
            token: token,
        })
    }catch (error){
        return res.status(400).json({message: "Error logging in User"});
    }
}

async function deleteUser(req, res, next) {
    try {
        const { userName } = req.params; // Extract userName from URL params
        console.log(userName);

        // Validate input
        if (!userName || typeof userName !== 'string') {
            return res.status(400).json({
                status: "error",
                message: "Valid username is required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        await User.deleteOne({ userName });

        // Return success response
        return res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
}
module.exports = {createUser, loginUser, deleteUser};