// import React from 'react'
import { useNavigate } from "react-router-dom";
import TaskDutyGroup from "../assets/Task Duty Group.svg";
import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const LandingPage = () => {
    const navigate = useNavigate()
    const width = useWindowWidth()
    const isMobile = width < 768

  return (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
       height: isMobile ? "auto" : "100vh",
       minHeight: isMobile ? "100vh" : undefined,
        overflow: isMobile ? "visible" : "hidden"
    }}>

        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            padding: isMobile ? "40px 20px" : "0 80px",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
            gap: isMobile ? "32px" : "0",
        }}>
     
     <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        lineHeight: "1.6",
        maxWidth: isMobile ? "100%" : "600px",
        textAlign: isMobile ? "center" : "left",
        alignItems: isMobile ? "center" : "flex-start",
     }}>
    
                <h1 style={{
                fontSize: isMobile ? "30px" : "45px",
                fontWeight: "500",
                color: "#292929",
                lineHeight: "1.2",
                fontFamily: "Signika Negative",
                letterSpacing: "0%"
            }}>
              Manage your Tasks on <br/>
              <span style={{
                color: "#974FD0",
                fontWeight: "500",
                fontSize: isMobile ? "30px" : "45px",
                fontFamily: "Signika Negative",
                fontStyle: "medium",
                lineHeight: "100%",
                letterSpacing: "0%"
              }}>TaskDuty</span>
            </h1>
            
            <p style={{
                fontSize: isMobile ? "16px" : "24px",
                width: isMobile ? "100%" : "535px",
                fontWeight: "400",
                color: "#737171",
                fontFamily: "Signika Negative",
            }}>
                Stay organized and never miss a deadline.
                Create,track,and manage your tasks in one place, mark them complete,restore deleted ones from trash,and keep your workflow clean and simple.
            </p>

            <button onClick={() =>navigate("/tasks")} style={{
                width: "fit-content",
                padding: isMobile ? "10px 24px" : "6px 18px",
                backgroundColor:  "#974FD0",
                color: "#FAF9FB",
                fontSize: isMobile ? "18px" : "24px",
                fontWeight: "500",
                fontFamily: "Signika Negative",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
            }}>
                    Go to my Tasks
            </button>
        </div>

        {/* Group image section */}

        <div>
            <img src={TaskDutyGroup} alt="Task duty hero" style={{
                width: "100%",
                maxWidth: isMobile ? "320px" : "550px",
                objectFit: "contain"
            }} />
        </div>
      </div>
    </div>
  )
}

export default LandingPage