import { createContext, useContext } from "react";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { useState } from "react";

const TopbarUpdaterContext = createContext();
export const useTopbarUpdater = () => useContext(TopbarUpdaterContext);
const TopbarUpdaterProvider = ({children}) => {
    const [showSearcher, setShowSearcher] = useState(false)
    const [showBlogSearcher, setShowBlogSearcher] = useState(false)
    const [showQuizOrCourseSharer, setShowQuizOrCourseSharer] = useState(false)
    const [shareOpened, setShareOpened] = useState(false)

    const pathname = usePathname();
    
    useEffect(() => {
        if(pathname === '/all-messages'){
            setShowSearcher(true)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(false)
        }else if(pathname.includes("/blogAll")){
            setShowSearcher(false);
            setShowBlogSearcher(true)
            setShowQuizOrCourseSharer(false)
        }else if(pathname.includes("/quiz") || pathname.includes("/course") || pathname.includes("/all-quizzes") || pathname.includes("/my-quizzes")){
            setShowSearcher(false)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(true)
        }else{
            setShowSearcher(false)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(false)
        }
            
    }, [pathname])
    
    return(
        <TopbarUpdaterContext.Provider value={{showSearcher, showBlogSearcher, showQuizOrCourseSharer, shareOpened, setShareOpened}} >
            {children}
        </TopbarUpdaterContext.Provider>
    )
}

export default TopbarUpdaterProvider