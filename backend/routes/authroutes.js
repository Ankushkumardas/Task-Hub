import express from'express';
import { validateRequest } from 'zod-express-middleware';
import { loginschema, signupschema } from '../libs/validateschema.js';
import { login, register, verifyEmail } from '../controllers/authcontroller.js';

const router=express.Router();


router.post('/register',validateRequest({body:signupschema}),register)
router.post('/login',validateRequest({body:loginschema}),login)
router.post('/verify-email', verifyEmail)

export default router;