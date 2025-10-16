import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

export default db;