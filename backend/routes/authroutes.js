import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  emailschema,
  loginschema,
  resetpasswordschrma,
  signupschema,
} from "../libs/validateschema.js";
import {
  login,
  register,
  resetpasswordrequest,
  verifyEmail,
  verifyresetpasswordwithtoken,
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", validateRequest({ body: signupschema }), register);
router.post("/login", validateRequest({ body: loginschema }), login);
router.post("/verify-email", verifyEmail);
//for forgot password route
router.post(
  "/reset-password-request",validateRequest({body:emailschema}),
  resetpasswordrequest
);
router.post(
  "/reset-password",
  validateRequest({ body: resetpasswordschrma }),
  verifyresetpasswordwithtoken
);

export default router;
