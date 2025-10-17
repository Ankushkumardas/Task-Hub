import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../libs/mailer.js";
import Verfication from "../models/verification.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  try {
    // Find verification record
    const verification = await Verfication.findOne({ token });
    if (!verification) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    if (verification.expiredAt < new Date()) {
      return res.status(400).json({ message: "Token expired", success: false });
    }
    const user = await User.findById(verification.userid);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    if (user.isemailverified) {
      return res.status(400).json({ message: "Email already verified", success: false });
    }
    user.isemailverified = true;
    await user.save();
    // Remove verification record after use
    await Verfication.deleteOne({ _id: verification._id });
    res.status(200).json({ message: "Email verified successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", success: false });
  }
};


export const register = async (req, res) => {
  const {  email, password } = req.body;
  try {
    const existing = await User.find({ email });
    if (existing && existing.length > 0) {
      res
        .status(400)
        .json({
          message: "User with this email already exists",
          success: false,
        });
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    // Create user first
    const saveuser = await User.create({ email, password: hash, name: req.body.name });

    // Generate verification token
    const verificationToken = jwt.sign(
      {
        userid: saveuser._id,
        property: "email-verification",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Save token to Verification collection
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await Verfication.create({
      userid: saveuser._id,
      token: verificationToken,
      expiredAt: expires
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationToken, verificationLink);

    res
      .status(200)
      .json({
        message: "OK verification mail sent to given email",
        success: true,
        data: saveuser,
        verificationToken,
        verificationLink
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR", success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    res.status(200).json({ message: "OK", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR", success: false, error: error.message });
  }
};
