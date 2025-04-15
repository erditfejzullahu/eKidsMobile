import { createContext, useContext, useEffect, useState } from "react";
import { getRole } from "../services/authService";

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({children}) => {
    const [role, setRole] = useState(null); // can be Admin, Student, Instructor

    const fetchRole = async () => {
      console.log("U thiss fetch rolic")
      const actualRole = await getRole();
      setRole(actualRole)
    }

    useEffect(() => {
      fetchRole();
    }, [])
    
    return (
        <RoleContext.Provider value={{role, refreshRole: fetchRole}}>
            {children}
        </RoleContext.Provider>
    )
}