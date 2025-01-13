import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { Platform } from 'react-native'

const BlogCardInteractions = () => {
  return (
    <View className="flex-row items-center justify-center gap-4 bg-primary mx-4 -mb-4 z-50 border border-black-200 rounded-[5px] " style={styles.box}>
            <View className="border-r pr-1.5 border-black-200 flex-1">
                <TouchableOpacity className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className="text-white font-psemibold text-xs">Pelqeni</Text>
                    <Image
                        source={icons.star}
                        className="w-4 h-4 mb-0.5"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
            <View className="border-r pr-1.5 border-black-200 items-center flex-1 justify-center">
                <TouchableOpacity className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className="text-white font-psemibold text-xs">Komentoni</Text>
                    <Image
                        source={icons.chat}
                        className="w-4 h-4 mb-0.5"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
            <View className="items-center justify-center flex-1">
                <TouchableOpacity className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className="text-white font-psemibold text-xs">Shperndaje</Text>
                    <Image 
                        source={icons.friends}
                        className="w-4 h-4 mb-0.5"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
        </View>
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
export default BlogCardInteractions