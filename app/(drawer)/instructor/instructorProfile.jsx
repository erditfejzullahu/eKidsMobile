import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import INProfileFirstSection from '../../../components/INProfileFirstSection'
import {useGlobalContext} from "../../../context/GlobalProvider"
import Loading from "../../../components/Loading"
import BlogsProfile from '../../../components/BlogsProfile'
import DiscussionsProfile from '../../../components/DiscussionsProfile'

const instructorProfile = () => {
  const {user, isLoading} = useGlobalContext();
  
  if(isLoading) return <Loading />
  return (
    <ScrollView className="h-full bg-primary">
      <View className="relative">
        <BlogsProfile userData={user}/>
        <DiscussionsProfile userData={user}/>
        <INProfileFirstSection data={user.data.userData}/>
      </View>
    </ScrollView>
  )
}

export default instructorProfile