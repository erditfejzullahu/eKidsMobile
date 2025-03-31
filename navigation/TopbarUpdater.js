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
    const [showDiscussionSearcher, setShowDiscussionSearcher] = useState(false)

    const pathname = usePathname();
    
    useEffect(() => {
        if(pathname === '/all-messages'){
            setShowSearcher(true)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(false)
            setShowDiscussionSearcher(false)
        }else if(pathname.includes("/blogAll")){
            setShowSearcher(false);
            setShowBlogSearcher(true)
            setShowQuizOrCourseSharer(false)
            setShowDiscussionSearcher(false)
        }else if(pathname.includes("/quiz") || pathname.includes("/course")){
            setShowSearcher(false)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(true)
            setShowDiscussionSearcher(false)
        }else if(pathname.includes("discussion")){
            setShowDiscussionSearcher(true)
            setShowSearcher(false)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(false)
        }else{
            setShowSearcher(false)
            setShowBlogSearcher(false)
            setShowQuizOrCourseSharer(false)
            setShowDiscussionSearcher(false)
        }
            
    }, [pathname])
    
    return(
        <TopbarUpdaterContext.Provider value={{showDiscussionSearcher, showSearcher, showBlogSearcher, showQuizOrCourseSharer, shareOpened, setShareOpened}} >
            {children}
        </TopbarUpdaterContext.Provider>
    )
}

export default TopbarUpdaterProvider