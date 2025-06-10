import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../constants'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useState } from 'react'
import { useTopbarUpdater } from '../navigation/TopbarUpdater'
import { useNotificationContext } from '../context/NotificationState'
import _ from 'lodash'
import { getBlogByTitle, reqUsersBySearch } from '../services/fetchingService'
import * as Animatable from "react-native-animatable"
import BlogSearchInput from './ShowBlogsQuery'
import ShowBlogsQuery from './ShowBlogsQuery'
import { useGlobalContext } from '../context/GlobalProvider'
import CustomButton from './CustomButton'
import NotifierComponent from './NotifierComponent'

const Topbar = () => {
    const {user, isLoading} = useGlobalContext();
    const router = useRouter()
    const navigator = useNavigation();
    const [retrivedData, setRetrivedData] = useState(null)
    const [retrivedBlogData, setRetrivedBlogData] = useState([])
    const [notificationsOpened, setNotificationsOpened] = useState(false)
    const {showSearcher, showBlogSearcher, showQuizOrCourseSharer, shareOpened, setShareOpened, showDiscussionSearcher, showInstructorCourseSharer, showInstructorSharer, showOnlineMeetingSharer} = useTopbarUpdater();
    const {isOpened, setIsOpened, notificationsCount} = useNotificationContext();
    const [queryText, setQueryText] = useState(null)

    const fetchUsers = async () => {
        const response = await reqUsersBySearch(queryText);
        if(response){
            setRetrivedData(response);
        }else{
            setRetrivedData(null)
        }
    }

    const fetchBlogs = async () => {
        const response = await getBlogByTitle(queryText)
        if(response){
            setRetrivedBlogData(response)
        }else{
            setRetrivedBlogData([])
        }
    }

    useEffect(() => {
      if(queryText === '' || queryText === null){
        setRetrivedData(null)
        setRetrivedBlogData(null)
      }else{
        handleInput();
      }
    }, [queryText])
    

    const debounceFetchData = useCallback(_.debounce(fetchUsers, 500), [])
    const debounceFetchBlogData = useCallback(_.debounce(fetchBlogs, 500), [])

    const handleInput = () => {        
        if(showSearcher){
            if(queryText.length > 2) debounceFetchData(queryText)
        }else if(showBlogSearcher){
            if(queryText.length > 2) debounceFetchBlogData(queryText)
        }
    }

    useEffect(() => {
    
      return () => {
        debounceFetchBlogData.cancel();
        debounceFetchData.cancel();
      }
    }, [])
    
    
  return (
    <SafeAreaView className="relative h-[90px]" style={{backgroundColor: "#13131a", borderBottomColor: "#232533", borderBottomWidth: 1}}>
      <View className="flex-row justify-between" style={{height:40}}>
        <View className="justify-center items-end">
            <TouchableOpacity
                onPress={() => router.replace('(drawer)/(tabs)/home')}
            >
                <Image 
                    source={images.logoNoText}
                    resizeMode="contain"
                    className="h-10 w-10 ml-4"
                />
            </TouchableOpacity>
        </View>
        {(showSearcher || showDiscussionSearcher || showBlogSearcher) && <View className="justify-center items-center flex-1 max-w-[60%] relative">
            <TextInput 
                placeholder={`${showSearcher ? "Kerkoni perdorues..." : showBlogSearcher ? "Kerkoni blogs..." : showDiscussionSearcher ? "Kerkoni diskutime..." : ""}`}
                placeholderTextColor={"#414141"}
                value={queryText}
                className="border bg-primary text-white border-black-200 h-full p-2 rounded-[5px] w-full"
                onChangeText={(text) => setQueryText(text)}
            />
            {queryText?.length > 0 && <TouchableOpacity className="absolute h-full items-center justify-center self-start right-0 px-2 z-[20]" onPress={() => setQueryText("")}>
                <Image 
                    source={icons.close}
                    className="size-4"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>}
        </View>} 

        <View className="justify-center flex-row gap-4 items-center" style={{height:40}}>
            {(showQuizOrCourseSharer || showInstructorCourseSharer || showInstructorSharer || showOnlineMeetingSharer) && <TouchableOpacity onPress={() => setShareOpened(!shareOpened)} className={`justify-center items-center border ${shareOpened ? "border-[#FF9C01]" : "border-[#CDCDE0]"} rounded-full`}>
                <Image 
                    source={icons.share}
                    className="h-6 w-6 p-1"
                    resizeMode='contain'
                    tintColor={shareOpened ? "#FF9C01" : "#CDCDE0"}
                />
            </TouchableOpacity>}
            <View>
                <TouchableOpacity
                    className="relative"
                    onPress={() => setIsOpened(true)}
                >
                    {notificationsCount > 0 && <View className={`absolute ${isOpened ? "bg-white" : "bg-secondary"} -right-2 -top-2 rounded-full z-20 h-4 w-4 items-center justify-center`}>
                        <Text className={`font-psemibold ${isOpened ? "text-secondary" : "text-white"} text-xs`}>{notificationsCount}</Text>
                    </View>}
                    <Image 
                        source={icons.notifications}
                        className="h-6 w-6"
                        resizeMode='contain'
                        tintColor={isOpened ? "#FF9C01" : "#CDCDE0"}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => navigator.dispatch(DrawerActions.openDrawer())}
                >
                    <Image 
                        source={images.hamburger}
                        resizeMode="contain"
                        className="h-6 w-6 mr-4"
                        tintColor={"#CDCDE0"}
                    />
                </TouchableOpacity>
            </View>
        </View>

        


      </View>

      {(showSearcher && retrivedData?.length > 0 && queryText !== '') && <Animatable.View animation="fadeInLeft" duration={300} className="w-[90%] absolute overflow-hidden m-auto mt-[82px] bg-oBlack left-[5%]">
        <ScrollView className="max-h-[200px] border border-black-200 rounded-[5px] overflow-hidden">
            {retrivedData?.map((item) => (
            <TouchableOpacity key={`searchresult-${item?.id}`} className="py-2 border-b border-black-200 mx-2" onPress={() => {setQueryText(''); router.replace(`/users/${item?.id}`)}}>
                <View className=" flex-row items-center justify-between">
                    <View className="flex-row gap-3 items-center">
                        <View>
                            <Image 
                                source={{uri: item?.profilePictureUrl}}
                                className="h-14 w-14 rounded-[3px] border border-black-200"
                                resizeMode='cover'
                            />
                        </View>
                        <View>
                            <Text className="font-psemibold text-lg mb-0.5 text-white">{item?.name}</Text>
                            <Text className="font-pregular text-xs text-gray-400">{item?.isCloseFriend && item?.isFriend ? "Mik i ngushte" : item?.isFriend && !item?.isCloseFriend ? "Mik" : "Bashkeperdorues"}</Text>
                        </View>
                    </View>
                    <View>
                        <Image 
                            source={icons.rightArrow}
                            tintColor={"FF9C01"}
                            className="mr-2"
                        />
                    </View>
                </View>
            </TouchableOpacity>
            ))}
        </ScrollView>
      </Animatable.View>}
        
        {(showBlogSearcher && retrivedBlogData?.length > 0 && queryText !== '') && 
        <Animatable.View animation="fadeInLeft" duration={300} className="w-[90%] absolute overflow-hidden m-auto mt-[82px] bg-oBlack left-[5%]">
            <ShowBlogsQuery retrivedBlogData={retrivedBlogData} userData={user}/>
        </Animatable.View>
        }

      <StatusBar backgroundColor='#13131a' style='light'/>

    </SafeAreaView>
  )
}

export default Topbar