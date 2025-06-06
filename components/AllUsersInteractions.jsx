import { View, Text, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '../constants';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { navigateToMessenger } from '../hooks/useFetchFunction';
import * as Animatable from "react-native-animatable"

const AllUsersInteractions = ({usersData, currentUserData}) => {
    console.log(usersData);
    
    const router = useRouter();
    const [showOptions, setShowOptions] = useState(false)
    const date = new Date(usersData?.lastMessage?.message?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
    });

    const returnLastMessage = () => {

        if(usersData?.lastMessage === null){
            return "Nuk ka bisede aktuale. Fillo biseden tani!"
        }

        if(usersData?.lastMessage?.content !== null){
            return usersData?.lastMessage?.content
        }else if(usersData?.lastMessage?.content === null){
            if(usersData?.lastMessage?.blogId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Blog. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Blog. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.courseId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Kurs. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Kurs. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.lessonId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Leksion. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Leksion. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.quizId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Kuiz. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Kuiz. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.discussionId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Diskutim. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Diskutim. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.instructorCourseId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Kurs Instruktori. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Kurs Instruktori. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.instructorId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Instruktor. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Instruktor. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.instructorLessonId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Leksion Instruktori. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Leksion Instruktori. Vazhdo biseden tani!`
                }
            } else if(usersData?.lastMessage?.onlineMeetingId !== null){
                if(usersData?.lastMessage?.senderUsername === currentUserData?.username){
                    return "Ti e ke derguar nje Takim Online. Vazhdo biseden tani!"
                }else{
                    return `${usersData?.lastMessage?.senderUsername} te ka derguar nje Takim Online. Vazhdo biseden tani!`
                }
            }
        }
    }
  return (
    <TouchableWithoutFeedback onPress={() => setShowOptions(!showOptions)}>
        <TouchableOpacity onLongPress={() => setShowOptions(!showOptions)} delayLongPress={300}
            onPress={() => {setShowOptions(false); navigateToMessenger(router, usersData, currentUserData)}}>
            <Animatable.View 
            iterationCount="infinite"
            duration={1500}
            animation={usersData?.lastMessage?.message?.isRead === false && usersData?.lastMessage?.message?.senderUsername !== currentUserData?.username ? {
                0: {backgroundColor: "#13131a"},
                0.5: {backgroundColor: "rgba(255, 156, 1, 0.4)"},
                1: {backgroundColor: "#13131a"}
            } : undefined}
            style={styles.box} className={`${currentUserData?.username === usersData?.username ? "bg-primary" : "bg-oBlack"} flex-row relative gap-2 items-center justify-between w-full p-4 border rounded-lg border-black-200`}>
                <View className="flex-row items-center gap-4 flex-1">
                    <View>
                        <Image 
                            source={{uri: usersData?.profilePictureUrl || images.testimage}}
                            className="h-16 w-16 rounded-[5px]"
                            resizeMode='cover'
                        />
                    </View>

                    <View className="flex-1">   
                        <Text className="text-white font-psemibold text-lg">{usersData?.firstname} {usersData?.lastname}</Text>
                        <Text className="text-gray-400 text-xs font-plight" numberOfLines={1}>{returnLastMessage()}</Text>
                        <Text className="text-white text-xs font-plight text-right mt-1">{usersData?.lastMessage?.message?.createdAt ? formattedDate : ""}</Text>
                    </View>
                </View>
                <View>
                    <Image 
                        source={icons.chat}
                        className="h-8 w-8"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </View>

                {showOptions && <View className="absolute self-start -left-2 -bottom-2 bg-oBlack border border-black-200 rounded-[5px] p-2" style={styles.box}>
                    <View className="border-b border-black-200">
                        <TouchableOpacity onPress={() => {router.replace(`/users/${usersData?.id}`), setShowOptions(false)}}>
                            <Text className="font-plight text-white text-sm p-1">Vizitoni profilin</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {navigateToMessenger(router, usersData, currentUserData), setShowOptions(false)}}>
                            <Text className="font-plight text-white text-sm p-1">Filloni biseden</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
            </Animatable.View>
        </TouchableOpacity>
    </TouchableWithoutFeedback>
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

export default AllUsersInteractions