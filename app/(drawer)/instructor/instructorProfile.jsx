import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import INProfileFirstSection from '../../../components/INProfileFirstSection'
import {useGlobalContext} from "../../../context/GlobalProvider"
import Loading from "../../../components/Loading"
import BlogsProfile from '../../../components/BlogsProfile'
import DiscussionsProfile from '../../../components/DiscussionsProfile'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getInstructor } from '../../../services/fetchingService'
import INProfileCaruselSection from '../../../components/INProfileCaruselSection'

const instructorProfile = () => {
  const {user, isLoading} = useGlobalContext();
  const {data, isLoading: instructorLoading, refetch} = useFetchFunction(() => getInstructor(user?.data?.userData?.id))
  const [instructorProfile, setInstructorProfile] = useState(null)

  useEffect(() => {
    if(data){
      setInstructorProfile(data)
    }else{
      setInstructorProfile(null)
    }
  }, [data])
  
  
  if(isLoading || instructorLoading) return <Loading />
  return (
    <ScrollView className="h-full bg-primary">
      <View className="relative">
        <BlogsProfile userData={user}/>
        <DiscussionsProfile userData={user}/>
        <INProfileFirstSection data={user.data.userData}/>
        <INProfileCaruselSection statistics={instructorProfile}/>
      </View>
    </ScrollView>
  )
}

export default instructorProfile