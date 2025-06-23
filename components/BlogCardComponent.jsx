import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCourseCategories } from '../services/fetchingService'
import _, { flatMap, flattenDeep } from 'lodash';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import BlogCardInteractions from './BlogCardInteractions';
import { useRouter } from 'expo-router';
import FullScreenImage from './FullScreenImage';
import { useShadowStyles } from '../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';

const BlogCardComponent = ({blog, userData, filterByTagId = null, fullBlogSection = false}) => {
    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const router = useRouter();
    const user = userData?.data?.userData;
    const categories = userData?.data?.categories;

    const [blogImages, setBlogImages] = useState([])
    
    const date = new Date(blog?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
    });
    // console.log(blog);
    const [fullScreenModal, setFullScreenModal] = useState({
        visible: false,
        index: 0,
        images: []
    })
    
    useEffect(() => {
      if(blog?.imageUrls){
        setBlogImages(JSON.parse(blog?.imageUrls) || [])
      }
    }, [blog?.imageUrls])

    useEffect(() => {
        if(blogImages){
            setFullScreenModal((prev) => ({
                ...prev,
                images: blogImages
            }))
        }
    }, [blogImages])
    
    
    // console.log(blogImages);
    
  return (
    <>
    <View className="border relative border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack rounded-[5px]">
        {!fullBlogSection && <TouchableOpacity onPress={() => 
            router.push({
                pathname: `${blog?.id}`,
                params: {userId: blog?.userId, userName: blog?.user?.name, userPhoto: blog?.user?.profilePicture}
            })
        } 
        className="absolute right-4 border border-white  dark:border-black-200 top-0 bottom-0 items-center justify-center h-12 w-12 mt-16 bg-gray-200 dark:bg-primary rounded-full " style={shadowStyle}>
            <Image 
                source={icons.rightArrow}
                className="h-5 w-5"
                tintColor={colorScheme === "dark" ? "#fff" : "#FF9C01"}
                resizeMode='contain'
            />
        </TouchableOpacity>}
        <View className="top-0 right-0 absolute flex-row items-center gap-1.5">
            {blog?.categoryId && <Text className={`font-psemibold rounded-bl-[10px] rounded-tr-[10px] p-2 py-1.5 bg-secondary text-xs text-white pr-9`} style={shadowStyle}>{getCourseCategories(categories, blog?.categoryId)}</Text>}
            <TouchableOpacity className=" bg-primary-light dark:bg-primary p-1 absolute rounded-bl-md rounded-tr-md right-0 top-0 border-b border-l border-gray-200 dark:border-black-200" style={shadowStyle}>
                <Image 
                    source={icons.more}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={colorScheme === "dark" ? "#fff" : "#FF9C01"}
                />
            </TouchableOpacity>
        </View>
        {/* user */}
        <View className="flex-row px-4 pt-4 gap-4 items-center mb-4">
            <View className="">
                <Image
                    source={{uri: blog?.user?.profilePicture}}
                    className="h-14 w-14 rounded-full"
                    resizeMode='contain'
                />
            </View>
            <View>
                <Text className="font-psemibold text-lg text-oBlack dark:text-white">{blog?.user?.name}</Text>
                <Text className="font-plight text-xs text-gray-600 dark:text-gray-400">Mik</Text>
            </View>
        </View>
        {/* user */}
       
        {/* title */}
        <View className="gap-3 px-4 mb-4">
            <View>
                <Text className="text-oBlack dark:text-white font-black text-xl border-b-2 border-gray-200 dark:border-black-200 self-start pb-1 pr-2">{blog?.title}</Text>
            </View>
            <View>
                <Text className="text-gray-600 dark:text-gray-400 font-plight text-sm">{blog?.content}</Text>
            </View>

            {/* TODO: IN CLICK OF PHOTOS TO MAKE FULLSCREEN PHOTOS COMPONENT */}
            {blogImages.length > 0 && (
                <View className="flex-1 flex flex-row gap-2 bg-primary-light border border-gray-200 dark:border-0 dark:bg-primary rounded-lg p-2" style={shadowStyle}>
                    {blogImages.slice(0, 3).map((img, idx) => (
                        <View key={`${blog?.id}-${idx}`} className="flex-1 rounded-md overflow-hidden">
                            <TouchableOpacity onPress={() => setFullScreenModal((prev) => ({...prev, index: idx, visible: true, images: blogImages}))}>
                                <Image 
                                    source={{uri: img}}
                                    className="min-h-[200px]"
                                    resizeMode='cover'
                                />
                            </TouchableOpacity>
                            {idx === 2 && blogImages.length > 3 && (
                                <TouchableOpacity 
                                    onPress={() => setFullScreenModal((prev) => ({...prev, index: idx + 1, visible: true, images: blogImages}))}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                                >
                                    <Text className="text-white font-psemibold text-xl">+{blogImages.length - 3}</Text>
                                    <Text className="text-white font-plight text-sm">Me shume</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
        {/* title */}

        {/* interaction section */}
        <BlogCardInteractions blog={blog} userData={userData} fullBlogSection={fullBlogSection}/>
        {/* interaction section */}

        {/* tags */}
        <View className="mt-2 bg-primary-light dark:bg-primary border-t border-gray-200 dark:border-black-200 px-4 py-3" style={shadowStyle}>
            <View>
                <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight mb-1">Etiketimet:</Text>
                <View className="flex-row gap-2 flex-1 flex-wrap">
                    {blog?.tags?.length > 0 && blog?.tags?.map((item, index) => (
                        <TouchableOpacity onPress={() => fullBlogSection ? {} : filterByTagId(item)} className={`${index === 0 ? "bg-secondary border-white" : "bg-oBlack-light dark:bg-oBlack border-gray-200 dark:border-black-200"} border  rounded-[5px] px-4 py-1`} key={`tag-${blog?.id}-${item?.tagId}`}>
                            <Text className={`${index === 0 ? "text-oBlack dark:text-white" : "text-secondary"} font-psemibold text-sm`}>{item?.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
        {/* tags */}
        <View className="absolute -bottom-2 -right-2 bg-oBlack-light dark:bg-oBlack p-2 border border-gray-200 dark:border-black-200 rounded-[5px]" style={shadowStyle}>
            <Text className="text-oBlack dark:text-white font-plight text-xs">{formattedDate}</Text>
        </View>
    </View>
    <FullScreenImage 
        visible={fullScreenModal.visible}
        images={fullScreenModal.images}
        initialIndex={fullScreenModal.index}
        onClose={() => setFullScreenModal({visible: false, images: [], index: 0})}
    />
    </>
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