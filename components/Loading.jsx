import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

const Loading = () => {
  const {colorScheme} = useColorScheme();
  return (
    <View className="flex-1 justify-center items-center bg-primary-light dark:bg-primary">
        <ActivityIndicator size="large" color="#ff9c01" />
        <Text className="text-oBlack dark:text-white font-psemibold mt-4">Ju lutem prisni...</Text>
        <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
      </View>
  )
}

export default Loading