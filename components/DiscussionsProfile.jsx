import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"
import { getUserCreatedBlogsOrDiscussions } from '../services/fetchingService'
import DiscussionsCard from './DiscussionsCard'
import Loading from './Loading'
import { RefreshControl } from 'react-native'
import EmptyState from './EmptyState'

const DiscussionsProfile = ({userData, otherSection = false}) => {
    const [openModal, setOpenModal] = useState(false)
    const [discussionsLoading, setDiscussionsLoading] = useState(false)
    const [discussionsData, setDiscussionsData] = useState([])
    
    const getDiscussions = async () => {
        setDiscussionsLoading(true)
        const response = await getUserCreatedBlogsOrDiscussions("discussions", userData?.data?.userData?.id || userData?.userId)
        
        if(response){
            setDiscussionsData(response)
        }else{
            setDiscussionsData([])
        }
        setDiscussionsLoading(false)
    }

    useEffect(() => {
      if(openModal){
        getDiscussions();
      }
    }, [openModal])
    

  return (
    <>
        <TouchableOpacity className="absolute top-4 right-4 bg-oBlack p-3 border border-black-200 rounded-md" style={styles.box} onPress={() => setOpenModal(true)}>
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
                <View className="h-[90%] w-[90%] bg-oBlack rounded-[10px] border border-black-200 justify-between" style={styles.box}>
                    {discussionsLoading ?
                    <View className="flex-1"><Loading /></View>
                    :
                    <View className="border-b border-black-200 flex-1">
                        <FlatList
                            refreshControl={<RefreshControl refreshing={discussionsLoading} onRefresh={async () => await getDiscussions()}/>}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{gap: 24, paddingLeft: 16, paddingRight: 16}}
                            data={discussionsData.discussions || []}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={() => (
                                <View className="mx-auto my-4 border-b border-black-200 bg-oBlack rounded-b-[10px] -mb-2" style={styles.box}>
                                    <Text className="text-white font-psemibold text-2xl text-center border-b border-secondary self-start">{otherSection ? `Diskutimet e ${userData?.instructorName?.split(" ")[0]}` : "Diskutimet tua"}</Text>
                                </View>
                            )}
                            renderItem={({ item }) => (
                                <DiscussionsCard discussion={item} discussionComponentSection={true} closeDiscussionModal={() => setOpenModal(false)}/>
                            )}
                            ListEmptyComponent={() => (
                                <EmptyState
                                    title={`${otherSection ? `${userData?.instructorName?.split(" ")[0]} nuk ka bere ende diskutime` : "Nuk keni bere ende diskutime"}`}
                                    subtitle={"Nese mendoni qe eshte gabim, provoni perseri apo kontaktoni Panelin e Ndihmes!"}
                                    showButton={false}
                                    isSearchPage={true}
                                />
                            )}
                        />
                    </View>
                    }
                    <View className="h-[60px]">
                        <TouchableOpacity className="bg-oBlack border-t items-center justify-center flex-1 border-black-200" style={styles.box} onPress={() => { setOpenModal(false), setDiscussionsData([]) }}>
                            <Text className="text-sm font-psemibold text-white">Largoni dritaren</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
  )
}

export default DiscussionsProfile


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