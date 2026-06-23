// import React from 'react'
import { useNavigate } from "react-router-dom";
import TaskDutyGroup from "../assets/Task Duty Group.svg";

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
       height: "100vh",
        overflow: "hidden"
    }}>

        <div style={{
            width: "100%",
            display: "flex",
            padding: "0 80px",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
        }}>
     
     <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        lineHeight: "1.6",
        maxWidth: "600px",
     }}>
    
                <h1 style={{
                fontSize: "45px",
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
                fontSize: "45px",
                fontFamily: "Signika Negative",
                fontStyle: "medium",
                lineHeight: "100%",
                letterSpacing: "0%"
              }}>TaskDuty</span>
            </h1>
            
            <p style={{
                fontSize: "24px",
                width: "535px",
                fontWeight: "400",
                color: "#737171",
                fontFamily: "Signika Negative",
            }}>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus, sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl semper porttitor. Nec accumsan.
            </p>

            <button onClick={() =>navigate("/tasks")} style={{
                width: "fit-content",
                padding: "6px 18px",
                backgroundColor:  "#974FD0",
                color: "#FAF9FB",
                fontSize: "24px",
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
                maxWidth: "550px",
                objectFit: "contain"
            }} />
        </div>
      </div>
    </div>
  )
}

export default LandingPage