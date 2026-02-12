import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed: ", error)
    })


// app.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
// })