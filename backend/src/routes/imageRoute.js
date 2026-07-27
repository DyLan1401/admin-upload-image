import { Router } from "express";
import upload from "../middleware/upload.js";
import * as ImageController from "../controller/imageController.js"

const route = Router();

route.post("/images", upload.single("image"), ImageController.PostImage);
route.get("/images", ImageController.GetImage);

export default route;