import { Request, Response } from "express";
import Task from "../models/Task";

// Create A Task

export const CreateTask = async (req: Request, res: Response): Promise<void>=>{
    try {
        const {
            taskTitle, description, dueDate, update, completed
        } = req.body

        if (!taskTitle || !description || !dueDate ||!update) {
            res.status(400).json({
                success: false,
                message: "Please fill out all fields"
            });
            return;
        }

        const newTask = await Task.create({
            taskTitle,
            description,
            dueDate,
            update,
            completed,
            userId: req.user?._id
        });
        res.status(201).json({
            success: true,
            newTask
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error", error
        })
    }
}

// Get All Task
export const GetAllTask = async (req:Request, res:Response): Promise<void>=>{
    try {
        const tasks = await Task.find({userId: req.user?._id})
        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// Get A single Task
export const GetSingleTask = async (req:Request, res: Response):Promise<void>=>{
    try {
        const task = await Task.findOne({_id: req.params.id, userId: req.user?._id})
        if (!task) {
         res.status(404).json({
            success: false,
            message: "Task not found"
         });
         return;
        }
        res.status(200).json({
            success: true,
            task
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Server error"
        })
    }
}

// Update A task
export const UpdateATask = async (req:Request, res:Response): Promise<void>=>{
    try {
      const {
        taskTitle,
        description,
        dueDate,
        update,
        completed,
      }  = req.body

      const UpdatedTask = await Task.findOneAndUpdate(
       {_id: req.params.id, userId: req.user?._id},
        {taskTitle, description, dueDate, update, completed},
        {new: true, runValidators: true}
      )

      if (!UpdatedTask) {
        res.status(404).json({
            success: false,
            message: "Task not found"
        });
        return;
      }
      res.status(200).json({
        success: true,
        UpdatedTask
      })
    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Server error"
       }) 
    }
}

// Delete A task
export const DeleteTask = async (req:Request, res: Response): Promise<void> =>{
    try {
        const deletedTask = await Task.findOneAndDelete({_id: req.params.id, userId: req.user?._id})

        if(!deletedTask){
             res.status(404).json({
                success: false,
                message: "No task found"
             });
             return;
        }
        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}