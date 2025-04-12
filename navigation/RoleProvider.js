import { createContext, useContext, useEffect, useState } from "react";
import { getRole } from "../services/authService";

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({children}) => {
    const [role, setRole] = useState(null); // can be Admin, Student, Instructor

    useEffect(() => {
      const fetchRole = async () => {
        const actualRole = await getRole();
        setRole(actualRole)
      }
      fetchRole();
    }, [])
    
    return (
        <RoleContext.Provider value={{role}}>
            {children}
        </RoleContext.Provider>
    )
}