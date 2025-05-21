import express from 'express';
import { Board } from '../models/board.js';
import { Post } from '../models/post.js';
import { upload } from '../middleware/uploads.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const boards = await Board.findAll();
    res.render('boards', { 
        title: 'Boards', 
        boards, 
        session: req.session 
    });
});

router.get('/:id', async (req, res) => {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
        return res.status(404).send('Board not found');
    }
    const posts = await Post.findAll({ where: { boardId: board.id } });
    res.render('board', { 
        title: board.name, 
        board, 
        posts, 
        session: req.session 
    });
});

router.post('/:id/posts', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const boardId = req.params.id;

    if (!req.session.userId) {
        return res.status(401).render('unauthorized', { 
            title: 'Unauthorized', 
            session: req.session 
        });
    }

    try {
        await Post.create({
            title,
            content,
            image: req.file ? req.file.filename : null,
            boardId,
            userId: req.session.userId,
        });

        res.redirect(`/boards/${boardId}`);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("An error occurred while creating the post.");
    }
});

export default router;