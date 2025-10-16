import express from'express';
import { validateRequest } from 'zod-express-middleware';
import { loginschema, signupschema } from '../libs/validateschema.js';
import { login, register } from '../controllers/authcontroller.js';

const router=express.Router();

router.post('/register',validateRequest({body:signupschema}),register)
router.post('/login',validateRequest({body:loginschema}),login)

export default router;