import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { getCourseCategories } from '../services/fetchingService'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { useRouter } from 'expo-router'
const ShowBlogsQuery = ({retrivedBlogData, userData}) => {
  const router = useRouter();

  // TODO NOT WORKING GOOD
  
  return (
    <ScrollView className="max-h-[200px] h-full border border-gray-200 dark:border-black-200 rounded-[5px] overflow-hidden">
      {retrivedBlogData?.map((item) => {
        const date = new Date(item?.createdAt);
        const formattedDate = date.toLocaleDateString('sq-AL', {
            year: 'numeric',
            month: 'long',  // Full month name
            day: 'numeric',
          });
          
        return (
        <TouchableOpacity key={`searchBlogresult-${item?.id}`} className="py-2 border-b border-gray-200 dark:border-black-200 mx-2" 
          onPress={() => router.replace({
            pathname: `(blogs)/${item?.id}`,
            params: {userId: item?.user?.id, userName: item?.user?.username, userPhoto: item?.user?.profilePictureUrl}
          })}
          >
          <View className=" flex-row items-center justify-between">
            <View className="gap-1">
                <Text className="font-psemibold text-lg mb-0.5 text-oBlack dark:text-white">{item?.title}</Text>
                <View className="bg-secondary py-1 mb-1 px-2 rounded-[5px] self-start">
                  <Text className="font-psemibold text-oBlack dark:text-white text-xs">{getCourseCategories(userData?.data?.categories, item?.categoryId)}</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  <Text className="text-white font-psemibold text-xs bg-primary-light dark:bg-primary px-2 py-1 border rounded-md border-gray-200 dark:border-black-200">{item?.name}</Text>
                  {item?.children?.map((tItem) => (
                    <Text className="text-gray-400 font-psemibold text-xs bg-primary-light dark:bg-primary px-2 py-1 border rounded-md border-gray-200 dark:border-black-200">{tItem?.name}</Text>
                  ))}
                </View>
            </View>
            <View>
                <Image 
                    source={icons.rightArrow}
                    tintColor={"FF9C01"}
                    className="mr-2"
                />
            </View>
            <View className="absolute -top-2 -right-2 py-1 px-2 border-b border-l border-r border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary rounded-bl-[5px] rounded-tr-[5px]">
              <Text className="text-gray-400 font-psemibold text-xs">{formattedDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )})}
    </ScrollView>
  )
}

export default ShowBlogsQuery