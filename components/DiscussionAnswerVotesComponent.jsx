import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const DiscussionAnswerVotesComponent = ({discussionAnswerData}) => {
  return (
    <View className="flex-col items-center gap-4">
        <Image
            source={icons.upArrow}
            className="h-10 w-10 border border-black-200 rounded-md p-2"
            resizeMode='contain'
            tintColor={"#fff"}
        />
        <Text className="text-white font-psemibold">15</Text>
        <Image 
            source={icons.downArrow}
            className="h-10 w-10 border border-black-200 rounded-md p-2"
            resizeMode='contain'
            tintColor={"#fff"}
        />
    </View>
  )
}

export default DiscussionAnswerVotesComponent