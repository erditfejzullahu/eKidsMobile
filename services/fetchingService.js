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
        return null;
    }
}

export const getBookmarks = async () => {
    try {
        const response = await apiClient.get(`/api/Bookmarks/GetAll/`)
        return response ? response.data : null
    } catch (error) {
        return null;
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
    try {
        const response = await apiClient.get(`/api/Lessons/${lessonId}`)
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

export const reqCreateLessonLike = async (lessonId) => {
    try {
        const response = await apiClient.patch(`/api/Lessons/UpdateLike/${lessonId}`)
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
        // console.error(error);
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
        console.log(queryString, ' quizzes');
        
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
        if(filters.pageNumber) queryParams.pageNumber = filters.pageNumber;
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
        // const userId = await currentUserID();
        const response = await apiClient.get(`/api/QuizzesCompletation/GetStatusQuizz/${quizId}`)
        return response ? response.data : null
    } catch (error) {
        // console.error(error, ' asd');
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

export const deleteQuizz = async (id) => {
    try {
        const response = await apiClient.delete(`/api/Quizzes/${id}`)        
        return response ? response.status : null;
    } catch (error) {
        console.error(error);
        return error.response.status
    }
}

export const getCompletedQuizzesByUser = async (userId) => {
    try {
        const response = await apiClient.get(`/api/QuizzesCompleted/GetByUser/${userId}`)
        return response ? response.data : null
    } catch (error) {
        // console.error(error);
        return null;
    }
}

export const getNotifications = async (paginationDto) => {
    try {
        const response = await apiClient.get(`/api/Notifications/`, {
            params: paginationDto
        })
        return response ? response.data : null;
    } catch (error) {
        return null;
    }
}

export const reqMakeNotificationsRead = async () => {
    try {
        const response = await apiClient.get(`/api/Notifications/MakeReadNotifications`)
        return response ? response.status : null;
    } catch (error) {
        console.error(error, ' notifread');
        return null;
    }
}

export const reqGetAllUserTypes = async (userId, types, searchParam = "") => {
    try {
        // const queryParams = {}
        // Object.keys(filters).forEach((key) => {
        //     if(filters[key]){
        //         queryParams[key] = filters[key]
        //     }
        // })
        // const queryString = new URLSearchParams(queryParams).toString();    
        const response = await apiClient.get(`/api/UserFriends/GetAllByUser/${userId}?types=${types}&searchParam=${searchParam}`)   //types; 1 for all, 2 for friends, 3 for closefriends
        return response ? response.data : null
    } catch (error) {
        // console.error(error, 'usertypes');
        return null;
    }
}

export const reqDeleteNotification = async (id) => {
    try {
        const response = await apiClient.delete(`/api/Notifications/${id}`)
        return response && response.status;
    } catch (error) {
        console.error(error);
        return error.response.status;
    }
}

export const reqUsersBySearch = async (paramText) => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/UserFriends/SearchUsers?userId=${userId}&searchParam=${paramText}`)
        return response ? response.data : []
    } catch (error) {
        console.log(error);
        return []
    }
}

export const getUserProfile = async (id) => {
    try {
        const response = await apiClient.get(`/api/Users/GetUserById/${id}`)        
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}

export const getUserRelationStatus = async (senderId, receiverId) => {    
    try {
        const response = await apiClient.get(`/api/UserFriends/GetUserRelationStatus?SenderId=${senderId}&ReceiverId=${parseInt(receiverId)}`)
        if(response.data){
            return response.data
        }
    } catch (error) {        
        console.log(error);
    }
    try {
        const reverseResponse = await apiClient.get(`/api/UserFriends/GetUserRelationStatus?SenderId=${parseInt(receiverId)}&ReceiverId=${senderId}`)        
        if(reverseResponse.data){
            return reverseResponse.data
        }
    } catch (error) {
        console.log(error);
    }

    return null;
}

export const makeUserFriendReq = async (data) => {
    try {
        const response = await apiClient.post(`/api/Notifications/UserFriendReq`, data)
        return response ? response.status : null
    } catch (error) {
        console.error(error.response.data);
        return null;
    }
}

export const removeFriendReq = async (friendId) => {
    try {
        const response = await apiClient.delete(`/api/UserFriends/DeleteFriend?friendId=${friendId}`)
        return response && response.status;
    } catch (error) {
        return error.response.status;
    }
}

export const removeFriendRequestReq = async (receiverId) => {
    try {
        const response = await apiClient.delete(`/api/UserFriends/DeleteFriendRequest?receiverId=${receiverId}`);
        return response && response.status;
    } catch (error) {
        return error.response.status;
    }
}

export const getAllTagsByCategory = async (categoryId) => {
    try {
        const response = await apiClient.get(`/api/Blogs/GetAllTags/${categoryId}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const getAllBlogTags = async (searchParam) => {
    try {
        const response = await apiClient.get(`/api/Blogs/GetAllBlogTags?searchParam=${!searchParam ? "" : searchParam}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const getAllBlogsByTag = async (tagId, pagination, forYouOrFriends) => {        
    try {
        let queryParams = {}
        if(pagination.pageNumber) queryParams.pageNumber = pagination.pageNumber;
        if(pagination.pageSize) queryParams.pageSize = pagination.pageSize;
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/api/Blogs/GetAllBlogsByTag/${tagId}&friendsBlogsOrAll=${forYouOrFriends}?${queryString}`)
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}

export const getAllBlogs = async (pagination, forYouOrFriends) => {
    try {
        let queryParams = {}
        if (pagination.pageNumber) queryParams.pageNumber = pagination.pageNumber
        if (pagination.pageSize) queryParams.pageSize = pagination.pageSize
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/api/Blogs/GetAllBlogs?${queryString}&friendsBlogsOrAll=${forYouOrFriends}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const deleteBlog = async (id) => {
    try {
        const response = await apiClient.delete(`/api/Blogs/${id}`)
        return response && response.status;
    } catch (error) {
        return error.response.status
    }
}

export const getBlogById = async (blogId, userId) => {
    try {
        const response = await apiClient.get(`/api/Blogs/GetBlogById/${blogId}/${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null;
    }
} 

export const reqCreatePost = async (payload) => {
    // console.log(payload);
    
    try {
        const response = await apiClient.post(`/api/Blog`, payload)
        return response ? response.data : null
    } catch (error) {
        console.log(error.response.data)
        return null
    }
}

export const getCommentsByBlog = async (blogId, fullBlogComments, pagination) => {
    
    try {
        let queryParams = {};
        if(!fullBlogComments){
            if(pagination.pageNumber) queryParams.pageNumber = pagination.pageNumber;
            if(pagination.pageSize) queryParams.pageSize = pagination.pageSize;
        }

        const queryString = new URLSearchParams(queryParams).toString();
        
        const response = await apiClient.get(`/api/Blogs/GetCommentsByBlog/${blogId}?fullBlogComments=${fullBlogComments}&${queryString}`)
        return response ? response.data : null
    } catch (error) {
        console.log(error);
        
        return null
    }
}

export const createBlogComment = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Blogs/CreateComment`, payload)
        return response ? response.status : null
    } catch (error) {
        return error.response.status
    }
}

export const reqLikeBlog = async (blogId, userId) => {
    console.log("blogId ", blogId);
    console.log("userId ", userId);
    try {
        const response = await apiClient.post(`/api/Blogs/LikeBlog?blogId=${blogId}&userId=${userId}`)        
        return response && response.data
    } catch (error) {
        return error.response.status
    }
}

export const reqLikeBlogComment = async (blogCommentId, blogId) => {
    try {
        const response = await apiClient.post(`/api/Blogs/LikeComment?blogCommentId=${blogCommentId}&blogId=${blogId}`)
        return response && response.data
    } catch (error) {
        return error.response.status
    }
}

export const reqUpdateUserInformation = async (payload) => {
    try {
        
        const response = await apiClient.post(`/api/userInformation`, payload)
        return response && response.status
    } catch (error) {        
        return error.response.status
    }
}

export const getUserOtherInformations = async (userId) => {
    try {
        const response = await apiClient.get(`/api/UserInformation?userId=${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const updateUserOtherInformations = async (informationId, payload) => {
    try {
        const response = await apiClient.patch(`/api/UserInformation/${informationId}`, payload)
        return response && response.status
    } catch (error) {
        return error.response.status
    }
}

export const getBlogByTitle = async (title) => {
    
    try {
        const response = await apiClient.get(`/api/Blogs/GetByName?title=${title}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const acceptFriendRequest = async (senderId) => {
    try {
        const response = await apiClient.put(`/api/UserFriends/AcceptFriendRequest?senderId=${senderId}`)
        return response && response.status;
    } catch (error) {
        return error.response.status
    }
}

export const getUserCommits = async (userId) => {
    try {
        const response = await apiClient.get(`/api/Users/GetCommitments/${userId}`)
        return response ? response.data : null
    } catch (error) {
        return null;
    }
}

export const getAllUsersStatstics = async (searchInput) => {
    try {
        const response = await apiClient.get(`/api/Users/GetAllUsersStatistics?searchParam=${searchInput}`)
        return response ? response.data : null
    } catch (error) {
        return null
    }
}

export const reqShareToUser = async (shareType, payload) => {
    try {
        const response = await apiClient.post(`/api/Conversations/ShareToUser?shareType=${shareType}`, payload)
        return response && response.status;
    } catch (error) {
        return error.response.status;
    }
}

export const reqReadMessages = async (sender, receiver) => {
    try {
        const response = await apiClient.patch(`/api/Conversations/ReadMessages/${sender}/${receiver}`)
        return response && response.status
    } catch (error) {
        return error.response.status;
    }
}

export const createDiscussion = async (payload) => {
    try {
        const response = await apiClient.post("/api/Discussions", payload)
        return response && response.status;
    } catch (error) {
        console.error(error.response.errors);
        
        return error.response.status;
    }
}

export const getTagsByTitle = async (title) => {
    console.log(!title);
    
    try {
        const response = await apiClient.get(`/api/Discussions/TypingTags?title=${!title ? "" : title}`)
        return response && response.data;
    } catch (error) {
        return null
    }
}

export const getDiscussionsByTitle = async (title) => {
    try {
        const response = await apiClient.get(`/api/Discussions/GetDiscussionByTitle?searchParam=${title}`)
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const getDiscussions = async (sortBy, paginationData, tagId) => {
    try {
        console.log(sortBy);
        
        const response = await apiClient.get(`/api/Discussions?SortBy=${sortBy}&tagId=${!tagId ? "" : tagId}&pageSize=${paginationData.pageSize}&pageNumber=${paginationData.pageNumber}`)
        return response && response.data
    } catch (error) {
        return null;
    }
}

export const getUserCreatedBlogsOrDiscussions = async (type, userId) => {
    try {
        let response;
        if(type === "blogs"){
            response = await apiClient.get(`/api/Blogs/GetAllBlogsByUser/${userId}`)
        }else if (type === "discussions"){
            response = await apiClient.get(`/api/Discussions/GetAllDiscussionsByUser/${userId}`)
        }
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const getDiscussionById = async (id) => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/Discussions/${id}?userId=${userId}`)
        return response && response.data
    } catch (error) {
        return null;
    }
}

export const handleDiscussionVoteFunc = async (payload) => {
    try {
        // const userId = await currentUserID();
        const response = await apiClient.patch(`/api/Discussions/HandleDiscussionVotes`, payload)
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const handleDiscussionAnswerVoteFunc = async (payload) => {
    try {
        // const userId = await currentUserID();
        const response = await apiClient.patch(`/api/Discussions/HandleAnswerVotes`, payload);
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const createDiscussionAnswerAsync = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Discussions/CreateDiscussionAnswer`, payload)
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const getDiscussionsAnswers = async (id) => {
    try {
        const userId = await currentUserID();
        const response = await apiClient.get(`/api/Discussions/GetDiscussionComments/${id}?userId=${userId}`)
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const becomeInstructor = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Instructors/BecomeInstructor`, payload)
        return response && response.status;
    } catch (error) {
        return null;
    }
}

export const getInstructor = async (id) => {
    try {
        const response = await apiClient.get(`/api/Instructors`)
        console.log(response.data, ' dataA??');
        
        return response && response.data
    } catch (error) {
        console.error(error.response.data);
        
        return null;
    }
}

export const InstructorCreateCourse = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Instructors/CreateCourse`, payload)
        if(response.status === 200){
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.response.data)
        return false;
    }
}

export const GetInstructorsCourses = async (filters) => {
    try {
        const queryParams = {}

        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key];
            }
        })

        const queryString = new URLSearchParams(queryParams).toString();

        const response = await apiClient.get(`/api/Instructors/GetInstructorsCourses?${queryString}`)
        return response && response.data;
    } catch (error) {
        return null;
    }
}
 
export const InstructorCreatedCourses = async () => {
    try {
        const response = await apiClient.get('/api/Instructors/GetInstructorCoursesForMeetingAdd')
        return response && response.data;
    } catch (error) {
        return null;
    }
}

export const InstructorCreatedCoursesById = async (instructorId) => {
    try {
        const response = await apiClient.get(`/api/Instructors/GetInstructorCoursesCreatedById/${instructorId}`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data);
        return [];
    }
}

export const InstructorCreateOnlineMeeting = async (payload) => {
    console.log(payload, " payload")
    try {
        const response = await apiClient.post(`/api/OnlineMeetings/CreateMeeting`, payload)
        return response && true;
    } catch (error) {
        console.log(error.response.data)
        return false;
    }
}

export const InstructorLessonsBasedOfCourse = async (courseId) => {
    try {
        const response = await apiClient.get(`/api/Instructors/GetInstructorLessonsBasedOfCoursesMeetingAdd?courseId=${courseId}`)
        return response && response.data;
    } catch (error) {
        console.log(error.response.data)
        return [];
    }
}

export const GetInstructorManageTypeData = async (manageType, filterData) => {
    try {
        const response = await apiClient.get(`/api/Instructors/GetInstructorManageContentData?manageType=${manageType}`, {
            params: filterData
        })
        console.log(response.config.url)
        return response && response.data
    } catch (error) {
        console.error(error.response.data);
        return [];
    }
}

export const GetAllMeetings = async (filters) => {
    try {
        const queryParams = {}

        Object.keys(filters).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key]
            }
        })

        const queryString = new URLSearchParams(queryParams).toString();
        console.log(queryString, ' string');
        
        const response = await apiClient.get(`/api/OnlineMeetings/AllMeetings?${queryString}`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data)
        return []
    }
}

export const GetInstructorsUserProfileProgresses = async () => {
    try {
        const response = await apiClient.get(`/api/Instructors/GetInstructorsCoursesUserProgress`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data);
        return []
    }
}

export const StartOnlineCourse = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Instructors/StartCourse`, payload)
        return response && response.status
    } catch (error) {
        console.error(error.response.data)
        return error.response.status;
    }
}

export const GetCourseById = async (id) => {
    try {
        const response = await apiClient.get(`/api/Instructors/Course/${id}`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data)
        return null;
    }
}

export const GetMeetingInformation = async (id) => {
    try {
        const response = await apiClient.get(`/api/OnlineMeetings/GetMobileMeetingInformations/${id}`)
        return response && response.data
    } catch (error) {
        console.error(error.response.data)
        return null;
    }
}

export const GetAllInstructors = async (filters) => {
    try {
        const queryParams = {}

        Object.keys(queryParams).forEach((key) => {
            if(filters[key]){
                queryParams[key] = filters[key]
            }
        })

        const queryString = new URLSearchParams(queryParams).toString();

        const response = await apiClient.get(`/api/Instructors/GetAllInstructors?${queryString}`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data)
        return [];
    }
}

export const GetSingleInstructorDetailsFromStudentSide = async (id) => {
    try {
        const response = await apiClient.get(`/api/Instructors/GetInstructorData/${id}`)
        return response && response.data;
    } catch (error) {
        console.error(error.response.data);
        return null;
    }
}

export const GetInstructorCoursesById = async (id, filterData) => {
    try {
        const response = await apiClient.get(`/api/Instructors/TutorCourses/${id}`, {
            params: filterData
        })
        return response && response.data
    } catch (error) {
        console.error(error.response.data)
        return null;
    }
}

export const ForgotPasswordReq = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Users/forgot-password`, payload)
        return response && response.status;
    } catch (error) {
        return error.response.status
    }
}

export const GetAvailableTickets = async () => {
    try {
        const response = await apiClient.get(`/api/Support/GetAvailableTickets`)
        return response && response.data;
    } catch (error) {
        console.error(error);
        return []
    }
}

export const CreateSupportReportTicket = async (payload) => {
    try {
        const response = await apiClient.post(`/api/Support/CreateReportSupportTicket`, payload)
        return response && response.status
    } catch (error) {
        return error.response.status;
    }
}