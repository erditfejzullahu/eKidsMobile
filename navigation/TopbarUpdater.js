import { createContext, useContext } from "react";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { useState } from "react";

const TopbarUpdaterContext = createContext();
export const useTopbarUpdater = () => useContext(TopbarUpdaterContext);
const TopbarUpdaterProvider = ({children}) => {
    const [showSearcher, setShowSearcher] = useState(false)
    const [showBlogSearcher, setShowBlogSearcher] = useState(false)
    const pathname = usePathname();
    
    useEffect(() => {
        if(pathname === '/all-messages'){
            setShowSearcher(true)
            setShowBlogSearcher(false)
        }else if(pathname.includes("/blogAll")){
            setShowSearcher(false);
            setShowBlogSearcher(true)
        }else{
            setShowSearcher(false)
            setShowBlogSearcher(false)
        }
            
    }, [pathname])
    
    return(
        <TopbarUpdaterContext.Provider value={{showSearcher, showBlogSearcher}} >
            {children}
        </TopbarUpdaterContext.Provider>
    )
}

export default TopbarUpdaterProvider