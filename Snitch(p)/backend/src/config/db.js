import mongoose from "mongoose"
import config from "./config.js"

async function connectToDb(){
    try{
        await mongoose.connect(config.MONGODB_URL)
        .then(() => {
            console.log("Connected to MongoDB")
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        throw error
    }
}

export default connectToDb;