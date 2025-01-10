import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const profile = () => {
  return (
    <Redirect href={"(tabs)/profile"}/>
  )
}

export default profile