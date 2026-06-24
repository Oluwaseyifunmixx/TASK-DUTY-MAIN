// import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import TaskDutyLogo from "../assets/Task Duty Logo.svg"
import profilePicture from "../assets/Profile picture.svg";
import { useAuth } from "../context/AuthContext";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getTrashedTasks } from "../services/api";



const Navbar = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
     const [hoveredLink, setHoveredLink] = useState<string | null>(null)
     const [trashCount, setTrashCount] = useState<number>(0)

     useEffect(() => {
        const fetchTrashCount = async () => {
            if(!user) return

            try {
                const tasks = await getTrashedTasks()
                setTrashCount(tasks.length)
            } catch (err) {
                console.error("Failed to fetch trash count")
            }
        }
        fetchTrashCount()

        window.addEventListener("trashUpdated", fetchTrashCount)
        return() => window.removeEventListener("trashUpdated", fetchTrashCount)
     }, [user])

    const handleLogout = async () =>{
        await logout()
        navigate("/login")
    }
  return (

   <nav style ={{
      borderBottom: '0.5px solid #B8B6B6',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
   }}>

     <div style={{
        width: "100%",
        maxWidth: "1200px",
        padding: "0 80px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        
        <Link to="/">
        <img src={TaskDutyLogo} alt="Task Duty Logo" style={{
            height: "40px",
            objectFit: "contain"
        }}  />
        </Link>
    
        <span style={{
            fontSize: "27.37px",
            fontWeight: "600",
            color: "#2D0050",
            fontStyle: "semibold",
            fontFamily: "Signika Negative",
            textDecoration: "none",
            letterSpacing: "0px"
        }}>
            TaskDuty
        </span>
      </div>
    

    <div style={{
        display: "flex",
        gap: "40px",
        alignItems: "center"
    }}>
         
       {user ? (
        <>
        <Link to="/tasks/new"
        onMouseEnter={() => setHoveredLink("new")}
        onMouseLeave={() => setHoveredLink(null)}
         style={{
            fontSize: "22px",
            fontWeight: "500",
            color: hoveredLink === "new" ? "#974FD0" : "#292929",
            textDecoration: "none"
          }}>
             New Task
          </Link>

          <Link to="/tasks" 
          onMouseEnter={() => setHoveredLink("tasks")}
          onMouseLeave={() => setHoveredLink(null)}
          style={{
            fontSize: "22px",
            fontWeight: "500",
            color: hoveredLink === "tasks" ? "#974FD0" : "#292929",
            textDecoration: "none"
        }}>
            All Tasks
        </Link>

        <Link to="/trash"
        onMouseEnter={() => setHoveredLink("trash")}
        onMouseLeave={() => setHoveredLink(null)}
        style={{
            position: "relative",
        display: "flex",
        alignItems: "center",
        color: hoveredLink === "trash" ? "#974FD0" : "#292929",
        textDecoration: "none",
        transition: "color 0.2s",
        }}
        >
            <Trash2 size={24}/>
            {trashCount > 0 && (
                <span style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#D00000",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {trashCount}
                </span>
            )}
        </Link>

        {/* User Name section */}

        <span style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#2D0050",
        }}>
           {user.name}
        </span>

        {/* Profile picture */}

        <img src={profilePicture} alt="Profile Picture" onClick={() => navigate("/profile")}
        style={{
          width: "38px",
            height: "38px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            border: "0.5px solid #292929"
        }}
        />

        {/* Logout button */}

        <button 
        onClick={handleLogout}
        onMouseEnter={() => setHoveredLink("logout")}
        onMouseLeave={() => setHoveredLink(null)}
        style={{
            padding: "8px 20px",
            backgroundColor: hoveredLink === "logout" ? "#974FD0" : "#ffffff",
             color: hoveredLink === "logout" ? "#ffffff" : "black",
            border: "1px solid #974FD0",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer"
        }}>
            Logout
             </button>
        </>

    ) : (
        <>
        <Link to="/login" 
        onMouseEnter={() => setHoveredLink("login")}
        onMouseLeave={() => setHoveredLink(null)}
        style={{
             padding: "8px 20px",
            backgroundColor: hoveredLink === "login" ? "#974FD0" : "#ffffff",
             color: hoveredLink === "login" ? "#ffffff" : "black",
             borderRadius: "6px",
             fontSize: "18px",
             fontWeight: "500",
             textDecoration: "none"
        }}>
            Login
        </Link>

        <Link to="/register" 
        onMouseEnter={() => setHoveredLink("register")}
        onMouseLeave={() => setHoveredLink(null)}
        style={{
            padding: "8px 20px",
             backgroundColor: hoveredLink === "register" ? "#974FD0" : "#ffffff",
             color: hoveredLink === "register" ? "#ffffff" : "black",
             borderRadius: "6px",
             fontSize: "18px",
             fontWeight: "500",
             textDecoration: "none"
        }}>
           Register
        </Link>
        </>
       )}  
        
    </div>

    </div>

   </nav>
  )
}

export default Navbar