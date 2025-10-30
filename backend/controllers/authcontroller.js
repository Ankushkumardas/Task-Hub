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
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }
    if (verification.expiredAt < new Date()) {
      return res.status(400).json({ message: "Token expired", success: false });
    }
    const user = await User.findById(verification.userid);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (user.isemailverified) {
      return res
        .status(400)
        .json({ message: "Email already verified", success: false });
    }
    user.isemailverified = true;
    await user.save();
    // Remove verification record after use
    await Verfication.deleteOne({ _id: verification._id });
    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });
  }
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.find({ email });
    if (existing && existing.length > 0) {
      res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    // Create user first
    const saveuser = await User.create({
      email,
      password: hash,
      name: req.body.name,
    });

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
      expiredAt: expires,
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationToken, verificationLink);

    res.status(200).json({
      message: "OK verification mail sent to given email",
      success: true,
      data: saveuser,
      verificationToken,
      verificationLink,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR", success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User is not available with this email" });
    }
    //user has not verifef and token has expired for that condition
    if (!user.isemailverified) {
      const existingverification = await Verfication.findOne({
        userid: user._id,
      });
      // Existing token exists and is still valid → tell the user to verify email.
      if (existingverification && existingverification.expiredAt > new Date()) {
        return res
          .status(400)
          .json({ message: "Email not verified, please verify email first " });
      }
      // Token expired → delete the old verification entry.
      else {
        await Verfication.findByIdAndDelete({ _id: existingverification._id });
        const verificationToken = jwt.sign(
          {
            userid: user._id,
            property: "email-verification",
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        await Verfication.create({
          userid: user._id,
          token: verificationToken,
          expiredAt: new Date(Date.now() + 1 * 60 * 60 + 1000),
        });
        const verificationLink = `${process.env.FRONTEND}/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationToken, verificationLink);
        return res.status(200).json({
          message: "verfication mail is been sent to this email, please verify",
          email,
        });
      }
    }
    if (!user.password) {
      return res.status(401).json({ message: "No password set for this user" });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = jwt.sign(
      { userid: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    //keep track of user last login
    user.lastlogin = new Date();
    user.save();

    const userdata = user.toObject();
    delete userdata.password;
    res
      .status(200)
      .json({ message: "OK", success: true, token, user: userdata });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR", success: false, error: error.message });
  }
};

export const resetpasswordrequest = async (req, res) => {
  try {
    // 1️⃣ Get email from request body
    const { email } = req.body;

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User with this email does not exist" });
    }

    // 3️⃣ Check if user's email is verified
    if (!user.isemailverified) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    /**
     4️⃣ Check for existing verification token in DB
        - The `Verfication` collection stores tokens for:
          - Password reset
          - Email verification
          - 2FA, etc.
        - This ensures multiple requests are controlled.
    */
    const existingverification = await Verfication.findOne({
      userid: user._id,
    });

    // 4a. If a valid token exists (not expired), prevent duplicate requests
    if (existingverification && existingverification.expiredAt && existingverification.expiredAt > new Date()) {
      return res
        .status(401)
        .json({ message: "Reset password request already sent" });
    }

    // 4b. If an old token exists but expired, delete it
    if (existingverification && existingverification.expiredAt && existingverification.expiredAt < new Date()) {
      await Verfication.findByIdAndDelete(existingverification._id);
    }

    /**
     5️⃣ Generate a new JWT token for password reset
        - Includes user ID and purpose
        - Expires in 15 minutes for security
    */
    const resetpasswordverification = jwt.sign(
      {
        userid: user._id,
        purpose: "reset-password",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 6️⃣ Store the reset token in the DB with expiration
    await Verfication.create({
      userid: user._id,
      token: resetpasswordverification,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // 7️⃣ Construct reset password link
    const resetpasslink = `${process.env.FRONTEND}/reset-password?token=${resetpasswordverification}`;

    // 8️⃣ Send verification email
    const isemail = await sendVerificationEmail(
      email,
      resetpasswordverification,
      resetpasslink
    );

    // 8a. If email fails to send, return error
    if (!isemail) {
      return res
        .status(500)
        .json({ message: "Error in sending the reset password link" });
    }

    // ✅ 9️⃣ Success response
    res.status(200).json({
      message: "Email to reset password is sent",
      email,
      resetpasswordverification,
      resetpasslink,
    });
  } catch (error) {
    // 🔴 Catch-all error
    res.status(500).json({
      message: "Internal server error while requesting password reset",
      error: error.message,
    });
  }
};

export const verifyresetpasswordwithtoken = async (req, res) => {
  try {
    const { token, newpassword, confirmpassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      res.status(401).json({ message: "Unauthorized" });
    }
  const { userid, purpose } = payload;

    if (purpose !== "reset-password") {
      res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verfication.findOne({ userid, token });
    if (!verification) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const istokenexpired = verification.expiredAt < new Date();
    if (istokenexpired) {
      return res.status(401).json({ message: "Token expired" });
    }
    const user = await User.findById(userid);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }
    if (newpassword !== confirmpassword) {
      return res.status(401).json({ message: "Passwords do not match" });
    }
  const hashpass = await bcrypt.hash(newpassword, 12);
  user.password = hashpass;
  await user.save();
    await Verfication.findByIdAndDelete(verification._id);
    return res
      .status(200)
      .json({ message: "Password reset done successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internel server error while verifying resetpassword ",
      error,
    });
  }
};
