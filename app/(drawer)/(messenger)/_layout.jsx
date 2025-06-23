import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

const _layout = () => {
  const {colorScheme} = useColorScheme();
  return (
    <>
    <Stack screenOptions={{gestureEnabled: true, headerShown: false}}>
        {/* <Stack.Screen name="all-messages" options={{headerShown: false}} /> */}
        
    </Stack>
    <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
    </>
  )
}

export default _layout