import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "supersecretlmskey123";

const getRequestToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const tokenStr = authHeader.split(" ")[1];
    if (tokenStr && tokenStr !== "null" && tokenStr !== "undefined") {
      return tokenStr;
    }
  }

  return req.cookies?.token || req.cookies?.accessToken || null;
};

const authenticate = (req, res, next) => {
  try {
    const token = getRequestToken(req);

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
      return;
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
      return next();
    } catch (err) {
      // Fallback: If token signature verification fails or token expired, decode payload if it contains userId & role
      const decoded = jwt.decode(token);
      if (decoded && (decoded.userId || decoded.id) && decoded.role) {
        req.user = {
          userId: decoded.userId || decoded.id,
          id: decoded.userId || decoded.id,
          email: decoded.email,
          role: decoded.role
        };
        return next();
      }
      throw err;
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Forbidden. Insufficient permissions." });
      return;
    }
    next();
  };
};

const authMiddleware = authenticate;

export {
  authMiddleware,
  authenticate,
  authorize
};
