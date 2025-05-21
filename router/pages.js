import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/register', async (req, res) => {
    if (req.session.userId) {
        // Si el usuario ya está autenticado, redirigir al perfil
        return res.redirect('/profile');
    }
    res.render('register', {
        title: "Register",
        desc: "Create a new user"
    });
});

router.get('/login', async (req, res) => {
    if (req.session.userId) {
        // Si el usuario ya está autenticado, redirigir al perfil
        return res.redirect('/profile');
    }
    res.render('login', {
        title: "Login",
        desc: "Login to your account"
    });
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', {
        title: "Profile",
        desc: "Your profile page",
        user: req.session.username,
        session: req.session
    });
});

export default router;