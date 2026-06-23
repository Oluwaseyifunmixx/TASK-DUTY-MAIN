import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import arrowLogo from "../assets/Vector (1).svg"
import { updateProfile } from "../services/api"

const Profile = () => {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()

    const [formData, setFormData] = useState({
        name: user?.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [successMessage, setSuccessMessage] = useState("")
    const [serverError, setServerError] = useState("")
    const [loading, setLoading] = useState(false)

    // Password strength checker
    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { label: "", color: "", width: "0%" }
        if (password.length < 6) return { label: "Weak", color: "#D00000", width: "25%" }
        if (password.length < 8) return { label: "Fair", color: "#FFA500", width: "50%" }
        if (password.length < 12) return { label: "Good", color: "#974FD0", width: "75%" }
        return { label: "Strong", color: "#1A7A30", width: "100%" }
    }

    const strength = getPasswordStrength(formData.newPassword)

    // Generate initials avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const validate = () => {
        const newErrors = {
            name: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
        let isValid = true

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
            isValid = false
        }

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = "Current password is required to set a new one"
                isValid = false
            }
            if (formData.newPassword.length < 8) {
                newErrors.newPassword = "New password must be at least 8 characters"
                isValid = false
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
                isValid = false
            }
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setLoading(true)
        setServerError("")
        setSuccessMessage("")
        try {
            const updatedUser = await updateProfile({
                name: formData.name,
                currentPassword: formData.currentPassword || undefined,
                newPassword: formData.newPassword || undefined
            })
            setUser(updatedUser)
            setSuccessMessage("Profile updated successfully")
            setFormData(prev =>({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }))
        } catch (error) {
            const err = error as any
            setServerError(err?.response?.data?.message || "Update failed. Try again.")
        } finally {
            setLoading(false)
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
                    marginBottom: "40px",
                }}>
                    <img
                        src={arrowLogo}
                        alt="back"
                        onClick={() => navigate("/tasks")}
                        style={{ width: "32px", height: "32px", cursor: "pointer" }}
                    />
                    <h1 style={{
                        fontSize: "50px",
                        fontWeight: "500",
                        color: "#292929",
                    }}>
                        My Profile
                    </h1>
                </div>

                {/* my avatar profile + user info */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    marginBottom: "40px",
                    padding: "24px",
                    border: "0.5px solid #B8B6B6",
                    borderRadius: "12px",
                }}>
                    {/* Initials avatar */}
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#2D0050",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        fontWeight: "600",
                        flexShrink: 0,
                    }}>
                        {getInitials(user?.name || "U")}
                    </div>

                    <div>
                        <h2 style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            color: "#292929",
                            marginBottom: "4px",
                        }}>
                            {user?.name}
                        </h2>
                        <p style={{
                            fontSize: "16px",
                            color: "#737171",
                        }}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    maxWidth: "100%",
                }}>

                    {successMessage && (
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#E5FFE9",
                            borderRadius: "8px",
                            color: "#1A7A30",
                            fontSize: "14px",
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {serverError && (
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#FFE5E5",
                            borderRadius: "8px",
                            color: "#D00000",
                            fontSize: "14px",
                        }}>
                            {serverError}
                        </div>
                    )}

                    {/* Name */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: errors.name ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                Full Name
                            </legend>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
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
                        {errors.name && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{errors.name}</span>
                        )}
                    </div>

                    {/* Current Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: errors.currentPassword ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                Current Password
                            </legend>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
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
                        {errors.currentPassword && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{errors.currentPassword}</span>
                        )}
                    </div>

                    {/* New Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: errors.newPassword ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                New Password
                            </legend>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
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
                        {errors.newPassword && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{errors.newPassword}</span>
                        )}

                        {/* Password strength indicator */}
                        {formData.newPassword && (
                            <div style={{ marginTop: "4px" }}>
                                <div style={{
                                    height: "6px",
                                    backgroundColor: "#f0f0f0",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: strength.width,
                                        backgroundColor: strength.color,
                                        borderRadius: "3px",
                                        transition: "width 0.3s, background-color 0.3s",
                                    }} />
                                </div>
                                <span style={{
                                    fontSize: "12px",
                                    color: strength.color,
                                    fontWeight: "500",
                                    marginTop: "4px",
                                    display: "block",
                                }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <fieldset style={{
                            border: errors.confirmPassword ? "1px solid #D00000" : "1px solid #B8B6B6",
                            borderRadius: "8px",
                            padding: "0 16px 12px 16px",
                        }}>
                            <legend style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#9C9C9C",
                                padding: "0 6px",
                            }}>
                                Confirm New Password
                            </legend>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter new password"
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
                        {errors.confirmPassword && (
                            <span style={{ fontSize: "13px", color: "#D00000" }}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Save button */}
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
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Profile