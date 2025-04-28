import express from 'express';
import nunjucks from 'nunjucks';
import { User } from './models/user.js';
import userRoutes from './router/users.js';
import pagesRoutes from './router/pages.js';
import { loggerBasic, loggerCustom } from './middleware/log.js';

const app = express();

app.use(loggerCustom);

const port = 3000;

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set ('view engine', 'njk');

app.use("/users", userRoutes);
app.use("/", pagesRoutes);

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

app.get('/login', async (req, res) => {
  res.render('login', {});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
