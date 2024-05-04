import mongoose from "mongoose"; // Importing Mongoose library

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    // Connecting to MongoDB using the DB_URL from environment variables
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Exporting the connectToMongoDB function
export default connectToMongoDB;
