import axios from "axios";
import type { Task } from "../types/task";

const API =axios.create({
   baseURL: "http://localhost:8090",
   withCredentials: true
})

// GET ALL TASKS
export const getAllTasks = async(): Promise<Task[]> =>{
   const response = await API.get("/tasks")
   return response.data.tasks
}

// GET A SINGLE TASK

export const getASingleTask = async (id: string): Promise<Task> =>{
   const response = await API.get (`/tasks/${id}`)
   return response.data.task
}

// Create A Task

export const CreateTask = async(taskData: Omit<Task, "_id">): Promise<Task> =>{
   const response = await API.post ("/tasks", taskData)
   return response.data.newTask
}

// Update Task

export const updateTask = async(id: string, taskData: Partial<Task>): Promise<Task> =>{
    const response = await API.put(`/tasks/${id}`, taskData)
    return response.data.UpdatedTask
}

// Delete Task
export const deleteTask = async (id: string): Promise<void> =>{
    await API.delete(`/tasks/${id}`)
}

//=======AUTH ENDPOINTS ===================

export const RegisterUser = async(data: {name: string; email: string; password: string;}) =>{
   const response = await API.post ("/auth/register", data)
   return response.data.user
}

export const LoginUser = async(data: {email: string; password: string})=>{
   const response = await API.post("/auth/login", data)
   return response.data.user
}

export const LogoutUser = async()=>{
   await API.post("/auth/logout")
}

export const getMe = async ()=>{
   const response = await API.get("/auth/me")
   return response.data.user
}

export const updateProfile = async (data: {
    name?: string
    currentPassword?: string
    newPassword?: string
}) => {
    const response = await API.put("/auth/update-profile", data)
    return response.data.user
}