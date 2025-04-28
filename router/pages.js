import express from 'express';

const router = express.Router();

router.get('/register', async (req, res) => {
    res.render('register', {
        title: "Register",
        desc: "Create a new user"
    });
});

export default router;