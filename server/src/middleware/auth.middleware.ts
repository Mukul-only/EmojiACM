import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { User } from "../models/user.model";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  try {
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
