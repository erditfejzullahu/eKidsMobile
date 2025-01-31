import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Blogs = () => {
    const {blogs} = useLocalSearchParams();
    
  return (
    <View>
      <Text>Blogs</Text>
    </View>
  )
}

export default Blogs