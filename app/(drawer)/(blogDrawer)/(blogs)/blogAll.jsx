import { View, Text, ScrollView, TouchableOpacity, Button, FlatList, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AddBlogComponent from '../../../../components/AddBlogComponent'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { getAllBlogs } from '../../../../services/fetchingService'
import Loading from '../../../../components/Loading'
import BlogCardComponent from '../../../../components/BlogCardComponent'

const blog = () => {
  const {user, isLoading} = useGlobalContext();
  const {data: blogData, isLoading: blogLoading, refetch: blogRefetch} = useFetchFunction(() => getAllBlogs(pagination))
  const [passUserOutside, setPassUserOutside] = useState(false)
  const [allBlogs, setAllBlogs] = useState([])
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 15
  })

  const userOutsidePostCreation = () => {
    setPassUserOutside(!passUserOutside);
  };

  useEffect(() => {
    
    if(blogData){
      console.log(blogData);
      setAllBlogs(blogData)
    }else{
      setAllBlogs([])
    }
  }, [blogData])
  
  
  if(blogLoading || isLoading) return (<Loading />)
  return (
    <View className="flex-1">
      
        <FlatList
          className="p-4 h-full bg-primary"
          data={blogData}
          contentContainerStyle={{gap: 20}}
          keyExtractor={(item) => `blog-${item.id}`}
          renderItem={({item}) => (
            <BlogCardComponent blog={item} userData={user}/>
          )}
          ListHeaderComponent={() => (
            <View className="-mb-2 border-b border-black-200 pb-4">
              <AddBlogComponent userData={user} getUserOutside={passUserOutside} />
            </View>
          )}
          ListFooterComponent={() => (
          <TouchableWithoutFeedback onPress={userOutsidePostCreation}>
            <View className="my-6"><Text>asdasdasdasdasdasdasdasdasd</Text></View>
          </TouchableWithoutFeedback>
          )}
        />
        
    </View>
  )
}

export default blog