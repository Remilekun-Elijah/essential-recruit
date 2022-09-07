import cloudinary from 'cloudinary';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	folder: "Essentials"
});

export default async function uploadToCloudinary(
	path,
	destination,
	resourceType = 'raw',
) {
	const result = await cloudinary.v2.uploader.upload(path, {
		folder: destination,
		resource_type: resourceType,
	});
	return result.secure_url;
}
