const jwt = require('jsonwebtoken');

// Authentication middleware to verify the token from cookies
const protectRoute = (req, res, next) => {
    // Check if the token is present in the cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            error: 'No token provided. Authorization denied.',
        });
    }

    try {
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user data to the request object
        req.user = decoded;
        console.log(token);
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid or expired token. Authorization denied.',
        });
    }
};

module.exports = { protectRoute };
