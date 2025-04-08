import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { currentUserID } from '../services/authService'
import { handleDiscussionAnswerVoteFunc } from '../services/fetchingService'

const DiscussionAnswerVotesComponent = ({discussionAnswerData}) => {
  const [discussionAnswerDetails, setDiscussionAnswerDetails] = useState(discussionAnswerData)
  // console.log(discussionAnswerData, ' discussionanswervotescomponent');
  
  const handleAnswerVote = async (type) => {
    const userId = await currentUserID();
    const payload = {
      userId,
      discussionAnswerId: discussionAnswerDetails.answerId,
      discussionId: discussionAnswerDetails.discussionId,
      discussionVoteType: type
    }
    
    const response = await handleDiscussionAnswerVoteFunc(payload)
    if(response){
      if(response.voteResponse === 0){
        if(discussionAnswerDetails?.isVotedUp && !discussionAnswerDetails?.isVotedDown){
          //answer is voted up it has to be removed and vote numbers to be updated
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedUp: false,
            isVotedDown: false,
            votes: prevData.votes - 1
          }))
        }else if(!discussionAnswerDetails?.isVotedUp && discussionAnswerDetails?.isVotedDown){
          //answer is not voted up it has to be added and number votes to be updated
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedUp: true,
            isVotedDown: false,
            votes: prevData.votes + 2
          }))
        }else if(!discussionAnswerDetails?.isVotedUp && !discussionAnswerDetails?.isVotedDown){
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedDown: false,
            isVotedUp: true,
            votes: prevData.votes + 1
          }))
        }
      }else if(response.voteResponse === 1){
        if(discussionAnswerDetails?.isVotedUp && !discussionAnswerDetails?.isVotedDown){
          //answer is voted up it has to be removed and vote numbers to be updated
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedUp: false,
            isVotedDown: true,
            votes: prevData.votes - 2
          }))
        }else if(!discussionAnswerDetails?.isVotedUp && discussionAnswerDetails?.isVotedDown){
          //answer is not voted up it has to be added and number votes to be updated
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedUp: false,
            isVotedDown: false,
            votes: prevData.votes + 1
          }))
        }else if(!discussionAnswerDetails?.isVotedUp && !discussionAnswerDetails?.isVotedDown){
          setDiscussionAnswerDetails((prevData) => ({
            ...prevData,
            isVotedDown: true,
            isVotedUp: false,
            votes: prevData.votes - 1
          }))
        }
      }
    }
  }

  useEffect(() => {
    if(discussionAnswerData){
      setDiscussionAnswerDetails(discussionAnswerData)
    }
  }, [discussionAnswerData])
  
  return (
    <View className="flex-col items-center gap-4">
      <TouchableOpacity className={`border border-black-200 rounded-md p-2 ${discussionAnswerDetails?.isVotedUp ? "bg-secondary" : "bg-oBlack"}`} onPress={() => handleAnswerVote(0)}>
        <Image
            source={icons.upArrow}
            className={`h-6 w-6 `}
            resizeMode='contain'
            tintColor={"#fff"}
        />
      </TouchableOpacity>
        <Text className="text-white font-psemibold">{discussionAnswerDetails?.votes}</Text>
      <TouchableOpacity className={`border border-black-200 rounded-md p-2 ${discussionAnswerDetails?.isVotedDown ? "bg-secondary" : "bg-oBlack"}`} onPress={() => handleAnswerVote(1)}>
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