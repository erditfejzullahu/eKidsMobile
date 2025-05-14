import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { GetSingleInstructorDetailsFromStudentSide } from '../../../../services/fetchingService';
import Loading from '../../../../components/Loading';
import STDINProfileFirstSection from '../../../../components/STDINProfileFirstSection';
import DiscussionsProfile from '../../../../components/DiscussionsProfile';
import BlogsProfile from '../../../../components/BlogsProfile';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { Platform } from 'react-native';
import STDINCaruselSection from '../../../../components/STDINCaruselSection';

const Tutor = () => {
  const {id} = useLocalSearchParams();
  const {data, isLoading, refetch} = useFetchFunction(() => GetSingleInstructorDetailsFromStudentSide(id))
  const [instructorData, setInstructorData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {user, isLoading: userLoading} = useGlobalContext();

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false);
  }

  useEffect(() => {
    console.log(data);
    
    setInstructorData(data || null)
  }, [data])

  useEffect(() => {
    refetch();
  }, [id])
  
  if(isLoading || isRefreshing) return <Loading />
  return (
    <ScrollView
      className="h-full bg-primary"
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <DiscussionsProfile userData={instructorData} otherSection={true}/>
      <BlogsProfile userData={user} otherSection={true} otherData={instructorData}/>
      <STDINProfileFirstSection data={instructorData} userData={user}/>
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