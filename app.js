import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';

// Import Routers
import AuthRouter from './routers/auth.js';
import GeneralRouter from './routers/general.js';
import ApplicationRouter from './routers/application.js';
import ImmigrationRouter from './routers/immigration.js'

import globalErrorHandler from './middlewares/error_handler.js';
import Response from './helpers/response.js';

dotenv.config();
const app = express();

const basePath = '/v1';

app.enable('trust proxy');
app.use(cors());
app.use(helmet());
app.use(
	'/api',
	rateLimit({
		max: 100,
		windowMs: 60 * 60 * 1000,
		message:
			'Too many requests from this IP address. Please try again in an hour.',
	}),
);
app.use(xss());

app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
process.env.APP_MODE === 'DEVELOPMENT' && app.use(morgan('dev'));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET PUT POST PATCH DELETE');
		return Response.OK(res);
	}
	req.app = app;
	next();
});

// ADD ROUTERS
app.use(`${basePath}/auth`, AuthRouter);
app.use(`${basePath}/general`, GeneralRouter);
app.use(`${basePath}/application`, ApplicationRouter);
app.use(`${basePath}/immigration`, ImmigrationRouter);

app.get(`${basePath}/`, (req, res, next) => {
	return Response.OK(res, 'Welcome to Essential Recruit!');
});

app.all('*', (req, res, next) => {
	return Response.routeNotImplemented(res);
});

app.use(globalErrorHandler);

export default app;
