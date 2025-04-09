import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const DiscussionTagsLayout = ({item}) => {
  return (
    <TouchableOpacity className="bg-secondary px-2 py-1 rounded-md self-start">
        <Text className="text-white font-psemibold">{item.title}</Text>
    </TouchableOpacity>
  ) 
}

export default DiscussionTagsLayout