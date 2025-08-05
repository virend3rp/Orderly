const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers['authorization'];

  // Check if the header exists and is in the correct format ('Bearer TOKEN')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token from the header string
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (e.g., { id, name }) to the request object
    req.employee = decodedPayload;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid (e.g., expired, malformed)
    console.error('Invalid token error:', error.message);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;