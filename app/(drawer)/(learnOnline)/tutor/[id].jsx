import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { GetSingleInstructorDetailsFromStudentSide } from '../../../../services/fetchingService';
import Loading from '../../../../components/Loading';

const Tutor = () => {
  const {id} = useLocalSearchParams();
  const {data, isLoading, refetch} = useFetchFunction(() => GetSingleInstructorDetailsFromStudentSide(id))
  const [instructorData, setInstructorData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
    </ScrollView>
  )
}

export default Tutor