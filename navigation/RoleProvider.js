import { createContext, use, useEffect, useState } from "react";
import { getRole } from "../services/authService";

const RoleContext = createContext();

export const useRole = () => use(RoleContext);

export const RoleProvider = ({children}) => {
    const [role, setRole] = useState(null); // can be Admin, Student, Instructor
    const [isLoading, setIsLoading] = useState(false)

    const fetchRole = async () => {
      setIsLoading(true)
      const actualRole = await getRole();
      setRole(actualRole)
      setIsLoading(false)
    }

    useEffect(() => {
      fetchRole();
    }, [])
    
    return (
        <RoleContext.Provider value={{role, refreshRole: fetchRole, isLoading}}>
            {children}
        </RoleContext.Provider>
    )
}