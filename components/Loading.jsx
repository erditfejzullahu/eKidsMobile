import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ff9c01" />
        <Text className="text-white font-psemibold mt-4">Ju lutem prisni...</Text>
      </View>
  )
}

export default Loading