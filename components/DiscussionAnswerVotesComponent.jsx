import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'

const DiscussionAnswerVotesComponent = ({discussionAnswerData}) => {
  const [discussionAnswerDetails, setDiscussionAnswerDetails] = useState(discussionAnswerData)

  useEffect(() => {
    if(discussionAnswerData){
      setDiscussionAnswerDetails(discussionAnswerData)
    }
  }, [discussionAnswerData])
  
  return (
    <View className="flex-col items-center gap-4">
      <TouchableOpacity className={`border border-black-200 rounded-md p-2 ${discussionAnswerData?.isVotedUp ? "bg-secondary" : "bg-oBlack"}`}>
        <Image
            source={icons.upArrow}
            className={`h-6 w-6 `}
            resizeMode='contain'
            tintColor={"#fff"}
        />
      </TouchableOpacity>
        <Text className="text-white font-psemibold">{discussionAnswerDetails?.votes}</Text>
      <TouchableOpacity className={`border border-black-200 rounded-md p-2 ${discussionAnswerData?.isVotedUp ? "bg-secondary" : "bg-oBlack"}`}>
        <Image 
            source={icons.downArrow}
            className={`h-6 w-6`}
            resizeMode='contain'
            tintColor={"#fff"}
        />
      </TouchableOpacity>
    </View>
  )
}

export default DiscussionAnswerVotesComponent