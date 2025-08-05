import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { fetchCourse } from '../../../../../services/fetchingService';
import useFetchFunction from '../../../../../hooks/useFetchFunction';
import Loading from '../../../../../components/Loading';
import SingleCourse from '../../../../../components/SingleCourse';
import { currentUserID } from '../../../../../services/authService';
import { getUserCourseStatus } from '../../../../../services/fetchingService';
import { useRouter } from 'expo-router';
import ShareToFriends from '../../../../../components/ShareToFriends';
import { useGlobalContext } from '../../../../../context/GlobalProvider';

const Course = () => {
  const router = useRouter();
  const { course } = useLocalSearchParams();
  const {data, refetch, isLoading} = useFetchFunction(() => fetchCourse(course))
  const [courseData, setCourseData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [userStartedCourse, setUserStartedCourse] = useState(null)
  const [userProgressData, setUserProgressData] = useState([])

  const {user} = useGlobalContext();

  const getStatus = async () => {
    try {
      const userId = await currentUserID();
      // console.log(userId, course, ' prov');
      
      const response = await getUserCourseStatus(userId, course)
      setUserProgressData(response.data);
      if(response.status === 200){
        // console.log(response.status, 'sucess');
        setUserStartedCourse(true);
      }else{
        setUserStartedCourse(false);
      }
    } catch (error) {
      // console.error(error, 'responsi');
      setUserStartedCourse(false)
    }    
  }

  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    await getStatus();
    setRefreshing(false)
  }, [])

  useEffect(() => {
    setCourseData(null)
    refetch();
  }, [course])
  

  useEffect(() => {
    if(data){
      setCourseData(data)
    }
  }, [data])

  useEffect(() => {
    if(courseData){
      // console.log(courseData);
      
      getStatus()
    }
  }, [courseData])

  useEffect(() => {
    if(userStartedCourse){
      const getProgress = userProgressData?.userProgress?.find(lesson => lesson.progressLessonCompleted === false)
      
      // const getIndexofCurrentProgress = userProgressData?.userProgress?.indexOf(getProgress)
      // const totalNumberOfLessons = userProgressData?.userProgress?.length - 1;

      // const hasMoreInFront = getIndexofCurrentProgress < totalNumberOfLessons;
      // const hasMoreInBack = getIndexofCurrentProgress > 0
      if(getProgress){
        router.replace(`/categories/course/lesson/${getProgress?.progressLessonId}`)
      }else{
        router.replace(`/completed/${userProgressData?.cId}`)
      }
    }
  }, [userStartedCourse])
  
  
  
  
  if(refreshing || isLoading || (userStartedCourse === null)){
    return (
      <Loading />
    )
  }else{
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
        className="h-full bg-primary-light dark:bg-primary"
      >
        {!userStartedCourse ? (
          <SingleCourse course={courseData} />
          ) : (
          <View>
            <Text className="text-oBlack dark:text-white font-pregular text-base p-4">Ju keni filluar shfletimin e ketij kursi! Duke u ridrejtuar...</Text>
          </View>
        )}
        <ShareToFriends 
          currentUserData={user?.data?.userData}
          shareType="course"
          passedItemId={course}
        />
      </ScrollView>
    )
  }
}

export default Course