import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import app from './app.js';
import loadMigrationData from './config/data/migrations.js';

const PORT = process.env.APP_MODE === 'DEVELOPMENT' ? process.env.PORT : process.env.PORT;
const HOST = process.env.APP_MODE === 'DEVELOPMENT' ? 'localhost' : 'localhost';

const server = http.createServer(app);

mongoose
	.connect(process.env.MONGODB_URI, {})
	.then(async () => {
		console.info("Connected to 'essential recruit' database successfully");

		await loadMigrationData();
		server.listen(PORT, HOST, function () {
			console.info(`Server listening for incoming requests on port ${PORT}`);
		});
	})
	.catch(err => {
		if (process.env.APP_MODE === 'DEVELOPMENT') {
			console.error('error connecting to database!: ', err.name, err.message);
			console.error(err);
		} else {
			console.error('error connecting to database!: ', err.name, err.message);
		}
	});

server.on('error', err => {
	handleUnhandledError('uncaughtException', err);
});

process.setUncaughtExceptionCaptureCallback(err => {
	handleUnhandledError('uncaughtException', err);
});

process.on('uncaughtException', err => {
	handleUnhandledError('uncaughtException', err);
});

process.on('unhandledRejection', err => {
	handleUnhandledError('unhandledPromiseRejection', err);
});

process.on('SIGTERM', () => {
	console.info('SIGTERM RECEIVED. Shutting down gracefully...');
	server.close(() => console.info('server terminated!'));
});

process.on('SIGINT', () => {});

function handleUnhandledError(errorType, err) {
	if (process.env.APP_MODE === 'DEVELOPMENT') {
		console.info(
			errorType === 'uncaughtException'
				? 'UNCAUGHT EXCEPTION!'
				: 'UNHANDLED PROMISE REJECTION!',
		);
		console.error(`ERROR TYPE: ${err.name}\nERROR MESSAGE: ${err.message}`);
		console.error(err.stack);
		console.error(err);
	} else {
		console.error(errorType, err);
		server.close(() => {
			console.info(
				'An error has occurred and server has shut down gracefully.',
			);
			process.exit(1);
		});
	}
}
