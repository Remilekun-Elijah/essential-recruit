import mongoose from 'mongoose';

const RelocationIdealTimelineSchema = new mongoose.Schema({
	timeline: {
		type: String,
		required: true,
	},
});

export default mongoose.model(
	'RelocationIdealTimeline',
	RelocationIdealTimelineSchema,
);
