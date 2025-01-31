import express from 'express';
import { create, fetch, update, destroy } from '../controllers/referralController';
import upload from "../middlewares/uploadMiddleware";

const router = express.Router();

// Referral routes
router.post('/', upload.single("avatar") as any, create);
router.get('/', fetch);
router.put('/:id', upload.single("avatar") as any, update);
router.delete('/:id', destroy);

export { router as referralRoutes };
