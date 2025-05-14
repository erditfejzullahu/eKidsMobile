import { View, Text, Image } from 'react-native'
import React from 'react'

const STDINProfileFirstSection = ({data}) => {
  return (
    <View className="relative items-center justify-center mt-20">
        <View className="gap-4">
            <View className="rounded-lg p-2 bg-secondary self-start mx-auto">
                <Image
                    source={{uri: data?.profilePictureUrl}}
                    className="h-10 w-10 rounded-md"
                    resizeMode='contain'
                />
            </View>
            <View>
                <Text className="text-xl font-psemibold text-white text-center mb-1">{data?.instructorName}</Text>
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{data?.email}</Text>
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">Instruktor</Text>
            </View>
        </View>
    </View>
  )
}

export default STDINProfileFirstSection