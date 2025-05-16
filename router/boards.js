import express from 'express';
import { Board } from '../models/board.js';
import { Post } from '../models/post.js';
import { upload } from '../middleware/uploads.js'; // Cambiado de 'upload.js' a 'uploads.js'

const router = express.Router();

// List all boards
router.get('/', async (req, res) => {
    const boards = await Board.findAll();
    res.render('boards', { title: 'Boards', boards });
});

// View a specific board
router.get('/:id', async (req, res) => {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
        return res.status(404).send('Board not found');
    }
    const posts = await Post.findAll({ where: { boardId: board.id } });
    res.render('board', { title: board.name, board, posts });
});

router.post('/:id/posts', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const boardId = req.params.id;

    if (!req.session.userId) {
        return res.status(401).render('unauthorized', { title: 'Unauthorized' });
    }

    try {
        await Post.create({
            title,
            content,
            image: req.file ? req.file.filename : null, // Guardar el nombre del archivo subido
            boardId,
            userId: req.session.userId,
        });

        res.redirect(`/boards/${boardId}`);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("An error occurred while creating the post.");
    }
});

// Create a new post in a specific board
router.post('/:id/posts', async (req, res) => {
    const { title, content } = req.body;
    const boardId = req.params.id;

    // Ensure the user is authenticated
    if (!req.session.userId) {
        return res.status(401).render('unauthorized', { title: 'Unauthorized' });
    }
    try {
        // Crea el post
        await Post.create({
            title,
            content,
            boardId,
            userId: req.session.userId, // Asociar el post con el usuario autenticado
        });

        res.redirect(`/boards/${boardId}`);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("An error occurred while creating the post.");
    }
});

export default router;