// import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import TaskDutyLogo from "../assets/Task Duty Logo.svg"
import { useAuth } from "../context/AuthContext";
import { Trash2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getTrashedTasks } from "../services/api";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const Navbar = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const [trashCount, setTrashCount] = useState<number>(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const width = useWindowWidth()
    const isMobile = width < 768

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

     useEffect(() => {
        if (!isMobile) setMenuOpen(false)
     }, [isMobile])

    const handleLogout = async () =>{
        await logout()
        navigate("/login")
        setMenuOpen(false)
    }

    const initials = user?.name
      ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : "?"

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
        padding: isMobile ? "0 20px" : "0 80px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative"
      }}>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        
        <Link to="/">
        <img src={TaskDutyLogo} alt="Task Duty Logo" style={{
            height: isMobile ? "32px" : "40px",
            objectFit: "contain"
        }}  />
        </Link>
    
        <span style={{
            fontSize: isMobile ? "20px" : "27.37px",
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

      {isMobile ? (
        user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              onClick={() => navigate("/profile")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#974FD0",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                border: "0.5px solid #292929"
              }}
            >
              {initials}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={26} color="#292929" /> : <Menu size={26} color="#292929" />}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} color="#292929" /> : <Menu size={26} color="#292929" />}
          </button>
        )
      ) : (

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

        <span style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#2D0050",
        }}>
           {user.name}
        </span>

        <div
          onClick={() => navigate("/profile")}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "#974FD0",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            border: "0.5px solid #292929"
          }}
        >
          {initials}
        </div>

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
      )}

    </div>

    {isMobile && menuOpen && (
      <div style={{
        position: "absolute",
        top: "70px",
        left: 0,
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "0.5px solid #B8B6B6",
        display: "flex",
        flexDirection: "column",
        padding: "16px 20px",
        gap: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
      }}>
        {user ? (
          <>
            <Link to="/tasks/new" onClick={() => setMenuOpen(false)} style={{ fontSize: "18px", fontWeight: "500", color: "#292929", textDecoration: "none" }}>
              New Task
            </Link>
            <Link to="/tasks" onClick={() => setMenuOpen(false)} style={{ fontSize: "18px", fontWeight: "500", color: "#292929", textDecoration: "none" }}>
              All Tasks
            </Link>
            <Link to="/trash" onClick={() => setMenuOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "18px", fontWeight: "500", color: "#292929", textDecoration: "none"
            }}>
              <Trash2 size={20} /> Trash {trashCount > 0 && `(${trashCount})`}
            </Link>
            <span style={{ fontSize: "16px", fontWeight: "500", color: "#2D0050" }}>
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffffff",
                color: "black",
                border: "1px solid #974FD0",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{
              padding: "10px 20px", textAlign: "center",
              border: "1px solid #974FD0", borderRadius: "6px",
              fontSize: "18px", fontWeight: "500", color: "black", textDecoration: "none"
            }}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} style={{
              padding: "10px 20px", textAlign: "center",
              backgroundColor: "#974FD0", borderRadius: "6px",
              fontSize: "18px", fontWeight: "500", color: "#ffffff", textDecoration: "none"
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    )}

   </nav>
  )
}

export default Navbar