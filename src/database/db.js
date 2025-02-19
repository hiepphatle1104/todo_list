import mongoose from "mongoose";

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Database is connected!");
	} catch (error) {
		console.error("Error:", error);
	}
};

export default dbConnect;
