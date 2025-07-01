import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function varifyToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return { status: 401, data: { message: "Auth failed" } };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_Key as string);
    return { status: 200, data: decoded };
  } catch (err) {
    console.log(err);
    return { status: 401, data: { message: "Auth failed" } };
  }
}
