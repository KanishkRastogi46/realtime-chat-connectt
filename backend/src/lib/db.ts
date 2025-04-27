import mongoose from "mongoose";


const connectDB = async function () {
    try {
        const mongodbInstance = await mongoose.connect(String(process.env.MONGODB_URI));
        console.log(`Database connected successfully at mongodb://${mongodbInstance.connection.host}:${mongodbInstance.connection.port}/${mongodbInstance.connection.name}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;