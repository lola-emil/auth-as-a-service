import express, { ErrorRequestHandler } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config/constants";
import Logger from "./utils/logger";

import apiRoute from "./api";
import NotFoundError from "./exceptions/NotFoundError";
import errorHandler from "./middlewares/errorhandler";


const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(apiRoute);

// 404 Error
app.use((req, res) => {
    throw new NotFoundError(`Can't ${req.method} ${req.originalUrl}`);
});


app.use(errorHandler as ErrorRequestHandler);

server.listen(PORT, () => Logger.success(`Server running on port ${PORT}`));