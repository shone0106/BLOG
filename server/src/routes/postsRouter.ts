import express from 'express'
import * as postsController from "../controllers/postsController"
import { requiresAuth } from '../middleware/auth'

const router = express.Router()

router.get('/', postsController.getNotes)

router.get('/:postId', postsController.getNote)

router.post('/', postsController.createNote)

router.patch('/:postId', postsController.updateNote)

router.delete('/:postId', postsController.deleteNote)

export default router
