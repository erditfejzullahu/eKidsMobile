import { View, Text, Platform, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { icons } from '../constants'
import { useRouter } from 'expo-router'
import * as Animatable from "react-native-animatable"

const LearnOnlineTutorCard = ({item}) => {
    const [showAllData, setShowAllData] = useState(false)
    const router = useRouter();
    const date = new Date(item?.whenBecameInstructor).toLocaleDateString("sq-AL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    const handleCardPress = () => {
        router.push(`tutor/${item?.instructorId}`)
    }
  return (
    <TouchableOpacity onPress={handleCardPress} className="bg-oBlack relative border border-black-200 p-4" style={styles.box}>
        <Text className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-md border-b border-l border-black-200 bg-primary text-white font-psemibold text-xs" style={styles.box}>Qe nga <Text className="text-secondary">{date}</Text></Text>
        <Text className="text-white font-psemibold text-lg">{item?.instructorName}</Text>
        <Text className="text-gray-400 font-plight text-sm">{item?.expertise}</Text>
        <View className="flex-row items-center gap-4 mt-4">
            <Image 
                source={{uri: item?.profilePictureUrl}}
                className="h-20 w-20 rounded-md"
                resizeMode='contain'
            />
            <View className="flex-col gap-2">
                <View className="flex-row items-center gap-2">
                    <View>
                        <Image 
                            source={icons.star}
                            tintColor={"#ff9c01"}
                            className="h-4 w-4"
                        />
                    </View>                
                    <View>
                        <Text className="text-gray-400 font-plight text-sm">3.2 Vleresime instruktori</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <View>
                        <Image 
                            source={icons.commitment}
                            tintColor={"#ff9c01"}
                            className="h-4 w-4"
                        />
                    </View>                
                    <View>
                        <Text className="text-gray-400 font-plight text-sm">3.8 Vleresime gjenerale</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <View>
                        <Image 
                            source={icons.students}
                            tintColor={"#ff9c01"}
                            className="h-4 w-4"
                        />
                    </View>                
                    <View>
                        <Text className="text-gray-400 font-plight text-sm">{item?.instructorStudents} Studente</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <View>
                        <Image 
                            source={icons.courses}
                            tintColor={"#ff9c01"}
                            className="h-4 w-4"
                        />
                    </View>                
                    <View>
                        <Text className="text-gray-400 font-plight text-sm">{item?.instructorCourses} Kurse</Text>
                    </View>
                </View>
            </View>
        </View>

        {showAllData && <View className="mt-2 overflow-hidden">
            <Animatable.Text animation="fadeInLeft" numberOfLines={3} className="text-white text-sm font-plight">{item.bio}</Animatable.Text>
        </View>}

        {!showAllData && (<View className="absolute left-0 items-center right-0 -bottom-3" style={styles.box}>
            <TouchableOpacity onPress={() => setShowAllData(true)} className="bg-secondary px-2 py-0.5 rounded-md border border-white">
                <Animatable.Text animation="pulse" iterationCount="infinite" duration={3000} className="font-psemibold text-xs text-white">Shfaq pershkrimin</Animatable.Text>
            </TouchableOpacity>
        </View>)}
    </TouchableOpacity>
  )
}

export default LearnOnlineTutorCard

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