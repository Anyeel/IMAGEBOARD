import express from 'express';
import nunjucks from 'nunjucks';
import { User } from './models/user.js';
import userRouter from './router/users.js';
import pagesRouter from './router/pages.js';
import authRoutes from './router/auth.js';
import { loggerBasic, loggerCustom } from './middleware/log.js';
import session from 'express-session';
import SQLitestore from 'connect-sqlite3';
import boardsRouter from './router/boards.js';
import { isAuthenticated } from './middleware/auth.js';
import { sequelize } from './db/sequelize.js';

const app = express();

const port = 3000;
const SQLiteStoreSession = SQLitestore(session);

const sessionStore = new SQLiteStoreSession({
  db: 'sessions.sqlite',
  dir: './db',
  table: 'sessions',
});

const sessionConfig = {
  store: sessionStore,
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
};

app.use(session(sessionConfig));

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'njk');

app.use("/users", userRouter);
app.use("/boards", boardsRouter);
app.use("/", pagesRouter);
app.use("/", authRoutes);

app.get('/', async (req, res) => {
  const usersRaw = await User.findAll();
  const users = usersRaw.map(user => {
    return {
      id: user.id,
      name: user.name,
      password: user.password
    }
  });

  res.render('table', {
    title: "Test nunjucks",
    desc: "Testing my nunjucks template engine",
    users
  });
});

app.post('/:id/posts', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const boardId = req.params.id;

  await Post.create({
    title,
    content,
    boardId,
    userId: req.session.userId,
  });

  res.redirect(`/boards/${boardId}`);
});


const initializeApp = async () => {
  try {
    console.log("Initializing database...");
    await sequelize.sync({ force: true });
    console.log("Database initialized.");

    console.log("Setting up associations...");
    await import('./db/associations.js'); 
    console.log("Associations set up.");

    console.log("Populating database...");
    await import('./db/populate.js'); 
    console.log("Database populated.");

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

initializeApp();