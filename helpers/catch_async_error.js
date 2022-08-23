export default function (controller) {
	return function (req, res, next) {
		return controller(req, res, next).catch(next);
	};
}
