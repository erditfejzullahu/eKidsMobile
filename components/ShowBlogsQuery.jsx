import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { getCourseCategories } from '../services/fetchingService'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'

const ShowBlogsQuery = ({retrivedBlogData, userData}) => {
  
  return (
    <ScrollView className="max-h-[200px] border border-black-200 rounded-[5px] overflow-hidden">
      {retrivedBlogData?.map((item) => {
        const date = new Date(item?.createdAt);
        const formattedDate = date.toLocaleDateString('sq-AL', {
            year: 'numeric',
            month: 'long',  // Full month name
            day: 'numeric',
          });
        return (
        <TouchableOpacity key={`searchBlogresult-${item?.id}`} className="py-2 border-b border-black-200 mx-2" onPress={() => router.replace(`(profiles)/${item?.id}`)}>
          <View className=" flex-row items-center justify-between">
            <View className="gap-1">
                <Text className="font-psemibold text-lg mb-0.5 text-white">{item?.title}</Text>
                <View className="bg-secondary py-0.5 px-2 rounded-[5px] self-start">
                  <Text className="font-psemibold text-white text-xs">{getCourseCategories(userData?.data?.categories, item?.categoryId)}</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  <Text className="text-gray-400 font-psemibold text-xs">{item?.tag?.name}</Text>
                  {item?.tag?.children?.map((tItem) => (
                    <Text className="text-gray-400 font-psemibold text-xs">{tItem?.name}</Text>
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
            <View className="absolute -top-2 -right-2 py-1 px-2 border-b border-l border-r border-black-200 bg-primary rounded-bl-[5px] rounded-tr-[5px]">
              <Text className="text-gray-400 font-psemibold text-xs">{formattedDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )})}
    </ScrollView>
  )
}

export default ShowBlogsQuery