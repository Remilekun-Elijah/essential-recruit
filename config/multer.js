import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

import HttpStatuses from '../helpers/http_statuses.js';
import main from 'require-main-filename';

const __dirname = dirname(fileURLToPath(import.meta.url));

const imageStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
			const dir = `${main()}/uploads/images`;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			callback(null, dir);
		} else {
			const error = new Error('only jpeg and png images are supported');
			error.statusCode = HttpStatuses.statusUnprocessableEntity;
			callback(error, false);
		}
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const videoStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.mimetype === 'video/mp4') {
			const dir = `${main()}/uploads/videos`;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			callback(null, dir);
		} else {
			const error = new Error('video must be in mp4 format only.');
			error.statusCode = HttpStatuses.statusUnprocessableEntity;
			callback(error, false);
		}
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const pdfStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.mimetype === 'application/pdf') {
			const dir = `${main()}/uploads/documents`;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			callback(null, dir);
		} else {
			const error = new Error('only pdf files are supported');
			error.statusCode = HttpStatuses.statusUnprocessableEntity;
			callback(error, false);
		}
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

export default {
	imageUpload: multer({
		storage: imageStorage,
		limits: { fileSize: 20971520 },
	}),
	videoUpload: multer({
		storage: videoStorage,
		limits: { fileSize: 20971520 },
	}),
	pdfUpload: multer({ storage: pdfStorage, limits: { fileSize: 104857600 } }),
};
