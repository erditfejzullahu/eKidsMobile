import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack screenOptions={{gestureEnabled: true, headerShown: false}}>
        <Stack.Screen name='allDiscussions' />
        <Stack.Screen name='[id]' />
    </Stack>
  )
}

export default _layout