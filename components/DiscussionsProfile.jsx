import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import { memo, useCallback, useEffect, useState } from 'react'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"
import { getUserCreatedBlogsOrDiscussions } from '../services/fetchingService'
import DiscussionsCard from './DiscussionsCard'
import Loading from './Loading'
import { RefreshControl } from 'react-native'
import EmptyState from './EmptyState'
import { useShadowStyles } from '../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const DiscussionsProfile = ({userData, otherSection = false}) => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const [openModal, setOpenModal] = useState(false)
    const [discussionsLoading, setDiscussionsLoading] = useState(false)
    const [discussionsData, setDiscussionsData] = useState([])
    
    const getDiscussions = useCallback(async () => {
        setDiscussionsLoading(true)
        const response = await getUserCreatedBlogsOrDiscussions("discussions", userData?.data?.userData?.id || userData?.userId)
        
        if(response){
            setDiscussionsData(response)
        }else{
            setDiscussionsData([])
        }
        setDiscussionsLoading(false)
    }, [setDiscussionsLoading, setDiscussionsData, getUserCreatedBlogsOrDiscussions, userData])

    useEffect(() => {
      if(openModal){
        getDiscussions();
      }
    }, [openModal])
    

  return (
    <>
        <TouchableOpacity className="absolute top-4 right-4 bg-oBlack-light dark:bg-oBlack p-3 border border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle} onPress={() => setOpenModal(true)}>
            <Animatable.Image
                animation="pulse"
                duration={1000}
                iterationCount="infinite"
                source={icons.discussion}
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
                    {discussionsLoading ?
                    <View className="flex-1"><Loading /></View>
                    :
                    <View className="border-b border-white dark:border-black-200 flex-1">
                        <FlatList
                            refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={discussionsLoading} onRefresh={async () => await getDiscussions()}/>}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{gap: 24, paddingLeft: 16, paddingRight: 16}}
                            data={discussionsData?.discussions}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={() => (
                                <View className="mx-auto my-4 border-b border-gray-200 px-4 dark:border-black-200 bg-oBlack-light dark:bg-oBlack rounded-b-[10px] -mb-2" style={shadowStyle}>
                                    <Text className="text-oBlack dark:text-white font-psemibold text-2xl text-center border-b border-secondary self-start">{otherSection ? `Diskutimet e ${userData?.instructorName?.split(" ")[0]}` : "Diskutimet tua"}</Text>
                                </View>
                            )}
                            renderItem={({ item }) => (
                                <DiscussionsCard discussion={item} discussionComponentSection={true} closeDiscussionModal={() => setOpenModal(false)}/>
                            )}
                            ListEmptyComponent={() => (
                                <View className="border border-gray-200 dark:border-black-200 py-3 pb-2" style={shadowStyle}>
                                    <EmptyState
                                        title={`${otherSection ? `${userData?.instructorName?.split(" ")[0]} nuk ka bere ende diskutime` : "Nuk keni bere ende diskutime"}`}
                                        subtitle={"Nese mendoni qe eshte gabim, provoni perseri apo kontaktoni Panelin e Ndihmes!"}
                                        isBookMarkPage
                                        buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                                        buttonTitle={"Krijo diskutime"}
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
                        <TouchableOpacity className="bg-oBlack-light dark:bg-oBlack rounded-b-md border-t items-center justify-center flex-1 border-gray-200 dark:border-black-200" style={shadowStyle} onPress={() => { setOpenModal(false), setDiscussionsData([]) }}>
                            <Text className="text-sm font-psemibold text-oBlack dark:text-white">Largoni dritaren</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
  )
}

export default memo(DiscussionsProfile)