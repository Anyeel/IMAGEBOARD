import express from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    const username = req.body.name;
    const password = req.body.password;

    await User.create({
        name: username,
        password: password,
    });
    res.json({"message": "User created"});
});


export default router;