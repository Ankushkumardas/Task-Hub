import mongoose from "mongoose";
const userschema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      required: true,
      select: false,
    },
    profilepicture: {
      type: String,
    },
    isemailverified: {
      type: String,
      required: true,
      trim: true,
    },
    lastlogin: {
      type: Date,
    },
    is2FAenabled: {
      type: Boolean,
      default: false,
    },
    twoFotp: {
      type: Number,
      select: false,
    },
    twoFotpexpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userschema);
export default User;
