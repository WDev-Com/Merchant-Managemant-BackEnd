const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  //First check request header has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "Token Not Found" });
  }
  //Extract the jwt token from the request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    //verify the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to the request object
    req.jwtPayload = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  //Genrate a new JWT Token using user data
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 3000 });
};

// Function to check the user's role from the JWT token
const checkUserRole = (role) => {
  return (req, res, next) => {
    // Ensure the JWT payload is attached (from jwtAuthMiddleware)
    if (!req.jwtPayload || !req.jwtPayload.role) {
      return res.status(403).json({ error: "Forbidden, role not available" });
    }

    // Check if the role matches the required role (e.g., 'user' or 'admin')
    if (req.jwtPayload.role !== role) {
      return res
        .status(403)
        .json({ error: `Access Denied: You must be a ${role}` });
    }

    // If the role matches, proceed to the next middleware or route handler
    next();
  };
};

module.exports = { jwtAuthMiddleware, generateToken, checkUserRole };
