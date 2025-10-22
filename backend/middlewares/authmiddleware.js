import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authmiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userid);
    if (!user) {
      res.status(401).json({ message: "No user found unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel server error" });
  }
};
