import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})