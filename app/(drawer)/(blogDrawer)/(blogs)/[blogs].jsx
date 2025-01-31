import { View, Text, ScrollView, RefreshControl, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { icons } from '../../../../constants';

const Blogs = () => {
    const {blogs, userId, userPhoto} = useLocalSearchParams();
    
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = () => {

    }

    useEffect(() => {
      //fetch data
    }, [blogs])
    
  return (
    <ScrollView 
      refreshControl={< RefreshControl refreshin={isRefreshing} onRefresh={onRefresh}/>}
      className="bg-primary"
    >
      <View className="bg-oBlack border-b border-t border-black-200 flex-row items-center" style={styles.box}>
        <View className="border-r border-black-200 p-2 flex-[0.25] items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image 
              source={icons.leftArrow}
              className="w-6 h-6"
              resizeMode='contain'
              tintColor={"#ff9c01"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row items-center gap-2 p-2 justify-center border-r border-black-200">
          <Text className="text-white font-psemibold text-lg">Diskutimi</Text>
          <Image 
            source={icons.star}
            className="h-4 w-4"
            tintColor={"#ff9c01"}
            resizeMode='contain'
          />
        </View>
        <View className="flex-[0.25] p-2 items-center">
          <TouchableOpacity onPress={() => router.replace(`(profiles)/${userId}`)}>
            <Image 
              source={{uri: userPhoto}}
              className="w-10 h-10 rounded-full border border-black-200"
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
export default Blogs