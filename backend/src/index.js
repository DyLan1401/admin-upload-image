import "dotenv/config";
import express from "express";
import imageRoute from "../src/routes/imageRoute.js"
import globalErrorHandle from "./middleware/globalErrorHandle.js"
import cors from "cors";
const app = express();


app.use(cors());
//route
app.use("/api/admin", imageRoute);

app.use(globalErrorHandle);
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