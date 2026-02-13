import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import connectDB from "./db/index.js";
import app from "./app.js";

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