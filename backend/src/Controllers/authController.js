const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return res.status(401).json({ message: "Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        if(!user.isAdmin) {
            return res.status(403).json({ message: "Admin access denied"})
        }

        if(user.blocked) {
            return res.status(403).json({ message: "Account blocked"})
        }

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        )

        res.status(200).json({
            message: "Admin login success",
            token,
            admin: {
                id: user._id,
                name:user.name,
                email:user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error"})
    }

};

exports.registerUser = async ( req, res ) => {
   try{
     const { name, email, password } =req.body;
    const emailLower = email.toLowerCase();

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
    try {
    
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() })
    .select("+password");
 
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,        
      sameSite: "lax",     
      path:"/", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        message: "Login successful",       
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }
    });
    } catch (err) {
        res.status(500).json({ message: "Server error"})
    }
};