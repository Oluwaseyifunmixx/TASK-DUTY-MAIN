// import React from 'react'
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/task";
import { getAllTasks, deleteTask } from "../services/api";
// import { dummyData } from "../data/dummyData";
import DeleteIcon from "../assets/fluent_delete-24-regular.svg"
import EditIcon from "../assets/clarity_note-edit-line.svg"
// import { Pencil, Trash2 } from "lucide-react";

const MyTask = () => {
    const navigate = useNavigate();
    const [tasks, setTasks]= useState<Task[]>([])
    const [hoverButton , setHoverButton]= useState<string | null>(null)
    const [loading, setLoading]= useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [filterUpdate, setFilterUpdate] = useState<string>("All")
   const [filterDone, setFilterDone] = useState<string>("All")

    // Fetch all tasks
    useEffect(() =>{
        const fetchTasks = async () => {
            try {
                const data = await getAllTasks()
                setTasks(data)
            } catch (error) {
                setError("Failed to fetch tasks")
            }
            setLoading(false)
        }
        fetchTasks()
    }, [])

    const handleDelete =async (id: string)=>{
        try {
            await deleteTask(id)
            setTasks(tasks.filter(task => task._id !== id))
        } catch (error) {
            setError("Failed to delete")
        }
    }

    const getUpdatingStyle = (update: string) =>{
        switch (update){
            case "Urgent":
                return { color: "#F38383" }
            case "Important":
                return {color: "#73C3A6" }
             case "Work":
                return { color: "#1A3D7A" }
            case "Personal":
                 return { color: "#6A1A9A" }   
        }
    }

    if (loading) return(
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "24px",
            color: "#974FD0"
        }}>
            Loading tasks...
        </div>
    )

    if (error) return(
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "24px",
            color: "#D00000"
        }}>
              {error}
        </div>
    )

     const filteredTask = tasks.filter(task => {
       const matchUpdate = filterUpdate === "All" || task.update === filterUpdate
       const matchesCompleted = 
       filterDone ==="All" ||
       (filterDone === "Completed" && task.completed) ||
       (filterDone === "Pending" && !task.completed)

       return matchUpdate && matchesCompleted
    })

  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        minHeight: "100vh"
    }}>

        <div style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "40px 80px"
        }}>

        {/* Header */}

        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
        }}>

            <h1 style={{
                fontSize: "50px",
                fontWeight: "500",
                color: "#292929"
            }}>
                My Tasks
            </h1>
            <span onClick={() =>navigate("/tasks/new")} style={{
                fontSize: "24px",
                fontWeight: "500",
                color: "#974FD0",
                cursor: "pointer"
            }}>
                + Add New Task
            </span>
        </div>

{/* Filter section */}

      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "32px",
        alignItems: "center"
      }}>

        <span style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#292929"
        }}>
            Filter:
        </span>

        <select value ={filterUpdate} 
        onChange={(e) => setFilterUpdate(e.target.value)}
        style={{
            padding: "8px 16px",
            border: "1px solid #B8B6B6",
            borderRadius: "8px",
            fontSize: "16px",
            color: "#292929",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            outline: "none"
        }}>
     
     <option value="All">All Tags</option>
     <option value="Urgent">Urgent</option>
     <option value="Important">Important</option>
     <option value="Work">Work</option>
     <option value="Personal">Personal</option>
        </select>

         <select value ={filterDone} 
        onChange={(e) => setFilterDone(e.target.value)}
        style={{
            padding: "8px 16px",
            border: "1px solid #B8B6B6",
            borderRadius: "8px",
            fontSize: "16px",
            color: "#292929",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            outline: "none"
        }}>
     
     <option value="All">All Tags</option>
     <option value="Completed">Completed</option>
     <option value="Pending">Pending</option>
        </select>   
      </div>


        {/* Tasks Section */}
        <div style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Signika Negative",
            fontSize: "24px",
            fontWeight: "400",
            gap: "40px"
        }}>

            {filteredTask.length === 0 ?(
                <p style={{
                    fontSize: "24px",
                    color: "#737171",
                    textAlign: "center",
                    marginTop: "40px"
                }}>
                   No tasks yet. Click + Add New Task to get started!
                </p>
            ) : 
         filteredTask.map(task => (
            <div key={task._id} style={{
                border: "0.5px solid #B8B6B6",
                borderRadius: "10px",
                fontSize: "24px",
                padding: "20px 15px",
                backgroundColor: "#ffffff"
            }}>

                {/* Edit and delete section */}

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px"
                }}>
                    <span style={{
                        ...getUpdatingStyle(task.update),
                        padding: "4px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600"
                    }}>
                     {task.update}
                    </span>

                    <div style={{
                        display: "flex",
                        gap: "23px"
                    }}>
                        <button onClick={() => navigate(`/tasks/edit/${task._id}`)}
                        onMouseEnter={() =>setHoverButton(`edit-${task._id}`)}
                        onMouseLeave={()=> setHoverButton(null)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 20px",
                                backgroundColor: hoverButton === `edit-${task._id}` ? "#974FD0" : "#ffffff",
                                color: hoverButton === `edit-${task._id}` ? "#ffffff" : "#974FD0",
                                border: "1px solid #974FD0",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer"
                            }}>
                                <img src={EditIcon} alt="edit icon" style={{
                                    width: "14px",
                                    height: "14px",
                                    filter: hoverButton === `edit-${task._id}` ? "brightness(0) invert(1)" : "none"
                                }} />
                               Edit
                        </button>

                        <button onClick={() => handleDelete(task._id)}
                        onMouseEnter={()=> setHoverButton(`delete-${task._id}`)}
                        onMouseLeave={() => setHoverButton(null)}
                         style={{
                            display: "flex",
                            padding: "4px 22px",
                            gap: "6px",
                           backgroundColor: hoverButton === `delete-${task._id}` ? "#974FD0" : "#ffffff",
                           color: hoverButton === `delete-${task._id}` ? "#ffffff" : "#974FD0",
                           border: "1px solid #974FD0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer"
                        }}>
                            <img src={DeleteIcon} alt="Delete Icon" style={{
                                width: "14px",
                                height: "22px",
                                filter: hoverButton === `delete-${task._id}` ? "brightness(0) invert(1)" : "none"
                               
                            }} />
                            Delete
                        </button>
                    </div>
                </div>
 
                <hr style={{
                    border: "none",
                    borderTop: "1px solid #D1D1D1",
                    marginBottom: "16px"
                }} />

                {/* Title */}

                <h3 style={{
                    fontSize: "35px",
                    fontWeight: "400",
                    color: "#292929",
                    fontFamily: "Signika Negative",
                    marginBottom: "8px"
                }}>
                   {task.taskTitle}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: "24px",
                    fontWeight: "400",
                    color: "#737171",
                    lineHeight: "1.5"
                }}>
                    {task.description}
                </p>
            </div>
         ))}
        </div>

        {/* Back to the top */}
        <div style={{
           
            height: "32px",
            alignContent: "center",
            textAlign: "center",
            marginTop: "40px"
        }}>
            <span onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} style={{
                fontSize: "26px",
                color: "#974FD0",
                fontWeight: "400",
                fontFamily: "Signika Negative",
                cursor: "pointer",
                textDecoration: "underline"
            }}>
                Back to top
            </span>

        </div>
</div>
    </div>
  )
}

export default MyTask