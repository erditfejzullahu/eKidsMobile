import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Platform } from 'react-native'
import { icons, images } from '../constants'

const OnlineClassesCard = ({classes}) => {
  return (
    <View className="relative p-4 bg-oBlack border rounded-md border-black-200 pb-10" style={styles.box}>
        {/* absolute */}
        <View className="absolute -top-2 z-20 -right-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
            <Text className="text-white font-psemibold text-sm">{classes.category}</Text>
        </View>
        <View className="absolute -left-2 -top-2 flex-row gap-2 p-2 rounded-md border border-black-200 items-center bg-primary z-20 max-w-[200px]" style={styles.box}>
            <Image 
                source={icons.profile}
                className="h-12 w-12 border border-black-200 rounded-sm p-2"
                resizeMode='contain'
            />
            <View>
                <Text className="text-white font-psemibold text-md">{classes.instructor}</Text>
                <Text className="text-gray-400 text-xs font-plight">Instruktor</Text>
            </View>
        </View>
        {/* absolute */}

        <View className="h-[120px] border border-black-200">
            <Image 
                source={images.testimage}
                className="h-full w-full"
                resizeMode='cover'
            />
        </View>
        
        <Text className="text-white font-psemibold text-xl mt-4">{classes.className}</Text>
        <Text numberOfLines={4} className="text-gray-400 text-xs font-plight">{classes.description}</Text>
        
        <View className="absolute -bottom-2 z-20 -left-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
            <Text className="text-white font-psemibold text-xs">Niveli <Text className="text-secondary">Fillestar</Text></Text>
        </View>
        <View className="absolute -bottom-2 z-20 -right-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
            <Text className="text-white font-psemibold text-xs"><Text className="text-secondary">{classes.enrolledStudents}</Text> Studente duke shfletuar</Text>
        </View>
    </View>
  )
}

export default OnlineClassesCard
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