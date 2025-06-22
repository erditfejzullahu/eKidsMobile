import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Modal, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"
import Loading from './Loading'
import BlogCardComponent from './BlogCardComponent'
import { getUserCreatedBlogsOrDiscussions } from '../services/fetchingService'
import EmptyState from './EmptyState'
import { useShadowStyles } from '../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const BlogsProfile = ({userData, otherSection = false, otherData = {}}) => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const [openModal, setOpenModal] = useState(false)
    const [blogsLoading, setBlogsLoading] = useState(false)
    const [blogsData, setBlogsData] = useState([])
    
    const onRefresh = async () => {
        await getBlogs();
    }

    const getBlogs = async () => {
        setBlogsLoading(true)
        const response = await getUserCreatedBlogsOrDiscussions("blogs", otherSection ? otherData?.userId : userData?.data?.userData?.id)
        if(response){
            setBlogsData(response)
        }else{
            setBlogsData([])
        }
        setBlogsLoading(false)
    }

    useEffect(() => {
      if(openModal){
        getBlogs()
      }
    }, [openModal])
    
  return (
    <>
    <TouchableOpacity className="absolute top-4 left-4 bg-oBlack-light dark:bg-oBlack p-3 border border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle} onPress={() => setOpenModal(true)}>
        <Animatable.Image
            animation="pulse"
            duration={1000}
            iterationCount="infinite"
            source={icons.blogs}
            className="h-8 w-8"
            resizeMode='contain'
            tintColor={"#ff9c01"}
        />
    </TouchableOpacity>
    <Modal 
        visible={openModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setOpenModal(false)}
    >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <View className="h-[90%] w-[90%] bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 justify-between" style={shadowStyle}>
                {blogsLoading ?
                <View className="flex-1"><Loading /></View>
                :
                <View className="border-b border-white dark:border-black-200 flex-1 px-4">
                    <FlatList 
                        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={blogsLoading} onRefresh={onRefresh}/>}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{gap: 24}}
                        data={blogsData.data || []}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={() => (
                            <View className="mx-auto my-4 border-b border-gray-200 dark:border-black-200 bg-oBlack-light px-4 dark:bg-oBlack rounded-b-[10px] -mb-2" style={shadowStyle}>
                                <Text className="text-oBlack dark:text-white font-psemibold text-2xl text-center border-b border-secondary self-start">{otherSection ? `Blogjet e ${otherData?.instructorName?.split(" ")[0]}` : "Blogjet tua"}</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <BlogCardComponent blog={item} userData={userData}/>
                        )}
                        ListEmptyComponent={() => (
                            <View className="border border-gray-200 dark:border-black-200 py-3 pb-2" style={shadowStyle}>
                            <EmptyState 
                                title={`${otherSection ? `${otherData?.instructorName?.split(" ")[0]} nuk ka postuar ende` : "Nuk keni postuar ende blogs"}`}
                                subtitle={"Nese mendoni qe eshte gabim, provoni perseri apo kontaktoni Panelin e Ndihmes!"}
                                isBookMarkPage
                                buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                                buttonTitle={"Krijo blogje"}
                            />
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View/>
                        )}
                    />
                </View>
                }
                <View className="h-[60px]">
                    <TouchableOpacity className="bg-oBlack-light dark:bg-oBlack rounded-b-md border-t items-center justify-center flex-1 border-gray-200 dark:border-black-200" style={shadowStyle} onPress={() => { setOpenModal(false), setBlogsData([]) }}>
                        <Text className="text-sm font-psemibold text-oBlack dark:text-white">Largoni dritaren</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
    </>
  )
}

export default BlogsProfile

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
});