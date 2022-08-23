import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';

import GeneralModels from '../models/Application/index.js';

export default class GeneralController {
	static getData(model) {
		return catchAsyncError(async function (req, res, next) {
			const data = await GeneralModels[model]['find']({});
			Response.OK(res, `${model}s fetched successfully`, data);
		});
	}
}
