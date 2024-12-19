import { createContext, useContext, useState, useEffect } from 'react'
import { userDetails } from '../services/necessaryDetails';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true); // Set loading to true before fetching
            try {
                const res = await userDetails();
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserDetails(); // Call the async function
    }, []);
    

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalProvider;