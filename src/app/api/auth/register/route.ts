import dbConnect from "../../../lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password, role } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = new User({ name, email, password, role });
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Set cookie - CORRECTED VERSION
    const cookie = await cookies();
    cookie.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
