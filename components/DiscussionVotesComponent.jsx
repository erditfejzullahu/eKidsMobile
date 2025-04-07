import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { Platform } from 'react-native'
import { currentUserID } from '../services/authService'
import { handleDiscussionVoteFunc } from '../services/fetchingService'

const DiscussionVotesComponent = ({discussionData}) => {
    const [voteDetails, setVoteDetails] = useState(null)
    const [actualVotes, setActualVotes] = useState(null)


    const handleDiscussionVote = async (voteType) => {
        // voteType as 0(voteup) or 1(votedown)
        const userId = await currentUserID();
        const payload = {
            userId: userId,
            discussionId: discussionData.id,
            discussionVoteType: voteType
        }
        const response = await handleDiscussionVoteFunc(payload)
        if(response){
            if(response.voteResponse === 0){
            if(voteDetails){
                //to remove vote that is made (decrease by 2) //check this logic in backend too
            }else{
                //to add one vote(increase by 1)
            }
            }else if(response.voteResponse === 1){
            if(voteDetails){
                //to remove vote that is made(increase)
            }else{
                //to add one vote(decrase)
            }
            }
        }
    }

    useEffect(() => {
      setVoteDetails(discussionData?.voteDetails)
      setActualVotes(discussionData?.votes)
    }, [discussionData])
    
  return (
    <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => handleDiscussionVote(0)} className={`${(voteDetails === null || !voteDetails?.isVotedUp) ? "bg-oBlack" : "bg-secondary"} border border-black-200 p-2 rounded-md`} style={styles.box}>
        <Image 
            source={icons.upArrow}
            className="h-8 w-8"
            resizeMode='contain'
            tintColor={"#fff"}
        />
        </TouchableOpacity>

        <Text className="text-xl font-psemibold text-white">{actualVotes} <Text className="text-gray-400 text-sm font-plight">{actualVotes === 0 || actualVotes > 1 ? "Vota" : "Vote"}</Text></Text>

        <TouchableOpacity onPress={() => handleDiscussionVote(1)} className={`${(voteDetails === null || !voteDetails?.isVotedDown) ? "bg-oBlack" : "bg-secondary"} border border-black-200 p-2 rounded-md`} style={styles.box}>
        <Image 
            source={icons.downArrow}
            className="h-8 w-8"
            resizeMode='contain'
            tintColor={"#fff"}
        />
        </TouchableOpacity>
    </View>
  )
}

export default DiscussionVotesComponent

const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        })
    },
});