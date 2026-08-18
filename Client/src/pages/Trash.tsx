import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getTrashedTasks, restoreTask, permanentDeleteTask } from "../services/api"
import type { Task } from "../types/task"
import arrowLogo from "../assets/Vector (1).svg"
import DeleteIcon from "../assets/fluent_delete-24-regular.svg"
import { ClipLoader } from "react-spinners"

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const Trash = () => {

    const navigate = useNavigate()
    const [tasks, setTasks] = useState<Task[]> ([])
    const [loading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [hoverButton, setHoverButton] = useState<string | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const width = useWindowWidth()
    const isMobile = width < 768

useEffect(() =>{
    const fetchTrashedTasks = async ()=>{
        try {
            const data = await getTrashedTasks()
            setTasks(data)
        } catch (err) {
            setError("Failed to fetch trashed tasks")
        }finally{
            setIsLoading(false)
        }
    }
    fetchTrashedTasks()
}, [])

const handleRestore = async (id: string) => {
    try {
        await restoreTask(id)
        setTasks(tasks.filter(task => task._id !== id))
        window.dispatchEvent(new Event("trashUpdated"))
    } catch (err) {
        setError("Failed to restore task")
    }
}

const handlePermanentDelete = async () => {
    if (!selectedTaskId) return

    try {
      await permanentDeleteTask(selectedTaskId)
      setTasks(tasks.filter(task => task._id !== selectedTaskId))
      setShowModal(false)
      setSelectedTaskId(null)  
      window.dispatchEvent(new Event("trashUpdated"))
    } catch (err) {
        setError("Failed to delete task permanently")
    }
}

const handleEmptyTrash = async () => {
    try {
        await Promise.all(tasks.map(task => permanentDeleteTask(task._id)))
        setTasks([])
        setShowModal(false)
        window.dispatchEvent(new Event("trashUpdated"))
    } catch (err) {
        setError("Failed to empty trash")
    }
}

const getUpdatingStyle = (update: string) => {
     switch(update){
         case "Urgent": return { color: "#F38383" }
         case "Important": return { color: "#73C3A6" }
         case "Work": return { color: "#1A3D7A" }
         case "Personal": return { color: "#6A1A9A" }
     }
}

if (loading) return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
    }}>
   <ClipLoader color="#974FD0" size={50}/>
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
            padding: isMobile ? "24px 20px" : "40px 80px"
        }}>
    
    {/* Header */}
       <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? "12px" : "0",
        marginBottom: "32px"
       }}>
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
        }}>
        <img src={arrowLogo} alt="back" onClick={() => navigate("/tasks")} style={{
          width: "32px",
          height: "32px",
          cursor: "pointer"
        }}/>
        <h1 style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "500",
            color: "#292929",
        }}>
           Trash
        </h1>
        </div>

    {/* Empty Trash Button */}
       {
        tasks.length > 0 && (
            <button onClick={() => {
                setShowModal(true)
                setSelectedTaskId(null)
            }}
            onMouseEnter={() => setHoverButton("empty")}
            onMouseLeave={() => setHoverButton(null)}
            style={{
                padding: "8px 20px",
                backgroundColor: hoverButton === "empty" ? "#D00000" : "#ffffff",
                color: hoverButton === "empty" ? "#ffffff" : "#D00000",
                border: "1px solid #D00000",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto"
            }}>
                    Empty Trash
            </button>
        )
       }        
       </div>

        {tasks.length > 0 && (
            <p style={{
                fontSize: "14px",
                color: "#737171",
                maxWidth: isMobile ? "100%" : "35%",
                 marginBottom: "24px",
                 padding: "10px 16px",
                 backgroundColor:  "#F3E8FF",
                 borderRadius: "8px",
                //  border: "0.5px solid #974FD0",
            }}>
              ⚠️ Tasks will be permanently deleted after <strong>21 days</strong>
            </p>
        )}

       {/* Empty state */}
       {
        tasks.length === 0 ? (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "80px",
                gap: "16px"
            }}>
        
        <p style={{
            fontSize: "30px",
            color: "black",
            fontWeight: "400",
            textAlign: "center"
        }}>
          Trash is Empty
        </p>
        <span style={{
            fontSize: "40px"
        }}>
           🗑️
        </span>
            </div>
        ) :(
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "24px" : "40px"
            }}>
                {tasks.map( task => (
                    <div key={task._id} style={{
                        border:  "0.5px solid #B8B6B6",
                        borderRadius: "10px",
                        padding: isMobile ? "16px 12px" : "20px 15px",
                        backgroundColor: "#ffffff",
                        opacity: 0.8,
                    }}>
    
    {/* Top Row */}
                 <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    gap: isMobile ? "12px" : "0",
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
            gap: "12px"
          }}>

            {/* The Restore button */}
            <button onClick={() => handleRestore(task._id)}
            onMouseEnter={() => setHoverButton(`restore-${task._id}`)}
            onMouseLeave={() => setHoverButton(null)}
            style={{
                padding: "6px 8px",
                backgroundColor: hoverButton === `restore-${task._id}` ? "#974FD0" : "#ffffff",
                color: hoverButton === `restore-${task._id}` ? "#ffffff" : "#974FD0",
                border: "1px solid  #974FD0",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
            }}>
                 Restore
            </button>

            {/* Permanent Delete Button  */}
            <button onClick={() => {setSelectedTaskId(task._id) 
                setShowModal(true)
            }}
            onMouseEnter={() => setHoverButton(`delete-${task._id}`)}
            onMouseLeave={() => setHoverButton(null)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                backgroundColor: hoverButton === `delete-${task._id}` ? "#D00000" : "#ffffff",
                color: hoverButton === `delete-${task._id}` ? "#ffffff" : "#D00000",
                border: "1px solid #D00000",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
            }}
            >
              <img src={DeleteIcon} alt="delete" 
              style={{
                width: "14px",
                height: "14px",
                filter: hoverButton === `delete-${task._id}` ? "brightness(0) invert(1)" : "none"
              }}/>

           Delete Forever
            </button>
          </div>
                 </div>

                 <hr style={{
                    border: "none",
                    borderTop: "1px solid #D1D1D1",
                    marginBottom: "16px"
                 }}/>

                 {/* Title */}
                 <h3 style={{
                    fontSize: isMobile ? "24px" : "35px",
                    fontWeight: "400",
                    color: "black",
                    marginBottom: "8px"
                 }}>
                  {task.taskTitle}
                 </h3>

                 {/* Description */}
                 <p style={{
                    fontSize: isMobile ? "16px" : "24px",
                    fontWeight: "400",
                    color: "#B8B6B6",
                    lineHeight: "1.5"
                 }}>
                   {task.description}
                 </p>

                 {/* Deleted Date. This shows the date the task was deleted*/}
                 <p style={{
                    fontSize: "13px",
                    color: "#D00000",
                    marginTop: "12px"
                 }}>
           Deleted on: {new Date(task.deletedAt!).toLocaleDateString()}
                 </p>
                    </div>
                ))}
            </div>
       )}

     {/* Back to top, only show when there are tasks */}
      {tasks.length > 0 && (
        <div style={{
            textAlign: "center",
            marginTop: "40px"
        }}>
            <span onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} style={{
                fontSize: isMobile ? "18px" : "24px",
                color: "#974FD0",
                fontWeight: "400",
                cursor: "pointer",
                textDecoration: "underline"
            }}>
                 Back to top
            </span>

        </div>
      )}
        </div>

        {/* Confirmation modal */}
        {showModal && (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: isMobile ? "28px 24px" : "40px",
                    maxWidth: "400px",
                    width: "90%",
                    textAlign: "center"
                }}>
            <span style={{
                fontSize: "38px",
            }}>
              ⚠️
            </span>
            <h2 style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#292929",
                margin: "16px 0 8px"
            }}>
        {selectedTaskId ? "Delete Forever" : "Empty Trash"}
            </h2>
            <p style={{
                fontSize: "16px",
                color: "#737171",
                marginBottom: "24px"
            }}>
                {/* if you're trying to deleted a task or all task */}
            {selectedTaskId
            ? "This task will be permanently deleted and cannot be recovered."
            : "All tasks in trash will be permanently deleted and cannot be recovered."
        }
            </p>

            <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "12px",
                justifyContent: "center"
            }}>
                <button onClick={() =>{
                    setShowModal(false)
                    setSelectedTaskId(null)
                }} style={{
                    padding: "10px 24px",
                    backgroundColor: "#ffffff",
                    color: "#292929",
                    border: "1px solid #B8B6B6",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer"
                }}>
                     Cancel
                </button>
                <button onClick={selectedTaskId ? handlePermanentDelete : handleEmptyTrash} style={{
                    padding: "10px 24px",
                    backgroundColor: "#D00000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer"
                }}>
               {selectedTaskId ? "Delete Forever" : "Empty Trash"}
                </button>

            </div>
                </div>

            </div>
        )}

    </div>
  )
}

export default Trash