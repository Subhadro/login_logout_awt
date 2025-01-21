const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, fullname: user.fullname },
        process.env.JWT_SECRET,  // Make sure to set this in your .env file
        { expiresIn: '1h' }  // Token expiration
    );
};

module.exports = { generateToken };
