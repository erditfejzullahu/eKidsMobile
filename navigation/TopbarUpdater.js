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
    const [showInstructorCourseSharer, setShowInstructorCourseSharer] = useState(false)
    const [showInstructorSharer, setShowInstructorSharer] = useState(false)
    const [showOnlineMeetingSharer, setShowOnlineMeetingSharer] = useState(false)

    const [discussionSection, setDiscussionSection] = useState(false)

    const pathname = usePathname();
    
    useEffect(() => {
        setDiscussionSection(pathname.includes("discussions"));

        const pathCheck = {
            messages: pathname === "/all-messages",
            blog: pathname.includes("/blogAll"),
            quizOrCourse: pathname.includes('/quiz') || pathname.includes("/course"),
            discussion: pathname.includes('discussion'),
            instructorCourse: pathname.includes('/onlineClass/'),
            instructor: pathname.includes('/tutor/'),
            onlineMeeting: pathname.includes('/meetings/')
        }

        setShowSearcher(pathCheck.messages)
        setShowBlogSearcher(pathCheck.blog)
        setShowQuizOrCourseSharer(pathCheck.quizOrCourse)
        setShowInstructorCourseSharer(pathCheck.instructorCourse)
        setShowDiscussionSearcher(pathCheck.discussion)
        setShowInstructorSharer(pathCheck.instructor)
        setShowOnlineMeetingSharer(pathCheck.onlineMeeting)
            
    }, [pathname])
    
    return(
        <TopbarUpdaterContext.Provider value={{discussionSection, showInstructorCourseSharer, showInstructorSharer, showOnlineMeetingSharer, showDiscussionSearcher, showSearcher, showBlogSearcher, showQuizOrCourseSharer, shareOpened, setShareOpened}} >
            {children}
        </TopbarUpdaterContext.Provider>
    )
}

export default TopbarUpdaterProvider