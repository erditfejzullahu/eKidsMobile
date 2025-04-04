import { View, Text, Modal, FlatList, Platform, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useTopbarUpdater } from '../navigation/TopbarUpdater'
import Loading from './Loading';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { reqGetAllUserTypes, reqShareToUser } from '../services/fetchingService';
import { icons } from '../constants';
import NotifierComponent from './NotifierComponent';

const ShareToFriends = ({currentUserData, shareType, passedItemId}) => {
    console.log(shareType);
    console.log(passedItemId);
    console.log(currentUserData);
    
    // if(shareType !== "quiz" || shareType !== "course" || shareType !== "lesson"){
    //     return null;
    // }
    
    const {shareOpened, setShareOpened} = useTopbarUpdater();
    const [userFriendLoading, setUserFriendLoading] = useState(false)
    const [quizSelected, setQuizSelected] = useState(null);
    const [userFriendData, setUserFriendData] = useState([])

    const {showNotification: successShare} = NotifierComponent({
        title: `Sapo derguat ${shareType === "quiz" ? "Kuizin" : shareType === "lesson" ? "Leksionin" : shareType === "course" ? "Kursin" : " "} me sukses`,
        description: "Mund te kontrolloni mesazhin e derguar tek biseda me marresin e mesazhit!"
    })

    const {showNotification: errorShare} = NotifierComponent({
        title: "Dicka shkoi gabim",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
    })
    
    const shareToUser = async (receiverUser) => {        
        console.log(passedItemId);
        
        const payload = {
            senderUsername: currentUserData?.username,
            receiverUsername: receiverUser?.username,
            lessonId: shareType === "lesson" ? passedItemId : null,
            quizId: shareType === "quiz" ? passedItemId : null,
            courseId: shareType === "course" ? passedItemId : null 
        }
        const response = await reqShareToUser(shareType === "quiz" ? 1 : shareType === "lesson" ? 2 : shareType === "course" ? 3 : null, payload);
        setShareOpened(false)
        if(response === 200){
            successShare();
        }else{
            errorShare();
        }
    }

    useEffect(() => {
        if(shareOpened){        
          getUserFriends();
        }
      }, [shareOpened])
      
    const getUserFriends = async () => {
        setUserFriendLoading(true)
        const response = await reqGetAllUserTypes(currentUserData?.id, 2)
        if(response){
            console.log(response);
            
            setUserFriendData(response);
        }
        setUserFriendLoading(false)
    }

  return (
    <Modal
        visible={shareOpened}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShareOpened(false)}
    >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <View className="h-[80%] w-[80%] bg-oBlack rounded-[10px] border border-black-200 justify-between" style={styles.box}>
            {userFriendLoading ?
                <View className="flex-1"><Loading /></View>
            : 
                <View className="border-b border-black-200 flex-1">
                    <FlatList
                        scrollEnabled={true}
                        contentContainerStyle={{ gap: 6 }}
                        data={userFriendData}
                        keyExtractor={(item) => `userfriends-${item.id}`}
                        ListHeaderComponent={() => (
                            <>
                            <View className="mx-auto my-4 border-b border-black-200 bg-oBlack rounded-b-[10px]" style={styles.box}>
                                <Text className="text-white font-psemibold text-2xl text-center border-b border-secondary self-start">Lista e miqesise</Text>
                            </View>
                            <View className="ml-2">
                                <Text className="text-xs text-white font-plight">Shperndaje tek:</Text>
                            </View>
                            </>
                        )}
                        renderItem={({ item }) => (
                            <View className="border-b border-t p-2 border-black-200 flex-row gap-2 bg-oBlack" style={styles.box}>
                                <View>
                                    <Image
                                        source={{uri: item?.profilePictureUrl}}
                                        className="h-14 w-14 border border-black-200 rounded-[10px]"
                                        resizeMode='contain'
                                    />
                                </View>
                                <View className="flex-row items-center justify-between flex-1 relative">
                                    <View>
                                        <Text className="text-white font-psemibold text-lg mb-1">{item?.firstname} {item?.lastname}</Text>
                                        <Text className="text-gray-400 font-plight text-xs">Student</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => shareToUser(item)} className="mr-2">
                                            <Image
                                                source={icons.send}
                                                className="h-6 w-6"
                                                resizeMode='contain'
                                                tintColor={"#FF9C01"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>}
                <View className="h-[60px]">
                    <TouchableOpacity className="bg-oBlack border-t items-center justify-center flex-1 border-black-200" style={styles.box} onPress={() => { setShareOpened(false), setUserFriendData([]) }}>
                        <Text className="text-sm font-psemibold text-white">Largoni dritaren</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
  })
export default ShareToFriends