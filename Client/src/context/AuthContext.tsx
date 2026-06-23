import { createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import { getMe, LogoutUser } from "../services/api";

interface User {
    id: string;
    name: string;
    email: string
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void
    logout: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children}: {children: ReactNode}) =>{
    const [user, setUser] = useState<User | null> (null)
    const [loading, setIsLoading] = useState<boolean>(true)

    useEffect(() =>{
        const getUser = async () =>{
            try {
                const data = await getMe()
                setUser(data)
            } catch (error) {
                setUser(null)
            }finally{
                setIsLoading(false)
            }
        }
    getUser()
    }, [])

    const logout = async()=>{
        try {
            await LogoutUser()
            setUser(null)
        } catch (error) {
            console.error("Logout Failed", error)
        }
    }

    return(
        <AuthContext.Provider value ={{user, loading, setUser, logout}}>
              {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>{
    const context = useContext(AuthContext)
    if (!context) throw new Error ("useAuth must be withing an AuthProvider")
        return context
}