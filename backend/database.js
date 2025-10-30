import mongoose from "mongoose";

const db = async () => {
    try {
        // sanitize MONGO env value: remove surrounding quotes if present
        const raw = process.env.MONGO || "";
        const uri = raw.trim().replace(/^['"]+|['"]+$/g, "");

        if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
            throw new Error(
                "Invalid MongoDB connection string. Ensure MONGO starts with 'mongodb://' or 'mongodb+srv://'. If using a .env file, do not wrap the URL in quotes."
            );
        }

        await mongoose.connect(uri);

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        console.error(
            "Hint: check backend/.env -> MONGO value. It should look like: MONGO=mongodb+srv://user:pass@cluster0.mongodb.net/mydb (no surrounding quotes)"
        );
    }
};

export default db;