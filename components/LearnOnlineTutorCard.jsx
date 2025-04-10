import { View, Text, Platform, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { icons } from '../constants'

const LearnOnlineTutorCard = ({item}) => {
  return (
    <TouchableOpacity className="bg-oBlack border border-black-200 p-4" style={styles.box}>
        <Text className="text-white font-psemibold text-lg">{item.name}</Text>
        <Text className="text-gray-400 font-plight text-sm">{item.expertise}</Text>
        <View className="flex-row items-center gap-4 mt-4">
            <Image 
                source={{uri: item.image}}
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
                        <Text className="text-gray-400 font-plight text-sm">{item.rating} Vleresime instruktori</Text>
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
                        <Text className="text-gray-400 font-plight text-sm">{item.rating} Vleresime gjenerale</Text>
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
                        <Text className="text-gray-400 font-plight text-sm">{item.totalStudents} Studente</Text>
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
                        <Text className="text-gray-400 font-plight text-sm">{item.courses} Kurse</Text>
                    </View>
                </View>
            </View>
        </View>

        <View className="mt-2">
            <Text numberOfLines={3} className="text-white text-sm font-plight">{item.bio}</Text>
        </View>
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