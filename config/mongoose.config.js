import mongoose from "mongoose";

const connectToMongoDB=async()=>{
    mongoose.connect(process.env.DB_URL);
    console.log("connected to monogDB");

}
export default connectToMongoDB;
