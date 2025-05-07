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

const app = express();

import "./db/init.js";
import "./db/associations.js";
import "./db/populate.js";

app.use(loggerCustom);

const port = 3000;
const SQLiteStoreSession = SQLitestore(session);

const sessionStore = new SQLiteStoreSession({
  db: 'sessions.sqlite',
  dir: './db',
  table: 'sessions',
  dir: './db'
});

const sessionConfig = {
  store: sessionStore,
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}

app.use(session(sessionConfig));

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set ('view engine', 'njk');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
