import { Router } from 'express';
import GeneralController from '../controllers/general.js';
import GeneralModels from '../models/Application/index.js';

const router = Router();

for (let model in GeneralModels) {
	router.get(`/${model}s`, GeneralController.getData(model));
}

export default router;
