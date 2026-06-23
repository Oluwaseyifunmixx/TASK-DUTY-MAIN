import express from "express";
import { CreateTask, GetAllTask, GetSingleTask, UpdateATask, DeleteTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router()

router.get("/", protect, GetAllTask);
router.get("/:id",protect, GetSingleTask);
router.post("/", protect, CreateTask);
router.put("/:id", protect, UpdateATask);
router.delete("/:id", protect, DeleteTask)

export default router;