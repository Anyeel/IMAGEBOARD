import express from 'express';

const router = express.Router();

router.get('/register', async (req, res) => {
    res.render('register', {
        title: "Register",
        desc: "Create a new user"
    });
});

router.get('/login', async (req, res) => {
    res.render('login', {
        title: "Login",
        desc: "Login to your account"
    });
});

router.get('/profile', async (req, res) => {
    res.render('profile', {
        title: "Profile",
        desc: "Your profile page",
        user: req.session.username
    });
});

export default router;