export interface Task{
    _id: string;
    taskTitle: string;
    description: string;
    dueDate: string;
    update:  "Urgent" | "Important" | "Work" | "Personal";
    completed: boolean
}