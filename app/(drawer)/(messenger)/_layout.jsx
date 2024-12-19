import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <>
    <Stack screenOptions={{gestureEnabled: true, headerShown: false}}>
        {/* <Stack.Screen name="all-messages" options={{headerShown: false}} /> */}
        
    </Stack>
    </>
  )
}

export default _layout