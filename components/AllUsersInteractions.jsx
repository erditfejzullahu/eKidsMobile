import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { icons, images } from '../constants';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

const AllUsersInteractions = ({usersData, currentUserData}) => {
    const router = useRouter();

    // console.log(usersData, 'asdasdasdasdasd');
    
  return (
    <TouchableOpacity 
        onPress={() => router.push(
            {pathname: `(messenger)/${usersData?.id}`, params: {receiverFirstname: usersData?.firstname, receiverUsername: usersData?.username, receiverLastname: usersData?.lastname, receiverProfilePic: usersData?.profilePictureUrl, currentUserFirstName: currentUserData?.firstname, currentUserLastname: currentUserData?.lastname, currentUserProfilePic: currentUserData?.profilePictureUrl, currentUserUsername: currentUserData?.username}})}>
        <View style={styles.box} className="bg-oBlack flex-row gap-2 items-center justify-between w-full p-4 border rounded-lg border-black-200">
            <View className="flex-row items-center gap-4 flex-1">
                <View>
                    <Image 
                        source={images.testimage}
                        className="h-16 w-16 rounded-[5px]"
                        resizeMode='cover'
                    />
                </View>

                <View className="flex-1">   
                    <Text className="text-white font-psemibold text-lg">{usersData?.firstname} {usersData?.lastname}</Text>
                    <Text className="text-gray-400 text-xs font-plight" numberOfLines={1}>Mesazhi i fundit</Text>
                    <Text className="text-white text-xs font-plight text-right mt-1">21 Jan, 2000</Text>
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
        </View>
    </TouchableOpacity>
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