import express from "express";
import * as userController from '../controllers/userController'
import { requiresAuth } from "../middleware/auth";

const router = express.Router()

router.get('/', requiresAuth, userController.getAuthenticatedUser)

router.post('/signUp', userController.signUp)

router.post('/login', userController.login)

router.post('/logout', userController.logout)


export default router