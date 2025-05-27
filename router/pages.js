import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { User } from '../models/user.js';

const router = express.Router();

router.get('/register', async (req, res) => {
    if (req.session.userId) {
        return res.redirect('/profile');
    }
    res.render('register', {
        title: "Register",
        desc: "Create a new user"
    });
});

router.get('/login', async (req, res) => {
    if (req.session.userId) {
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

router.get('/table', async (req, res) => {
    const usersRaw = await User.findAll();
    const users = usersRaw.map(user => {
        return {
            id: user.id,
            name: user.name,
            password: user.password
        }
    });
    
    res.render('table', {
        title: "Tabla de Usuarios",
        desc: "Lista de usuarios registrados",
        users,
        session: req.session
    });
});

export default router;