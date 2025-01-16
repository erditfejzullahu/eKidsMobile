import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { getCourseCategories } from '../services/fetchingService'
import { flatMap } from 'lodash';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import BlogCardInteractions from './BlogCardInteractions';

const BlogCardComponent = ({blog, userData, filterByTagId = null}) => {
    
    const user = userData?.data?.userData;
    const categories = userData?.data?.categories;
    
    const date = new Date(blog?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
    });
    
  return (
    <View className="border relative border-black-200 bg-oBlack rounded-[5px]">
        <View className="top-0 right-0 p-2 pt-1.5 bg-secondary absolute rounded-bl-[10px]">
            <Text className="font-psemibold text-xs text-white">{getCourseCategories(categories, blog.categoryId)}</Text>
        </View>
        {/* user */}
        <View className="flex-row px-4 pt-4 gap-4 items-center mb-4">
            <View className="">
                <Image
                    source={{uri: user.profilePictureUrl}}
                    className="h-14 w-14 rounded-full"
                    resizeMode='contain'
                />
                <Text className="text-white text-2xl">{blog.id}</Text>
            </View>
            <View>
                <Text className="font-psemibold text-lg text-white">Erdit Fejzullahu</Text>
                <Text className="font-plight text-xs text-gray-400">Mik</Text>
            </View>
        </View>
        {/* user */}
       
        {/* title */}
        <View className="gap-3 px-4 mb-4">
            <View>
                <Text className="text-white font-black text-xl border-b-2 border-black-200 self-start pb-1 pr-2">{blog.title}</Text>
            </View>
            <View>
                <Text className="text-white font-plight text-sm">{blog.content}</Text>
            </View>
        </View>
        {/* title */}

        {/* interaction section */}
        <BlogCardInteractions blog={blog} userData={userData}/>
        {/* interaction section */}

        {/* tags */}
        <View className="mt-2 bg-primary border-t border-black-200 px-4 py-3" style={styles.box}>
            <View>
                <Text className="text-gray-400 text-sm font-plight mb-1">Etiketimet:</Text>
                <View className="flex-row gap-2 flex-1 flex-wrap">
                    <TouchableOpacity onPress={() => filterByTagId(blog.tags.tagId)} className="bg-secondary border-white rounded-[5px] px-4 py-1">
                        <Text className="text-white font-pbold text-sm">{blog.tags.name}</Text>
                    </TouchableOpacity>
                    {blog.tags.children.length > 0 && blog.tags.children.map((item) => (
                        <TouchableOpacity onPress={() => filterByTagId(item.tagId)} className="bg-oBlack border border-black-200 rounded-[5px] px-4 py-1" key={`tag-${blog.id}-${item.tagId}`}>
                            <Text className="text-secondary font-psemibold text-sm">{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
        {/* tags */}
        <View className="absolute -bottom-2 -right-2 bg-oBlack p-2 border border-black-200 rounded-[5px]" style={styles.box}>
            <Text className="text-white font-plight text-xs">{formattedDate}</Text>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
})
export default BlogCardComponent