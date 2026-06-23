// import React from 'react'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RegisterUser } from "../services/api"
import { useAuth } from "../context/AuthContext"
import TaskDutyLogo from "../assets/Task Duty Logo.svg"


const Register = () => {

    const navigate = useNavigate()
    const {setUser} = useAuth()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState<{
    name: string
    email: string
    password: string
    confirmPassword: string
}>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
})
    const [serverError, setServerError] = useState("")
    const [loading, setIsLoading] = useState(false)

    const validate = () =>{
        const newError = {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
        let isValid = true

        if (!formData.name.trim()) {
            newError.name = "Name is required"
            isValid = false
        }

        if (!formData.email.trim()) {
            newError.email = "Email is required"
            isValid = false
        }else if (!formData.email.includes("@") || !formData.email.includes(".")){
          newError.email = "Enter a valid email"
          isValid = false
        }

        if (!formData.password.trim()) {
            newError.password = "Password is required"
            isValid = false
        }else if(formData.password.length < 8){
          newError.password = "Password must be at least 8 characters "
          isValid = false 
        }

        if (!formData.confirmPassword.trim()) {
            newError.confirmPassword = "Please confirm your password"
            isValid = false
        } else if (formData.password !== formData.confirmPassword) {
            newError.confirmPassword = "Passwords do not match"
            isValid = false
        }

        setError(newError)
        return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({
            ...formData, [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async () =>{
        if(!validate()) return
        setIsLoading(true)
        setServerError("")

        try {
            const user = await RegisterUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            setUser(user)
            navigate("/tasks")
        } catch (err) {
            const error = err as any
            setServerError (error?.response.data.message || "Registration failed. Try again.")
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div style={{
        display: "flex",
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
            }} />

            <h1 style={{
                fontSize: "40px",
                fontWeight: "600",
                color: "#ffffff",
                textAlign: "center",
                lineHeight: "1.2"
            }}>
                 Get Started
            </h1>

            <p style={{
                fontSize: "18px",
                color: "#C9A0DC",
                textAlign: "center",
                lineHeight: "1.6",
                maxWidth: "300px"
            }}>
              Create an account to start managing your tasks.
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
                gap: "20px"
            }}>
                
                <div>
                    <h2 style={{
                        fontSize: "32px",
                        fontWeight: "600",
                        color: "#292929",
                        marginBottom: "8px"
                    }}>
                      Create Account
                    </h2>

                    <p style={{
                        fontSize: "16px",
                        color: "#737171",
                    }}>
                 Already have an account?{" "}
                 <Link to ="/login" style={{
                    color: "#974FD0",
                    fontWeight: "500",
                    textDecoration: "none"
                 }}>
                    Login Here
                 </Link>
                    </p>
                </div>

                {
                    serverError && (
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#FFE5E5",
                            borderRadius: "8px",
                            color: "#D00000",
                            fontSize: "14px"
                        }}>
                        {serverError}
                        </div>
                    )}

            {/* Name */}

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
            }}>

                <fieldset style={{
                    border: error.name ? "1px solid #D00000" : "1px solid #B8B6B6",
                    borderRadius: "8px",
                    padding: "0 16px 12px 16px",
                }}>
                    <legend style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#9C9C9C",
                        padding: "0 6px"
                    }}>
                             Full Name
                    </legend>
                    <input type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your fullname"
                    style={{
                         width: "100%",
                         border: "none",
                         outline: "none",
                         fontSize: "16px",
                         color: "#292929",
                         backgroundColor: "transparent",
                    }}
                     />
                </fieldset>
                {error.name && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{error.name}</span>
                        )}
            </div>

            {/* Email section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <fieldset style={{
                    border: error.email ? "1px solid #D00000" : "1px solid #B8B6B6",
                    borderRadius: "8px",
                    padding: "0 16px 12px 16px",
                }}>
                    <legend style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#9C9C9C",
                        padding: "0 6px",
                    }}>
                        Email
                    </legend>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                         style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            fontSize: "16px",
                            color: "#292929",
                            backgroundColor: "transparent",
                        }}
                    />
                </fieldset>
                {error.email && (
                    <span style={{ fontSize: "13px", color: "#D00000" }}>{error.email}</span>
                )}
            </div>

            {/* Password field */}
             <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: error.password ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                Password
                            </legend>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 8 characters"
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "16px",
                                    color: "#292929",
                                    backgroundColor: "transparent",
                                }}
                            />
                        </fieldset>
                        {error.password && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{error.password}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    {/* Confirm Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: error.confirmPassword ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                Confirm Password
                            </legend>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "16px",
                                    color: "#292929",
                                    backgroundColor: "transparent",
                                }}
                            />
                        </fieldset>
                        {error.confirmPassword && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{error.confirmPassword}</span>
                        )}
                    </div>

                    {/* Register Button */}
                
                  <button
                        onClick={handleSubmit}
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
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
            </div>

        </div>

    </div>
  )
}

export default Register