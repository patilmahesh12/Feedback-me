import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);
