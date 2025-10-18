
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const admin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};
