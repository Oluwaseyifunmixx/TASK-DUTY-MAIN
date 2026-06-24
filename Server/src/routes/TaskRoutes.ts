import express from "express";
import { CreateTask, GetAllTask, GetSingleTask, UpdateATask, DeleteTask, GetTrashedTasks, RestoreTrashTask,PermanentDeleteTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router()

router.get("/", protect, GetAllTask);
router.get("/trash", protect, GetTrashedTasks);
router.get("/:id",protect, GetSingleTask);
router.post("/", protect, CreateTask);
router.put("/restore/:id", protect, RestoreTrashTask);
router.put("/:id", protect, UpdateATask);
router.delete("/permanent/:id", protect, PermanentDeleteTask)
router.delete("/:id", protect, DeleteTask)


export default router;