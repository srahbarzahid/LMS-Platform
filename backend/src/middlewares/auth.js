import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "supersecretlmskey123";

const getRequestToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.token || null;
};

const authenticate = (req, res, next) => {
  try {
    const token = getRequestToken(req);

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
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
