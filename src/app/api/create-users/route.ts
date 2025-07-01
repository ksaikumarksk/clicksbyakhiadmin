import UserModel from "@/lib/models/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";


// const user = UserModel

export async function POST(req: NextRequest) {
    await clientPromise()
    try {
        const body = await req.json();
        const users = await UserModel.find();
        console.log("users", users);
        const existingUser = await UserModel.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            email: body.email,
            password: hashedPassword,
        });

        const result = await user.save();
        console.log(result);
        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// export async function GET(req: NextRequest) {
//     try {
//         const users = await UserModel.find();
//         return NextResponse.json(users, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// export async function DELETE(req: NextRequest) {
//     try {
//         const { email } = await req.json();
//         const result = await UserModel.deleteOne({ email });
//         if (result.deletedCount === 0) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }
//         return NextResponse.json({ message: "User deleted" }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// export async function PUT(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { email, updates } = body;

//         const updatedUser = await UserModel.findOneAndUpdate(
//             { email },
//             { $set: updates },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

//         return NextResponse.json(updatedUser, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }