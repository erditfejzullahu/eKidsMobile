import {  createContext, useState, use } from "react";

const LessonCommentsContext = createContext();
export const useLessonCommentsContext = () => use(LessonCommentsContext);

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