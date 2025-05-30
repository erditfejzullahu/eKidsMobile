import { View, Text, ScrollView, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import INProfileFirstSection from '../../../components/INProfileFirstSection'
import {useGlobalContext} from "../../../context/GlobalProvider"
import Loading from "../../../components/Loading"
import BlogsProfile from '../../../components/BlogsProfile'
import DiscussionsProfile from '../../../components/DiscussionsProfile'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getInstructor } from '../../../services/fetchingService'
import INProfileCaruselSection from '../../../components/INProfileCaruselSection'
import INProfileDetails from '../../../components/INProfileDetails'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router'
import { useRole } from '../../../navigation/RoleProvider'

const InstructorProfile = () => {
  const router = useRouter();
  const {role, isLoading: roleLoading} = useRole();
  useEffect(() => {
    if(!roleLoading && !['Instructor', 'Admin'].includes(role)){
      router.replace("/home")
    }
  }, [role])
  const {user, isLoading} = useGlobalContext();
  const {data, isLoading: instructorLoading, refetch} = useFetchFunction(() => getInstructor())
  const [instructorProfile, setInstructorProfile] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    if(data){
      setInstructorProfile(data)
    }else{
      setInstructorProfile(null)
    }
  }, [data])
  
  
  if(isLoading || instructorLoading) return <Loading />
  return (
    <KeyboardAwareScrollView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="h-full bg-primary"
    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <View className="relative">
        <BlogsProfile userData={user}/>
        <DiscussionsProfile userData={user}/>
        <INProfileFirstSection data={user.data.userData}/>
        <View className="relative">
          <INProfileCaruselSection statistics={instructorProfile}/>
        </View>
        <INProfileDetails user={instructorProfile}/>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default InstructorProfile