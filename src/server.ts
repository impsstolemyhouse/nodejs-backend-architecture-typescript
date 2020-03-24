import express, { Request, Response, NextFunction, Errback } from 'express';
import Logger from './utils/Logger';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import { port, corsUrl } from './config';
import './database'; // initialize database
import { NotFoundError, ApiError, InternalError } from './utils/ApiError';

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

http.createServer(app).listen(port, () => { Logger.info(`server running on port : ${port}`); });

// Routes
app.use('/v1', require('./routes/v1'));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));

// Middleware Error Handler
app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ApiError) ApiError.handle(err, res);
	else ApiError.handle(new InternalError(), res);
});