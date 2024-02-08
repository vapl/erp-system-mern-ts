import express from 'express';
import * as notesController from "../controllers/notes.controller";

const router = express.Router();

router.get('/:noteId', notesController.getNote)

router.get('/', notesController.getNotes);

router.post('/', notesController.createNote)

router.patch('/:noteId', notesController.updateNote)

export default router;