const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
exports.registerUser = async ( req, res ) => {
   try{
     const { name, email, password } =req.body;
    const emailLower = email.toLowerCase()
    const existingUser = await User.findOne({ email:emailLower  });
        if(existingUser){
            return res.status(400).json({ message:"User is already exists!"});
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short" });
        }

        const hashedPassword = await  bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });  

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// login 
exports.loginUser = async (req, res ) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ message: "Invalid Credentials!" })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({ message:"Invalid email or password!"})
    }

    const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d"}
    );

    res.json({
        token,
        user:{
            id:user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }
    });
};