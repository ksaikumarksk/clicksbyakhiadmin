import UserModel from "@/lib/models/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await clientPromise();
    const body = await req.json();
    const user = await UserModel.find({ email: body.email });
    console.log("user>>>", user);
    if (user.length < 0) {
      return NextResponse.json({ message: "Auth failed" }, { status: 401 });
    }
    const passwordMatch = await bcrypt.compare(body.password, user[0].password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Auth failed" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        email: user[0].email,
        userid: user[0]._id,
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: "1hr",
      }
    );
    return NextResponse.json(
      { message: "Atuh successful", token: token },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
