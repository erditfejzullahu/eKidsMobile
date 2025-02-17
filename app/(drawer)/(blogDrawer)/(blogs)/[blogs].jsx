import { View, Text, ScrollView, RefreshControl, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { icons } from '../../../../constants';
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { getBlogById, getCourseCategories } from '../../../../services/fetchingService';
import Loading from '../../../../components/Loading';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import BlogCardComponent from '../../../../components/BlogCardComponent';
import ChevronDownAnimation from '../../../../components/ChevronDownAnimation';
import * as Animatable from "react-native-animatable"

const Blogs = () => {
    const {blogs, userId, userPhoto} = useLocalSearchParams();
    const router = useRouter();
    const {user, isLoading: userLoading} = useGlobalContext();
    const {data, isLoading, refetch} = useFetchFunction(() => getBlogById(blogs, userId))
    const [blogData, setBlogData] = useState({})
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = async () => {
      setIsRefreshing(true)
      setBlogData(null)
      await refetch()
      setIsRefreshing(false)
    }

    useEffect(() => {
      
      if(data){
        console.log(data);
        setBlogData(data)
      }else{
        setBlogData(null)
      }
    }, [data])
    
    useEffect(() => {
      setBlogData(null)
      refetch();
    }, [blogs])

    if(isLoading || isRefreshing) return <Loading />
  return (
    <ScrollView
    nestedScrollEnabled 
      refreshControl={< RefreshControl refreshin={isRefreshing} onRefresh={onRefresh}/>}
      className="bg-primary"
    >
      <View className="bg-oBlack border-b border-t border-black-200 flex-row items-center" style={styles.box}>
        <View className="border-r border-black-200 p-2 flex-[0.25] items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              className="w-6 h-6"
              resizeMode='contain'
              tintColor={"#ff9c01"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row items-center gap-2 p-2 justify-center border-r border-black-200">
          <Text className="text-white font-psemibold text-lg">ShokuMesimit</Text>
          <Image 
            source={icons.star}
            className="h-4 w-4"
            tintColor={"#ff9c01"}
            resizeMode='contain'
          />
        </View>
        <View className="flex-[0.25] p-2 items-center">
          <TouchableOpacity onPress={() => router.replace(`(profiles)/${userId}`)}>
            <Image 
              source={{uri: userPhoto}}
              className="w-10 h-10 rounded-full border border-black-200"
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 mt-4">
        <BlogCardComponent 
          blog={blogData}
          userData={user}
          fullBlogSection={true}
        />
      </View>

      {/* <Animatable.View 
        className="items-center mt-8 bg-oBlack self-start mx-auto rounded-[5px] p-4 flex-1"
        style={styles.box}
        animation="pulse"
        iterationCount="infinite"
        
        >
          <TouchableOpacity className="items-center gap-2 flex-1">
            <ChevronDownAnimation />
            <Text className="text-white font-psemibold text-sm mt-4">Shfaq Diskutimet</Text>
          </TouchableOpacity>
      </Animatable.View> */}

      {/* <View className="flex-1 bg-oBlack rounded-[5px] p-4 mx-4 mt-4 border border-black-200 mb-4" style={styles.box}>
        <View>
          <View>
            <Text className="text-white font-psemibold text-xl">Titulli i diskutimit</Text>
            <Text className="text-gray-400 text-xs text-right mt-1 font-plight">Krijuar <Text className="text-secondary">21.01.2000</Text></Text>
          </View>
          <View className="mt-2 border-t border-black-200 pt-2">
            <Text className="text-white font-plight text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, nobis magnam accusamus aut necessitatibus at, expedita obcaecati quasi quidem pariatur autem in, atque quam totam modi doloribus. Itaque, rerum ratione!</Text>
          </View>
        </View>

        <View className="mt-2 border-t border-black-200 pt-0.5 self-start">
          <Text className="text-secondary font-psemibold text-sm">Replikat:</Text>
        </View>
      </View> */}

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
})
export default Blogs