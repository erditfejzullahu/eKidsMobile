import apiClient from "./apiClient";
import { currentUserID } from "./authService";

export const fetchCourses = async (filters) => {
    try {        
        const queryParams = {}
        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })
        const queryString = new URLSearchParams(queryParams).toString()
        console.log(queryString);
        
        const response = await apiClient.get(`/getCoursesP?${queryString}`)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getMetaValue = (metaDataArray, metaKey) => {
    if(metaDataArray){
        const meta = metaDataArray.find(item => item.metaKey === metaKey);
        return meta ? meta.metaValue : null;
    }
};

export const getCourseCategories = (categories, categoryID) => {  

    if(!Array.isArray(categories)){
        return categories?.categoryName
    }

    if(categories && categoryID){
        const getCategory = categories.find(item => item?.CategoryID === categoryID)
        return getCategory ? getCategory.categoryName : null;
    }
}

export const fetchCategories = async (filters) => {
    try {
        const queryParams = {}

        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })

        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/getCategories?${queryString}`)
        // console.log(response.data, 'asd??');
        
        return response ? response.data : null
    } catch (error) {
        return null;
        // console.error(error);
    }
}

export const fetchCategory = async (filters) => {
    try {
        const queryParams = {}
        
        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/getCoursesP?${queryString}`)
        console.log(response.data);
        
        return response ? response.data : null
    } catch (error) {
        return null;
        // console.error(error);
        
    }
}

export const fetchCourse = async (id) => {
    try {
        const response = await apiClient.get(`/api/Courses/${id}`)
        // console.log(response.data);
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        
    }
}

export const getUserCourseStatus = async (userId, courseId) => {
    try {
        // console.log(userId);
        
        const response = await apiClient.get(`/api/UserProgress/${courseId}/${userId}`)
        return response ? response : null
    } catch (error) {
        // console.error(error.response.data.message);
        return false;
    }
}

