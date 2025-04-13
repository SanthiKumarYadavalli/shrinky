import express from 'express';
import useragent from 'express-useragent';
import cors from 'cors';
import http from 'http';
import connectDB from '../config/db.js';
import { PORT } from '../config/server.js';
import urlRouter from '../routes/url.routes.js';
import userRouter from '../routes/user.routes.js';
import redirectionRouter from '../routes/redirection.routes.js';
import clickRouter from '../routes/click.routes.js';
import { initWebSocket } from '../utils/websocket.js';

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(useragent.express());
app.use(cors());

app.use("/url", urlRouter);
app.use("/user", userRouter);
app.use("/", redirectionRouter);
app.use("/clickdata", clickRouter);

const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
