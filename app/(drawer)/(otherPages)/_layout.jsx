import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Topbar from '../../../components/Topbar'

const _layout = ({children}) => {
  return (
    <>
    <Stack>
      {/* <Stack.Screen name="index" options={{ title: 'Home' }} /> */}
      <Stack.Screen name="all-quizzes" options={{ headerShown: false }} />
      <Stack.Screen name="my-quizzes" options={{headerShown: false}} />
      {/* Add more screens here as needed */}
    </Stack>
    {children}
    </>
  )
}

export default _layout