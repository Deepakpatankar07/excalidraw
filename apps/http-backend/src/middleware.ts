import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "@repo/backend-common";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      message: "Authorization token is missing",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_PASSWORD);
    if (typeof payload === "object" && payload !== null && "id" in payload) {
      req.id = payload.id;
      next();
    } else {
      throw new Error(
        "Token payload does not contain the required 'id' field."
      );
    }
  } catch (error) {
    console.error("Auth Error:", error);

    res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
}
