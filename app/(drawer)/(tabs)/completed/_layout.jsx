import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack 
        screenOptions={{gestureEnabled: true, headerShown: false}}
    />
  )
}

export default _layout