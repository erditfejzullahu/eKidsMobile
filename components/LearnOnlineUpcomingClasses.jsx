import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Platform } from 'react-native'
import { icons, images } from '../constants'

const LearnOnlineUpcomingClasses = () => {
  return (
    <TouchableOpacity className="bg-oBlack border border-black-200 p-4" style={styles.box}>
        <Text className="text-white font-psemibold text-lg">Kursi testues</Text>
        <View className="flex-row items-center gap-2 mt-2">
            <View className="flex-1 border-r border-black-200">
                <Image 
                    source={images.testimage}
                    className="w-32 h-32 rounded-md"
                    resizeMode='cover'
                />
            </View>
            <View className="gap-4 flex-1">
                <View className="bg-primary p-2 rounded-md border border-black-200" style={styles.box}>
                    <Text className="text-white text-sm font-plight">Tutori</Text>
                    <Text className="font-psemibold text-sm text-secondary mb-2">Erdit Fejzullahu</Text>
                </View>
                <View className="flex-row items-center gap-4 bg-primary p-2 rounded-md border border-black-200" style={styles.box}>
                    <View>
                        <View className="flex-row items-center gap-1"><Text className="text-white font-plight text-sm">Fillon</Text><Image source={icons.oldest} className="h-4 w-4" resizeMode='contain' tintColor={"#FF9C01"}/></View>
                        <Text className="text-secondary text-base font-psemibold">9:30</Text>
                    </View>
                    <View>
                        <View className="flex-row items-center gap-1"><Text className="text-white font-plight text-sm">Mbaron</Text><Image source={icons.oldest} className="h-4 w-4" resizeMode='contain' tintColor={"#FF9C01"}/></View>
                        <Text className="text-secondary text-base font-psemibold">9:30</Text>
                    </View>
                </View>
            </View>            
        </View>
        <View className="mt-2">
            <Text className="text-white font-psemibold text-base">Leksioni i sotem pershkrim apo jo</Text>
            <View className="bg-primary p-2 border border-black-200 rounded-md mt-2" style={styles.box}>
                <Text className="text-white font-plight text-sm">Linku i takimit</Text>
                <Text className="text-secondary font-plight text-sm underline">https://erditfejzullahu.com</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default LearnOnlineUpcomingClasses

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