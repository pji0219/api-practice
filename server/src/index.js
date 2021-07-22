import express from 'express';
import cors from 'cors';
import messagesRoute from './routes/messages.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

messagesRoute.forEach(({ method, route, handler }) => {
  app[method](route, handler)
});

app.listen(8000, () => {
  console.log('server linstening on 8000...');
});