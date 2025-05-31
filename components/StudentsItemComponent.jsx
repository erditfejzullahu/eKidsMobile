import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { icons } from '../constants';
import { navigateToMessenger } from '../hooks/useFetchFunction';

const StudentsItemComponent = ({item, currentUserData}) => {
    const router = useRouter();
    const handleContactUser = (item) => {
        const otherUserData = {
            firstname: item.name.split(" ")[0],
            lastname: item.name.split(" ")[1],
            username: item.username,
            profilePictureUrl: item.profilePictureUrl
        }
        navigateToMessenger(router, otherUserData, currentUserData.data.userData)
    }
  return (
    <View className="bg-oBlack border border-black-200 rounded-md p-4 relative" style={styles.box}>
        <View className="flex-row gap-2 items-center" style={styles.box}>
            <View>
                <Image 
                    source={{uri: item?.profilePictureUrl}}
                    className="size-14 border border-black-200"
                    resizeMode='contain'
                />
            </View>
            <View className="flex-1">
                <Text className="text-base font-psemibold text-white" numberOfLines={1}>{item?.name}</Text>
                <Text className="text-xs font-plight text-gray-400" numberOfLines={1}>{item?.email}</Text>
                <Text className="text-xs font-plight text-gray-400" numberOfLines={1}>{item?.username}</Text>
            </View>
        </View>
        {currentUserData?.data?.userData?.id === item.id && <Text className="bg-secondary text-white px-2 py-0.5 absolute right-0 top-0 rounded-bl-md rounded-tr-md border border-white text-xs font-psemibold">Ju</Text>}
        {currentUserData?.data?.userData?.id !== item.id && <TouchableOpacity onPress={() => handleContactUser(item)} className="mt-2 -mb-1 bg-primary px-2 ml-auto py-1.5 border border-black-200 rounded-md  flex-row items-center gap-2">
            <Text className="text-white font-psemibold text-sm">Kontakto</Text>
            <Image
                source={icons.chat}
                className="size-4"
                tintColor={"#ff9c01"}
                resizeMode='contain'
            />
        </TouchableOpacity>}
    </View>
  )
}

export default StudentsItemComponent

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