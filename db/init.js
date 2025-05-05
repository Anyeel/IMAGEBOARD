import { sequelize } from "./sequelize.js";
import { User } from "../models/user.js";
import { Board } from "../models/board.js";
import { Post } from "../models/post.js";

const initDB = async () => {
    try {
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error("Error initializing the database:", error);
    }
};

initDB();