import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default protect;