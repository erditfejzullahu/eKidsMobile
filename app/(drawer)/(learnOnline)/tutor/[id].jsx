import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { GetSingleInstructorDetailsFromStudentSide, getUserRelationStatus } from '../../../../services/fetchingService';
import Loading from '../../../../components/Loading';
import STDINProfileFirstSection from '../../../../components/STDINProfileFirstSection';
import DiscussionsProfile from '../../../../components/DiscussionsProfile';
import BlogsProfile from '../../../../components/BlogsProfile';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { Platform } from 'react-native';
import STDINCaruselSection from '../../../../components/STDINCaruselSection';
import { Redirect } from 'expo-router';

const Tutor = () => {
  const {id} = useLocalSearchParams();
  const {data, isLoading, refetch} = useFetchFunction(() => GetSingleInstructorDetailsFromStudentSide(id))
  const [instructorData, setInstructorData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {user, isLoading: userLoading} = useGlobalContext();
  const {data: relationData, isLoading: relationReloading, refetch: relationRefetch} = useFetchFunction(() => getUserRelationStatus(user?.data?.userData?.id, instructorData?.userId));
  const [relationStatus, setRelationStatus] = useState(null)
  if(user?.data?.userData?.id === data?.userId) return <Redirect href={"instructor/instructorProfile"} />

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch();
    await relationRefetch();
    setIsRefreshing(false);
  }

  useEffect(() => {
    setInstructorData(data || null)
  }, [data])

  useEffect(() => {
    setRelationStatus(relationData || null)
  }, [relationData])
  

  useEffect(() => {
    onRefresh()
  }, [id])
  
  if(isLoading || isRefreshing || userLoading || relationReloading) return <Loading />
  return (
    <ScrollView
      className="h-full bg-primary"
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <DiscussionsProfile userData={instructorData} otherSection={true}/>
      <BlogsProfile userData={user} otherSection={true} otherData={instructorData}/>
      <STDINProfileFirstSection data={instructorData} userData={user} relationStatus={relationStatus} relationRefetch={onRefresh}/>
      <View className="mb-4" />
      <STDINCaruselSection data={instructorData?.instructorCourses} sectionType={"courses"} userData={user}/>
      <STDINCaruselSection data={instructorData?.instructorStudents} sectionType={"students"} userData={user}/>
      <STDINCaruselSection data={instructorData?.onlineMeetings} sectionType={"onlineMeetings"} userData={user}/>
      
    </ScrollView>
  )
}

export default Tutor

const styles = StyleSheet.create({
  box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
})