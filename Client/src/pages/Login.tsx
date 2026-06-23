// import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import TaskDutyLogo from "../assets/Task Duty Logo.svg"

const Login = () => {

    const navigate = useNavigate()
    const {setUser} = useAuth()
    

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState({
        email: "",
        password: ""
    })

    const [serverError, setServerError] = useState("")
    const [loading, setIsLoading] = useState(false)

    const validate = () =>{
        const newError = {email: "", password: ""}
        let isValid = true

        if (!formData.email.trim()) {
            newError.email = "Email is required"
            isValid = false
        } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
        newError.email = "Enter a valid email"
        isValid = false
      }

      if (!formData.password.trim()) {
        newError.password = "Password is required"
        isValid = false
      }

      setError(newError)
      return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () =>{
        if (!validate()) return
        setIsLoading(true)
        setServerError("")
        try {
            const user = await LoginUser({
                email: formData.email,
                password: formData.password
            })
            setUser(user)
            navigate("/tasks")
        } catch (error) {
            const err = error as any
            setServerError(err?.response?.data?.message || "Login failed, Try again")
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <div style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 70px)",
        overflow: "hidden"
    }}> 

    <div style={{
        flex: 1,
        backgroundColor: "#2D0050",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "40px"
    }}>
        <img src={TaskDutyLogo} alt="Task Duty Logo" style={{
            height: "80px",
            objectFit: "contain"
        }}/>
        <h1 style={{
            fontSize: "40px",
            fontWeight: "600",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.2"
        }}>
          Welcome Back!
        </h1>
        <p style={{
            fontSize: "18px",
            color: "#C9A0DC",
            textAlign: "center",
            lineHeight: "1.6",
            maxWidth: "300px"
        }}>
           Log in to manage your tasks
        </p>
    </div>

    <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        backgroundColor: "#ffffff"
    }}>

        <div style={{
            width: "100%",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
        }}>
            <div>
                <h2 style={{
                    fontSize: "32px",
                    fontWeight: "600",
                    color: "#292929",
                    marginBottom: "8px"
                }}>
                 Login
                </h2>
                <p style={{
                    fontSize: "16px",
                    color: "#737171",
                }}>
                Don't have an account?{" "}
                <Link to="/register" style={{
                    color: "#974FD0",
                    fontWeight: "500",
                    textDecoration: "none"
                }}>
                    Register Here
                </Link>
                </p>
            </div>

            {
                serverError &&(
                    <div style={{
                        padding: "12px 16px",
                        backgroundColor: "#FFE5E5",
                        borderRadius: "8px",
                        color:  "#D00000",
                        fontSize: "14px"
                    }}>
               {serverError}
                    </div>
                )}

                {/* Email */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                }}>
                    <fieldset style={{
                        border: error.email? "1px solid #D00000" : "1px solid #B8B6B6",
                        borderRadius: "8px",
                        padding: "0 16px 12px 16px"
                    }}>
                        <legend style={{
                            fontSize: "14px",
                            fontWeight: "500",
                             color: "#9C9C9C",
                             padding: "0 6px"
                        }}>
                       Email
                        </legend>
                       <input type="email" name="email" 
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="Enter your email"
                       style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "16px",
                         color: "#9C9C9C",
                         backgroundColor: "transparent" 
                       }}
                        />
                    </fieldset>
            {error.email &&(
                <span style={{
                    fontSize: "13px", color: "#D00000"
                }}>
                    {error.email}
                </span>
            )}
                </div>

                {/* Password */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
            }}>
                <fieldset style={{
                    border: error.password? "1px solid #D00000" : "1px solid #B8B6B6",
                    borderRadius: "8px",
                    padding: "0 16px 12px 16px"
                }}>
                    <legend style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#9C9C9C",
                        padding: "0 6px"
                    }}>
                   Password
                    </legend>
                   <input type="password" name="password"
                   value={formData.password}
                   onChange={handleChange}
                   placeholder="Enter your password"
                   style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#292929"
                   }}
                    />
                </fieldset>
                  {error.password &&(
                    <span style={{
                        fontSize: "13px",
                        color: "#D00000"
                    }}>
                     {error.password}
                    </span>
                  )}
            </div>

            {/* Login button */}

            <button onClick={handleSubmit} 
            disabled={loading}
            style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#C9A0DC" : "#974FD0",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
            }}
            >
            {loading ? "Logging in...": "Login"}

            </button>
        </div>

    </div>

    </div>
  )
}

export default Login