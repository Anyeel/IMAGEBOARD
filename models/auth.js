import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const authenticateUser = async (name, password) => {
    const user = await User.findOne({
        where: {
            name: name
        }
    });
    if (!user) {
        return null;
    }
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    return user;
}