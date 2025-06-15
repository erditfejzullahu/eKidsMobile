import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const AllTagsLayoutForDiscussionOrBlogs = ({item, discussionSection = true}) => {
  const handleRedirection = () => {
    
  }
  return (
    <TouchableOpacity className="bg-secondary px-2 py-1 rounded-md self-start" onPress={() => handleRedirection(item)}>
        <Text className="text-white font-psemibold">{discussionSection ? item.title : item.name}</Text>
    </TouchableOpacity>
  ) 
}

export default AllTagsLayoutForDiscussionOrBlogs