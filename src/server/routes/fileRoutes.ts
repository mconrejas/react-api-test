import express from "express";
import { uploadFile } from "../controllers/fileController";
import upload from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/upload", upload.single("file") as any, uploadFile);

export default router;