export const updateUserLessonStatus = async (data) => {
    try {
        const response = await apiClient.patch(`/api/UserProgress`, data)
        return response ? response.status : null
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const startCourseProgress = async (userId, courseId, lessonId) => {
    try {
        const response = await apiClient.post(`/api/UserProgress`, {
            "courseId": courseId,
            "userId": userId,
            "lessonId": lessonId,
        })
        
        return response ? response.data : null
    } catch (error) {
        console.error(error.response.data);
    }
}

export const updateCourseLessonCompletation = async (userId, courseId, lessonId) => {
    try {
        const response = await apiClient.post(`/api/UserProgress`, {
            "courseId": courseId,
            "userId": userId,
            "lessonId": lessonId,
            "hasStarted": true,
            "isCompleted": true 
        })
        // console.log(response);
        
        return response ? response.data : null
    } catch (error) {
        console.error(error.response.data);
    }
}

export const userActualProgresses = async (userId) => {
    try {
        const response = await apiClient.get(`/api/UserProgresses/${userId}`)
        return response? response.data : null
    } catch (error) {
        console.error(error);
    }
}

export const getBookmarks = async () => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/Bookmarks/GetAll/${userId}`)
        return response ? response.data : null
    } catch (error) {
        console.error(error);
    }
}

export const makeBookmark = async (userId, courseId, lessonId) => {
    try {
        
        const response = await apiClient.post(`/api/Bookmark`, {
            "userId": userId,
            "courseId": courseId,
            "lessonId": lessonId
        })        
        return response ? response.data : null
    } catch (error) {
        console.error(error.message, 'makebook');
        
    }
}

export const deleteBookmark = async (userId, courseId, lessonId) => {
    
    try {
        const response = await (courseId === null
            ? apiClient.delete(`/api/Bookmark/${userId}?&lessonId=${lessonId}`)
            : apiClient.delete(`/api/Bookmark/${userId}?courseId=${courseId}`)
        )
        return response ? response.data : null
    } catch (error) {
        console.error(error.response.message);
        
    }
}

export const deleteBookmarkById = async (id) => {
    try {
        const response = await apiClient.delete(`/api/Bookmark/DeleteById/${id}`)
        return response ? response.status : false; 
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const bookmarkStatus = async (userId, courseId, lessonId) => {
    try {
        const response = await (courseId === null
            ? apiClient.get(`/api/Bookmark/${userId}?&lessonId=${lessonId}`)
            : apiClient.get(`/api/Bookmark/${userId}?courseId=${courseId}`)
        )
                
        return response ? response : false
    } catch (error) {
        return error.response;
    }
}


export const fetchLesson = async (lessonId) => {
    const userId = await currentUserID();
    try {
        const response = await apiClient.get(`/api/Lessons/${lessonId}?userId=${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}


export const getLessonComments = async (id, type) => {
    const userId = await currentUserID();
    try {
        const response = await apiClient.get(`/api/Comments/GetAll/${id}?type=${type}&userId=${userId}`)
        
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}

export const reqCreateComment = async (userId, lessonId, commentValue) => {
    try {
        const response = await apiClient.post(`/api/Comments`, {
            "lessonId": lessonId,
            "userId": userId,
            "comment_Content": commentValue
        })
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const reqCreateReply = async (userId, lessonId, parentId, commentValue ) => {
    try {
        const response = await apiClient.post(`/api/Comments`, {
            "lessonId": lessonId,
            "userId": userId,
            "comment_Content": commentValue,
            "parentId": parentId
        })
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        return null
    }
}

export const reqCreateLike = async (commentId, userId) => {
    try {
        const response = await apiClient.patch(`/api/Comments/Like/${commentId}?userId=${userId}`)
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const reqCreateLessonLike = async (lessonId, userId) => {
    try {
        const response = await apiClient.patch(`/api/Lessons/UpdateLike/${lessonId}?userId=${userId}`)
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const updateUserDetails = async (userId, type, data) => {
    try {
        const response = await apiClient.put(`/api/Users/${userId}?type=${type}`, data)
        
        return response ? response.status : null
    } catch (error) {
        console.error(error);
    }
}

export const updateProfilePicture = async (userId, base64Data) => {
    try {
        const response = await apiClient.put(`/api/Users/${userId}/profile-picture`, base64Data)
        console.log(response.data);
        
        return response ? response.status : null
    } catch (error) {
        console.error(error);
    }
}

export const getCompletedLessons = async () => {
    const userId = await currentUserID()
    try {
        const response = await apiClient.get(`/api/CourseCompleted?userId=${userId}`)
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getCompletedCourseDetails = async (courseId) => {
    const userId = await currentUserID();
    try {
        const response = await apiClient.get(`/api/CourseCompleted/${courseId}/${userId}`)
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const reqCreateQuiz = async (quizPayload) => {
    try {
        const response = await apiClient.post(`/api/Quizzes`, quizPayload)
        return response ? response.status : null;
    } catch (error) {
        console.error(error);
        return null
    }
}

export const getAllQuizzes = async (filters) => {
    try {
        const queryParams = {}

        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })

        const queryString = new URLSearchParams(queryParams).toString();
        console.log(queryString);
        
        const response = await apiClient.get(`/api/Quizzes/GetAll?${queryString}`)
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getQuizById = async (id) => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/Quizzes/${id}?userId=${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}

export const getAllQuizzesByUser = async (filters) => {
    try {
        const userId = await currentUserID();
        const queryParams = {}

        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })

        // if(filters.SortByName) queryParams.SortByName = filters.SortByName;
        // if(filters.categoryId) queryParams.categoryId = filters.categoryId;

        const queryString = new URLSearchParams(queryParams).toString();
        console.log(queryString);
        
        const response = await apiClient.get(`/api/Quizzes/GetByUser/${userId}?${queryString}`)
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/api/Users/allUsers')
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchAllComments = async (sender, receiver, filters) => {
    try {
        const queryParams = {}
        if(filters.page) queryParams.page = filters.page;
        if(filters.pageSize) queryParams.pageSize = filters.pageSize;

        const queryString = new URLSearchParams(queryParams).toString();
        console.log(queryString);
        
        const response = await apiClient.get(`/api/Conversations/${sender}/${receiver}?${queryString}`)
        return response ? response.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getQuizzesCount = async (userId) => {
    try {
        const response = await apiClient.get(`/api/Quizzes/CountQuizzes/${userId}`)
        return response ? response.data : null
    } catch (error) {
        console.error(error);
        return null
    }
}

export const reqCreateMistake = async (data) => {
    try {
        const response = await apiClient.patch(`/api/QuizzesCompleted/UpdateQuizMistakes/`, data)
        return response ? response.status : null
    } catch (error) {
        console.error(error);
        return null
    }
}

export const reqStartQuizCompletation = async (data) => {
    try {
        const response = await apiClient.post(`/api/QuizCompletation/`, data)
        return response ? response.status : null
    } catch (error) {
        return error.response.status
    }
}

export const reqQuizCompleted = async (data) => {
    try {
        const response = await apiClient.patch(`/api/QuizCompletation/`, data)
        return response ? response.status : null
    } catch (error) {
        console.error(error.response.data);
        return error.response.status;
    }
}

export const getUserQuizzesCreated = async (userId) => {
    try {
        const response = await apiClient.get(`/api/Quizzes/UserQuizInfo/${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const reqGetStatusQuiz = async (quizId) => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/QuizzesCompletation/GetStatusQuizz/${userId}/${quizId}`)
        return response ? response.data : null
    } catch (error) {
        console.error(error, ' asd');
        return null;
    }
}

export const increaseViewCount = async (id, postType) => {
    try {
        const response = await apiClient.post(`/api/Count/increment/${id}?postType=${postType}`)
        return response ? response.status : null
    } catch (error) {
        console.error(error);
        return null;
    }
}