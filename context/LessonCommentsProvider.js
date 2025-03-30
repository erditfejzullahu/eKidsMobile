import { useContext, createContext, useState } from "react";

const LessonCommentsContext = createContext();
export const useLessonCommentsContext = () => useContext(LessonCommentsContext);

const LessonCommentsProvider = ({children}) => {
    const [fireUpEndScroll, setFireUpEndScroll] = useState(false)
    const [hideHalfVideo, setHideHalfVideo] = useState(false)

    return (
        <LessonCommentsContext.Provider value={{fireUpEndScroll, setFireUpEndScroll, hideHalfVideo, setHideHalfVideo}}>
            {children}
        </LessonCommentsContext.Provider>
    )
}

export default LessonCommentsProvider;