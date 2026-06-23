// import React from 'react'
import { useNavigate } from "react-router-dom";
import arrowLogo from "../assets/Vector (1).svg"
import { useState } from "react";
import { CreateTask } from "../services/api";

const NewTask = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState<{
        taskTitle: string,
        description: string,
        dueDate: string,
        update: "Urgent" | "Important" | "Work" | "Personal",
        completed: boolean
    }>({
       taskTitle: "",
       description: "",
       dueDate: "",
       update: "Urgent",
       completed: false
    })

    const [errors, setErrors] = useState({
        taskTitle: "",
        description: "",
        dueDate: ""
    })

    const validate = ()=>{
        const newErrors = {
            taskTitle: "",
            description: "",
            dueDate: ""
        }

       let isValid = true;

        if (!formData.taskTitle.trim()) {
            newErrors.taskTitle ="Title is required"
            isValid = false
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description cannot be left empty"
            isValid = false
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required",
            isValid = false
        }else{
            const newDate = new Date()
            newDate.setHours(0,0,0,0)

            const selectedDate = new Date(formData.dueDate)

            if (selectedDate < newDate) {
                newErrors.dueDate = "Due date cannot be in the past"
                isValid = false
            }
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        const {name, value} = e.target
        if (name === "update") {
            setFormData({
           ...formData, 
           update: value as "Urgent" | "Important" | "Work" | "Personal"
        });
        } else{
            setFormData({
                ...formData,
                [name]: value
            })
        }
        
    };

    const handleSubmit = async () => {
        if (!validate()) return
        try {
            await CreateTask({
                taskTitle: formData.taskTitle,
                description: formData.description,
                dueDate: formData.dueDate,
                update: formData.update,
                completed: formData.completed
            })
            navigate("/tasks")
        } catch (error) {
            console.error("Failed to create task", error)
        }      
    }
  return (
   <div style={{
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
   }}>

    <div style={{
    width: "100%",
    maxWidth: "1200px",
    padding: "40px 80px",
    }}>

           
    {/* Header */}

    <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "40px"
    }}>
        <img src={arrowLogo} alt="back"  onClick={() => navigate("/tasks")} style={{
            width: "32px",
            height: "32px",
            cursor: "pointer"
        }}
        />

        <h1 style={{
            fontSize: "50px",
            fontWeight: "500",
            color: "#292929"
        }}>
           New Task
        </h1>

    </div>

    {/* Form section */}
    <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "100%"
    }}>

        {/* Title */}

       <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px"
       }}>
         <fieldset style={{
            border: errors.taskTitle? "1px solid #D00000" : "1px solid #9C9C9C",
            borderRadius: "8px",
            padding: "0 16px 12px 16px",
        }}>

          <legend style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#9C9C9C",
            padding: "0 6px"
          }}>
           Task Title
          </legend>

          <input type="text"
          name = "taskTitle"
          value={formData.taskTitle}
          onChange={handleChange}
          placeholder="E.g Project Defense, Assignment ..."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#9C9C9C",
            backgroundColor: "transparent"
          }}/>
        </fieldset>
        {errors.taskTitle &&(
            <span style={{
                fontSize: "13px",
                color: "#D00000",
            }}>
                {errors.taskTitle}
            </span>
          )}

       </div>

        {/* Description */}
        <div
        style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px"
       }}>
            <fieldset style={{
            border: errors.description ? "1px solid #D00000" : "1px solid #B8B6B6",
            borderRadius: "8px",
            padding: "0 16px 12px 16px"
        }}>
         <legend style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#9C9C9C",
            padding: "0 6px"
         }}>
           Description
         </legend>

         <textarea name="description" value={formData.description} onChange={handleChange}
         placeholder="Briefly describe your task..." rows={7}
         style={{
           width: "100%",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#9C9C9C",
            backgroundColor: "transparent",
            resize: "none",

         }}/>
        </fieldset>
         {errors.description &&(
            <span style={{
                  fontSize: "13px",
                  color: "#D00000"
            }}>
                {errors.description}
            </span>
        )}

        </div>
        {/* Tags */}

        <fieldset style={{
           border: "1px solid #B8B6B6",
           borderRadius: "8px",
           padding: "0 16px 12px 16px",
        }}>

            <legend style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#9C9C9C",
                padding: "0 6px",
            }}>
              Tags
            </legend>

            <select
            name="update"
            value ={formData.update}
            onChange={handleChange}
            style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: "#292929",
                backgroundColor: "transparent",
            }}>
           <option value="Urgent">Urgent</option>
           <option value="Important">Important</option>
           <option value="Work">Work</option>
           <option value="Personal">Personal</option>
            </select>

        </fieldset>

        {/* Due Date */}
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px"
       }}>
            <fieldset style={{
            border: errors.dueDate ? "1px solid #D00000" : "1px solid #B8B6B6",
            borderRadius: "8px",
            padding: "0 16px 12px 16px",
        }}>

            <legend style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#9C9C9C",
                padding: "0 6px",
            }}>
              Due Date
            </legend>
           
           <input 
           type ="date"
           name ="dueDate"
           value={formData.dueDate}
           onChange={handleChange}
           style={{
            width: "100%",
             border: "none",
             outline: "none",
             fontSize: "16px",
             color: "#292929",
             backgroundColor: "transparent",
           }}/>
        </fieldset>
        {errors.dueDate && (
            <span style={{
                fontSize: "13px",
                color: "#D00000"
            }}>
                {errors.dueDate}
            </span>
           )}
        </div>

        {/* Done button */}
        <div>
            <button onClick={handleSubmit} style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#974FD0",
                 color: "#ffffff",
                 fontSize: "18px",
                 fontFamily: "Signika Negative",
                 fontWeight: "400",
                 border: "none",
                 borderRadius: "8px",
                 cursor: "pointer"
            }}>
               Done
            </button>
        </div>

    </div>

    {/* Back to the top */}

    <div style={{
        textAlign: "center",
        marginTop: "40px"
    }}>
        <span onClick={()=> window.scrollTo({top: 0, behavior: "smooth"})} style={{
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

export default NewTask