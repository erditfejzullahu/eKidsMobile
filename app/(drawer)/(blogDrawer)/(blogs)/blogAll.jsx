import { View, Text, ScrollView, TouchableOpacity, Button, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AddBlogComponent from '../../../../components/AddBlogComponent'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { getAllBlogs, getAllBlogsByTag } from '../../../../services/fetchingService'
import Loading from '../../../../components/Loading'
import BlogCardComponent from '../../../../components/BlogCardComponent'

const blog = () => {
  const {user, isLoading} = useGlobalContext();
  const { data: blogData, isLoading: blogLoading, refetch: blogRefetch } = useFetchFunction(() =>
        blogTagId === null ? getAllBlogs(user?.data?.userData?.id, pagination)
        : getAllBlogsByTag(user?.data?.userData?.id, blogTagId, pagination)
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
  

  const userOutsidePostCreation = () => {
    setPassUserOutside(!passUserOutside);
  };

  const onRefresh = async () => {
    setIsRefreshing(true)
    setPagination({ pageNumber: 1, pageSize: 15 })
    setAllBlogs([])
    setBlogTagId(null)
    await blogRefetch();
    setIsRefreshing(false)
  }

  const nextPage = () => {    
    if(hasMoreBlogs){
      setPagination(prevData => ({
        ...prevData,
        pageNumber: prevData.pageNumber + 1
      }))
    }
  }

  useEffect(() => {
    if(blogData){
      const {data, hasMore} = blogData;
      if(data && data?.length > 0){
        const newBlogs = data.filter((blog) => !allBlogs.some((existingBlog) => existingBlog.id === blog.id))
        if(newBlogs.length > 0){
          setAllBlogs((prevBlogs) => [...prevBlogs, ...data])
        }
      }
      setHasMoreBlogs(hasMore)
    }else{
      setAllBlogs([])
    }
  }, [blogData])
  
  
  if((blogLoading || isLoading) && pagination.pageNumber === 1) return (<Loading />)
  return (
    <View className="flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} style={{flex: 1}}>
      
        <FlatList
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
          className="p-4 h-full bg-primary"
          data={allBlogs}
          contentContainerStyle={{gap: 20}}
          keyExtractor={(item) => `ParentBlog-${item.id}`}
          renderItem={({item}) => (
            <BlogCardComponent blog={item} userData={user} filterByTagId={(tagId) => {setBlogTagId(tagId); console.log(tagId, " tagid");}}/>
          )}
          onEndReached={nextPage}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={() => (
            <View className="-mb-2 border-b border-black-200 pb-4">
              <AddBlogComponent userData={user} getUserOutside={passUserOutside} />
            </View>
          )}
          ListFooterComponent={() => (
            <>
          {/* <TouchableWithoutFeedback onPress={userOutsidePostCreation}>
            <View className="my-6"><Text>asdasdasdasdasdasdasdasdasd</Text></View>
          </TouchableWithoutFeedback> */}
            {hasMoreBlogs && <View className="mb-4">
              <Text className="text-secondary text-center font-psemibold text-sm">Ju lutem prisni...</Text>
            </View>}
            </>
          )}
        />
        
    </KeyboardAvoidingView>
    </View>
  )
}

export default blog