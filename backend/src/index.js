import "dotenv/config";
import express from "express";
import imageRoute from "../src/routes/imageRoute.js"
const app = express();


//route
app.use("/api/admin", imageRoute);


//test
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`đang chạy ở PORT:${PORT}`)
});