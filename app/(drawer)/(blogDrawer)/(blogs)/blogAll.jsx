import { View, Text, ScrollView, TouchableOpacity, Button, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AddBlogComponent from '../../../../components/AddBlogComponent'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { getAllBlogs, getAllBlogsByTag } from '../../../../services/fetchingService'
import Loading from '../../../../components/Loading'
import BlogCardComponent from '../../../../components/BlogCardComponent'
import { ActivityIndicator } from 'react-native'
import { icons, images } from '../../../../constants'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useRoute } from '@react-navigation/native'
import {useShadowStyles} from "../../../../hooks/useShadowStyles"

const Blog = () => {
  const {shadowStyle} = useShadowStyles();
  const route = useRoute();
  const {tagId, name} = route.params || {}
  
  const {user, isLoading} = useGlobalContext();
  const { data: blogData, isLoading: blogLoading, refetch: blogRefetch } = useFetchFunction(() =>
        blogTagId === null ? getAllBlogs(pagination, forYouToggle)
        : getAllBlogsByTag(blogTagId?.tagId, pagination, forYouToggle)
  );

  const [passUserOutside, setPassUserOutside] = useState(false)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const [allBlogs, setAllBlogs] = useState([])
  const [hasMoreBlogs, setHasMoreBlogs] = useState(false)

  const [blogTagId, setBlogTagId] = useState(null)
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 15
  })

  const [forYouToggle, setForYouToggle] = useState(1) //1 all 2 friends


  useEffect(() => {
    if(tagId){
      setBlogTagId({tagId, name})
    }
  }, [tagId, name])
  

  useEffect(() => {
    setIsRefreshing(true)
    setAllBlogs([])
    setPagination({pageNumber: 1, pageSize: 15})
    // blogRefetch();
    setIsRefreshing(false)
  }, [blogTagId])
  
  useEffect(() => {
    blogRefetch()
  }, [pagination])

  useEffect(() => {
    blogRefetch()
  }, [forYouToggle])
  
  

  const userOutsidePostCreation = () => {
    setPassUserOutside(!passUserOutside);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setBlogTagId(null)
    setPagination({ pageNumber: 1, pageSize: 15 })
    setAllBlogs([])
    await blogRefetch();
    setIsRefreshing(false)
  }, [])

  const nextPage = useCallback(() => {    
    if(hasMoreBlogs){
      setPagination(prevData => ({
        ...prevData,
        pageNumber: prevData.pageNumber + 1
      }))
    }
  }, [hasMoreBlogs, setPagination])

  useEffect(() => {
    console.log(blogData, ' ??');
    if(blogData){
      
      const {data, hasMore} = blogData;
      if(data && data?.length > 0){
        const newBlogs = data.filter((blog) => !allBlogs.some((existingBlog) => existingBlog.id === blog.id))
        if(newBlogs.length > 0){
          setAllBlogs((prevBlogs) => [...prevBlogs, ...newBlogs])
        }
      }
      setHasMoreBlogs(hasMore)
    }else{
      setAllBlogs([])
      setHasMoreBlogs(false)
    }
  }, [blogData])

  useEffect(() => {
    if(blogData){

    }
  }, [blogData])
  
  
  
  if((blogLoading || isLoading) && pagination.pageNumber === 1) return (<Loading />)
  return (
    <View className="flex-1 h-full">      
        <KeyboardAwareFlatList
          behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} style={{flex: 1}}
          refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh}/>}
          className="p-4 h-full bg-primary-light dark:bg-primary flex-1"
          data={allBlogs}
          contentContainerStyle={{gap: 20}}
          keyExtractor={(item) => `ParentBlog-${item.id}`}
          renderItem={({item}) => (
            <BlogCardComponent blog={item} userData={user} filterByTagId={(tagId) => setBlogTagId(tagId)} removePostFromList={(data) => setAllBlogs((prev) => {return prev.filter(item => item.id !== data.id)})}/>
          )}
          onEndReached={nextPage}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={() => (
            <>
            <View className={`${blogTagId === null ? "-mb-2" : ""} border-b border-gray-200 dark:border-black-200 pb-4`}>

              <View className="absolute z-10 left-0 right-0 -top-2.5 items-center">
                <View className="flex-row items-center gap-4" style={shadowStyle}>
                  <TouchableOpacity onPress={() => setForYouToggle(2)} className={` py-0.5 px-3 items-center border border-white dark:border-black-200 rounded-md ${forYouToggle === 2 ? "bg-gray-200 dark:bg-oBlack" : "bg-primary-light dark:bg-primary"}`}>
                    <Text className={`font-psemibold text-sm ${forYouToggle === 2 ? "text-secondary" : "text-oBlack dark:text-white"}`}>Miqte tuaj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setForYouToggle(1)} className={`py-0.5 px-3 items-center border border-white dark:border-black-200 rounded-md ${forYouToggle === 1 ? "bg-gray-200 dark:bg-oBlack" : "bg-primary-light dark:bg-primary"}`}>
                    <Text className={`font-psemibold text-sm ${forYouToggle === 1 ? "text-secondary" : "text-oBlack dark:text-white"}`}>Per ty</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <AddBlogComponent userData={user} getUserOutside={passUserOutside} sendRefreshCall={() => onRefresh()}/>
            </View>
            {blogTagId !== null && 
            <View className="-mb-2 mt-4 flex-row items-center gap-2">
              <View>
                <Text className="text-gray-600 dark:text-gray-400 font-plight text-sm">Etiketimi i zgjedhur:</Text>
              </View>
              <View className="bg-secondary border border-white px-2 py-0.5 rounded-[5px]">
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">{blogTagId.name}</Text>
              </View>
            </View>}
            </>
          )}
          ListFooterComponent={() => (
            <>
            <View className="justify-center p-4 -mt-5 flex-row items-center gap-2">
              {hasMoreBlogs ? (
                <>
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                <ActivityIndicator color={"#FF9C01"} size={24} />
                </>
              ): (
                <>
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">Nuk ka me postime...</Text>
                <Image 
                  source={images.breakHeart}
                  className="size-5"
                  tintColor={"#FF9C01"}
                  resizeMode='contain'
                />
                </>
              )}
            </View>
            </>
          )}
        />
    </View>
  )
}

export default Blog

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