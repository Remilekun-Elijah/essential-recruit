import mongoose from "mongoose";


export default function validateObjectId(objectId) {
	const ObjectId = mongoose.Types.ObjectId;
	if (ObjectId.isValid(objectId)) {
		if (String(new ObjectId(objectId)) === objectId) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
