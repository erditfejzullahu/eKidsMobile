import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { deleteBlog, getBlogDetails, getCourseCategories } from '../services/fetchingService'
import _, { flatMap, flattenDeep } from 'lodash';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import BlogCardInteractions from './BlogCardInteractions';
import { useRouter } from 'expo-router';
import FullScreenImage from './FullScreenImage';
import { useShadowStyles } from '../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';
import CustomModal from './Modal';
import * as Animatable from "react-native-animatable"
import { useNavigateToSupport } from '../hooks/goToSupportType';
import NotifierComponent from './NotifierComponent';
import Loading from './Loading';

const formatAlbanianDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('sq-AL', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const period = hours >= 12 ? 'PD' : 'MD';
    const displayHours = hours % 12 || 12;
    
    return `${day} ${month} ${year}, ${displayHours}:${minutes} ${period}`;
};

const BlogCardComponent = ({blog, userData, filterByTagId = null, fullBlogSection = false, removePostFromList}) => {
    // console.log(blog)
    const navigateToSupport = useNavigateToSupport();
    const [moreOptions, setMoreOptions] = useState(false)
    const [blogDetails, setBlogDetails] = useState(false)
    const [comingSoon, setComingSoon] = useState(false)

    const [blogDetailsLoading, setBlogDetailsLoading] = useState(false)
    const [blogDetailsData, setBlogDetailsData] = useState(null)

    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const router = useRouter();
    const user = userData?.data?.userData;
    const categories = userData?.data?.categories;

    const moreOptionsItems = useMemo(() => [
        {label: "Detajet", action: () => setBlogDetails(true), show: true, icon: icons.edit},
        {label: "Shko tek blogu", action: () => router.push({pathname: `${blog?.id}`, params: {userId: blog?.userId, userName: blog?.user?.name, userPhoto: blog?.user?.profilePicture}}), show: true, icon: icons.blogs},
        {label: "Shto tek favoritet", action: () => setComingSoon(true), show: true, icon: icons.star},
        {label: "Raporto", action: () => navigateToSupport('report'), show: true, icon: icons.report},
        {label: "Dukshmeria", action: () => setComingSoon(true), show: blog?.userId === user?.id, icon: icons.earth},
        {label: "Fshij postimin", action: () => deleteBlogById(), show: blog?.userId === user?.id, icon: icons.trashbin}
    ], [])

    const {showNotification: deletedBlogNotification} = useMemo(() => NotifierComponent({
        title: "Sukses",
        description: `Blogu ${blog?.title} eshte fshire me sukses`,
        theme: colorScheme
    }), [colorScheme])

    const {showNotification: deleteBlogNotificationError} = useMemo(() => NotifierComponent({
        title: "Gabim",
        description: `Dicka shkoi gabim ne fshirjen e blogut ${blog?.id}`,
        theme: colorScheme,
        alertType: "warning"
    }), [colorScheme])

    const deleteBlogById = useCallback(async () => {
        const response = await deleteBlog(blog?.id)
        if(response === 200){
            deletedBlogNotification()
            removePostFromList(blog)
        }else{
            deleteBlogNotificationError();
        }
    }, [deletedBlogNotification, deleteBlog, blog, removePostFromList, deleteBlogNotificationError])

    const getBlogDetailsData = useCallback(async () => {
        setBlogDetailsLoading(true)
        const response = await getBlogDetails(blog?.id)
        
        setBlogDetailsData(response || null)
        setBlogDetailsLoading(false);
    }, [setBlogDetailsData, setBlogDetailsLoading, getBlogDetails, blog])

    useEffect(() => {
      if(blogDetails){
        getBlogDetailsData();
      }
    }, [blogDetails])
    

    // const moreOptionsFiltered = moreOptionsItems.filter(item => item.show);
    const moreOptionsFiltered = useMemo(() => 
        moreOptionsItems.filter(item => item.show),
        [blog?.userId, user?.id]
    )
    
    const [blogImages, setBlogImages] = useState([])
    
    const date = new Date(blog?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month namemoreOptionsItems
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
        const parsedImages = JSON.parse(blog?.imageUrls) || [];
        setBlogImages(parsedImages);
        setFullScreenModal((prev) => ({
            ...prev,
            images: parsedImages
        }))
      }
    }, [blog?.imageUrls])

    // useEffect(() => {
    //     if(blogImages){
    //         setFullScreenModal((prev) => ({
    //             ...prev,
    //             images: blogImages
    //         }))
    //     }
    // }, [blogImages])
    
    
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
            <TouchableOpacity onPress={() => setMoreOptions(!moreOptions)} className=" bg-primary-light dark:bg-primary p-1 absolute rounded-bl-md rounded-tr-md right-0 top-0 border-b border-l border-gray-200 dark:border-black-200" style={shadowStyle}>
                <Image 
                    source={icons.more}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={colorScheme === "dark" ? "#fff" : "#FF9C01"}
                />
            </TouchableOpacity>
        </View>

        {/* more options */}
        {moreOptions && <Animatable.View animation={"pulse"} duration={500} className="absolute right-0 top-8 bg-oBlack-light dark:bg-oBlack border z-50 border-gray-200 p-2 rounded-md dark:border-black-200" style={shadowStyle}>
            {moreOptionsFiltered.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => {item.action(); setMoreOptions(false)}} className={`${index !== moreOptionsFiltered.length - 1 ? "border-b" : ""} items-center border-gray-200 dark:border-black-200 gap-1 flex-row justify-center`}>
                    <Text className="text-oBlack dark:text-white text-sm font-plight p-1">{item.label}</Text>
                    <Image 
                        source={item.icon}
                        className="size-4"
                        resizeMode='contain'
                        tintColor={"#FF9C01"}
                    />
                </TouchableOpacity>
            ))}
        </Animatable.View>}
        {/* more options */}

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

    {/* details modal */}
    <CustomModal 
        visible={blogDetails}
        onClose={() => setBlogDetails(false)}
        onlyCancelButton
        cancelButtonText={"Largo dritaren"}
    >
        {blogDetailsLoading ? (
            <View className="h-[100px]">
                <Loading />
            </View>
        ) : !blogDetailsData ? (
            <View className="p-3">
                <Text className="text-oBlack dark:text-white font-psemibold text-center">Nuk ka te dhena</Text>
                <Text className="text-gray-600 dark:text-gray-400 font-plight text-sm text-center">Nese mendoni qe eshte gabim, rifreskoni dritaren, apo raportoni problemin tek <Text className="text-secondary font-psemibold">Paneli i Ndihmes</Text></Text>
            </View>
        ) : (
            <>
            <View className="flex-row items-center gap-1 border-b border-gray-200 mb-4 dark:border-black-200">
                <Text className="text-xl text-oBlack dark:text-white font-psemibold text-center">Detajet e blogut</Text>
                <Image 
                    source={icons.statistics}
                    className="size-8"
                    tintColor={"#FF9C01"}
                />
            </View>
            <View className="min-w-full flex-col gap-2" style={shadowStyle}>
                <View className="flex-row justify-between gap-2 items-center">
                    <View className="bg-oBlack-light w-[calc(50%-5px)] flex-1 dark:bg-oBlack border border-white dark:border-black-200 p-2">
                        <Text className="text-oBlack dark:text-white font-psemibold">Autori</Text>
                        <View className="flex-row gap-1 items-center overflow-hidden">
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight">{blogDetailsData?.author || "Pa emer?"}</Text>
                            <Image 
                                source={icons.chat}
                                className="size-4"
                                tintColor={"#FF9C01"}
                                resizeMode='contain'
                            />
                        </View>
                    </View>
                    <View className="bg-oBlack-light w-[calc(50%-5px)] flex-1 dark:bg-oBlack border border-white dark:border-black-200 p-2">
                        <Text className="text-oBlack dark:text-white font-psemibold text-right">Dukshmeria</Text>
                        <View className="flex-row gap-1 items-center justify-end overflow-hidden">
                            <Image 
                                source={icons.earth}
                                className="size-4"
                                tintColor={"#FF9C01"}
                            />
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight text-right">{blogDetailsData?.visibility === 1 ? "Publike" : blogDetailsData?.visibility === 2 ? "Privat" : blogDetailsData?.visibility === 3 ? "Vetem miqte" : "I Fshire"}</Text>
                        </View>
                    </View>
                </View>
                <View className="bg-oBlack-light gap-2 dark:bg-oBlack border border-white dark:border-black-200 p-2">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold">Shikime</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight"><Text className="text-secondary font-psemibold">{blogDetailsData?.viewCount || 0}</Text> Shikime</Text>
                        </View>
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold text-right">Komente</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight text-right"><Text className="text-secondary font-psemibold">{blogDetailsData?.blogLikes || 0}</Text> Komente</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold">Pelqime</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight"><Text className="text-secondary font-psemibold">{blogDetailsData?.blogLikes || 0}</Text> Pelqime</Text>
                        </View>
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold text-right">Shperndarje</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight text-right"><Text className="text-secondary font-psemibold">{blogDetailsData?.shares || 0}</Text> Shperndarje</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold">Krijuar me</Text>
                            <Text className="text-secondary text-sm font-psemibold">{formatAlbanianDate(blogDetailsData?.createdAt)}</Text>
                        </View>
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold text-right">Titulli</Text>
                            <Text className="text-secondary text-sm font-psemibold text-right">{blogDetailsData?.userTitle}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </>
        )}
    </CustomModal>
    {/* details modal */}

    <CustomModal
        visible={comingSoon}
        onClose={() => setComingSoon(false)}
        onlyCancelButton
        cancelButtonText={"Largo dritaren"}
    >
        <Text className="mb-4 text-oBlack dark:text-white font-psemibold text-xl">Se shpejti</Text>
        <Image 
            source={icons.learning}
            className="size-10"
            tintColor={"#FF9C01"}
            resizeMode='contain'
        />
    </CustomModal>
    </>
  )
}

export default memo(BlogCardComponent)