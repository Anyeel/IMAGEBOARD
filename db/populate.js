import { User } from "../models/user.js";
import bcrypt from "bcrypt";

const populateUsers = async () => {
    const users = ["admin", "user1", "user2"];
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user+"pass", 10);
        await User.create({
            name: user,
            password: hashedPassword,
        });
    }
}

populateUsers();