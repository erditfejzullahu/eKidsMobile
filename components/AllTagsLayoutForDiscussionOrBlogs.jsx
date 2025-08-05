import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo, useCallback } from 'react'

const AllTagsLayoutForDiscussionOrBlogs = ({item, discussionSection, tagClicked}) => {
  // console.log(discussionSection,  ' discussionsection');
  
  const handleRedirection = useCallback((item) => {
    if(discussionSection){
      tagClicked({discussion: true, id: item.id, name: item.title})
    }else{
      tagClicked({discussion: false, id: item.id, name: item.name})
    }
  }, [tagClicked, discussionSection])

  return (
    <TouchableOpacity className="bg-secondary px-2 py-1 rounded-md self-start" onPress={() => handleRedirection(item)}>
        <Text className="text-white font-psemibold">{discussionSection ? item.title : item.name}</Text>
    </TouchableOpacity>
  ) 
}

export default memo(AllTagsLayoutForDiscussionOrBlogs)