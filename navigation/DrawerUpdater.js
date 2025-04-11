import { useRouter, useSegments, usePathname } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { icons } from "../constants";
import { getUserCourseStatus } from "../services/fetchingService";
import { currentUserID } from "../services/authService";
const DrawerUpdaterContext = createContext();

export const useDrawerUpdater = () => useContext(DrawerUpdaterContext);

const defaultMenuItems = [
    { label: 'Profili im', icon: icons.profile, path: '/profile' },
    { label: 'Mesoni Online', icon: icons.parents, path: '/allOnlineClasses' },
    { label: 'Lajmetari', icon: icons.messenger, path: '/all-messages'},
    { label: 'Statistikat studentore', icon: icons.students, path: '/all-students' },
    { label: 'Shto një kuiz', icon: icons.plus, path: '/add-quiz' },
    { label: 'Kuizet e mia', icon: icons.quiz, path: '/my-quizzes'},
    { label: 'Statistikat e mia', icon: icons.statistics, path: '/statistics/1' },
    { label: 'Perfundo kuize', icon: icons.closure, path: '/all-quizzes' },
];

const DrawerUpdaterProvider = ({children}) => {
    const pathName = usePathname();
    useEffect(() => {
        if(pathName.includes('/categories/course/lesson/')){
            const courseIdFromUrl = pathName.split('/')[4];
            setCourseId(courseIdFromUrl);
        }else{
            setCourseId(null);
        }
    }, [pathName])
    
    const [drawerItemsUpdated, setDrawerItemsUpdated] = useState(false)
    const [courseId, setCourseId] = useState(null)
    const [drawerItems, setDrawerItems] = useState([

    ])
    const [loading, setLoading] = useState(false)
    
    const updateCourseData = (id) => {
        setCourseId(id);
    }

    useEffect(() => {
        if (courseId) {
            // console.log(courseId, '?? a ka');
            
            const fetchCourseLessons = async () => {
                try {
                    const userId = await currentUserID();
                    const response = await getUserCourseStatus(userId, courseId)
                    if (response.data) {
                        const lessonDrawerItems = response.data?.userProgress.map((item) => {
                            return{
                            label: item.progressLessonName,
                            icon: (!item.progressLessonCompleted && item.progressLessonStarted) ? icons.completedProgress : (item.progressLessonCompleted && item.progressLessonStarted) ? icons.completed : icons.lock,
                            path: `/categories/course/lesson/${item.progressLessonId}`
                            }
                        })               
                        setDrawerItems(lessonDrawerItems)
                        setDrawerItemsUpdated(true)
                    }
                } catch (error) {
                    setLoading(false)
                    console.error(error, 'at drawerupdater');
                } finally {
                    setLoading(false)
                }
            }
            fetchCourseLessons()
        } else {
            // console.log('????????asdasdasdasdasdasdasdasdasd');
            setDrawerItemsUpdated(false)
            setDrawerItems(defaultMenuItems)
            // setLoading(false);
        }
    }, [courseId])

    
    
    return(
        <DrawerUpdaterContext.Provider value={{drawerItems, updateCourseData, loading, drawerItemsUpdated}}>
            {children}
        </DrawerUpdaterContext.Provider>
    )
    
}

export default DrawerUpdaterProvider