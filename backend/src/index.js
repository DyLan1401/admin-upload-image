import "dotenv/config";
import express from "express";
import cloudinary from "./config/cloudinary.js";
import imageRoute from "../src/routes/imageRoute.js"
const app = express();


//
app.use("/api/admin", imageRoute);


//test
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

console.log(cloudinary.config());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`đang chạy ở PORT:${PORT}`)
});