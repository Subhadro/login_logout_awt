const User = require("../models/userModel")
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");


exports.createUser = async (req, res) => {
    try {
        const { fullname, username, password, confirmpassword, gender } = req.body;

        // Check if username or fullname already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { fullname }]
        });
        if (existingUser) {
            return res.status(400).json({
                error: "Username or Fullname already exists"
            });
        }
        if (password != confirmpassword) {
            res.status(403).json({
                error: "password and confirmpassword are not the same"
            })
        }
        // Check if password matches any existing user's password
        const allUsers = await User.find();
        for (let user of allUsers) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.status(400).json({
                    error: "Password must be unique"
                });
            }
        }

        // Hash the password and create a new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = new User({ fullname, username, password: hash, gender });
        const savedUser = await user.save();
        const token = generateToken(user);

        // Set the JWT token in a cookie
        res.cookie('token', token, {
            httpOnly: true,  // Prevents client-side access to the cookie (more secure)
            secure: process.env.NODE_ENV === 'production',  // Ensures cookie is sent over HTTPS (in production)
            maxAge: 3600000,  // Cookie expiration time in milliseconds (1 hour)
        });

        res.status(200).json({
            message: 'Login successful',
            user: savedUser,
            token
        });
    } catch (err) {
        console.error("Error while creating user:", err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

exports.getallUser = async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            user: user,
        })
    }
    catch (err) {
        return res.status(400).json({
            error: "Error While Creating User"
        })
    }
}
exports.eraseAlluser = async (req, res) => {
    try {
        const user = await User.deleteMany();

        res.status(200).json({
            user: user,
        })
    }
    catch (err) {
        return res.status(400).json({
            error: "Error While deleting User"
        })
    }
}
exports.findUser = async (req, res) => {
    try {
        const { fullname, username, password } = req.body;
        // console.log(name, password, type);

        const user = await User.findOne({ fullname, username });

        if (!user) {
            // If no user was found, send a 404 response
            return res.status(404).json({
                error: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({
                error: "Password mismatch",
            });
        }
        // Generate JWT token
        const token = generateToken(user);

        // Set the JWT token in a cookie
        res.cookie('token', token, {
            httpOnly: true,  // Prevents client-side access to the cookie (more secure)
            secure: process.env.NODE_ENV === 'production',  // Ensures cookie is sent over HTTPS (in production)
            maxAge: 3600000,  // Cookie expiration time in milliseconds (1 hour)
        });
        // If a user was found, return the user object
        res.status(200).json({
            user: user,
            token
        });
    } catch (err) {
        console.error("Error while finding user:", err); // Log error details for debugging
        return res.status(400).json({
            error: "Error while finding user",
        });
    }
};

exports.getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID and return the document
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.eraseUser = (req, res) => {
    // Clear the JWT token cookie
    console.log(req.cookies.token);
    if (!req.cookies.token) {
        res.status(404).json({ message: "No JWT token available" })
    }
    res.clearCookie('token', {
        httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict', // SameSite attribute to prevent CSRF attacks
        maxAge: 0, // Set the expiration date to a past date to effectively remove the cookie
    });

    res.status(200).json({ message: 'Logged out successfully' });
}