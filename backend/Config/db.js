import mongoose from "mongoose";

const connectDb = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("MongoDB Successfully Connected...")

  }catch(error){
    console.log(`MongoDB Connection ${error}`);
  }
}

export default connectDb;