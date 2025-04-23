import express from 'express';
import nunjucks from 'nunjucks';
import { User } from './models/user.js';

const app = express();

const port = 3000;

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set ('view engine', 'njk');

app.get('/', async (req, res) => {
  const usersRaw = await User.findAll();
  const users = usersRaw.map(user => {
    return {
      id: user.id,
      name: user.name,
      password: user.password
    }
  });
  res.render('test', {
      title: "Test nunjucks",
      desc: "Testing my nunjucks template engine",
      users
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
