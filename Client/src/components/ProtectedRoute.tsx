// import React from 'react'
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"


const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const {user, loading} = useAuth()

    if (loading) {
        return(
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                fontSize: "24px",
                color: "#974FD0"
            }}>
           Loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to ="/login" replace />
    }
  return<> {children} </>
}
export default ProtectedRoute