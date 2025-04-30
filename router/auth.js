import express from 'express';
import { authenticateUser } from '../models/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await authenticateUser(name, password);
        if (!user) {
            return res.status(401).redirect('/login');
        }
        req.session.userId = user.id;
        req.session.username = user.name;
        res.redirect("/profile");
    }
    catch (error) {
        console.error(error);
        res.json({ error: "An error occurred during login." });
    }
});

export default router;

