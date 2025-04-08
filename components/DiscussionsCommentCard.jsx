import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import { icons } from '../constants'
import _ from 'lodash'
import DiscussionAnswerVotesComponent from './DiscussionAnswerVotesComponent'
import RenderHTML from 'react-native-render-html'
import * as Animatable from "react-native-animatable"
import { createDiscussionAnswerAsync } from '../services/fetchingService'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'

const DiscussionsCommentCard = ({item}) => {
    console.log(item, ' commentcard');
    const [replyContent, setReplyContent] = useState("")
    const [openReply, setOpenReply] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    
    const flatReplies = _.flattenDeep(item.replies)
    // console.log(flatReplies);
    const date = new Date(item?.createdAt).toLocaleDateString("sq-AL", {
        day: "2-digit",
        month: "short",
        year: "2-digit"
    }) 
    const {width} = useWindowDimensions();

    const {showNotification: unsuccessComment} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri apo kontakotni Panelin e Ndihmes!",
        alertType: "warning"
    })

    const {showNotification: threeCharUnsuccess} = NotifierComponent({
        title: "Gabim",
        description: "Shkruani replikim me te gjate se 3 karaktere",
        alertType: "warning"
    })

    const makeReplyComment = async () => {
        if(replyContent.length < 3){
            threeCharUnsuccess()
            return;
        }
        setReplyLoading(true)
        const userId = await currentUserID();
        const payload = {
            discussionId: item.discussionId,
            discussionAnswerContent: replyContent,
            dicsussionFile: null,
            userId,
            parentId: item.answerId
        }
        const response = await createDiscussionAnswerAsync(payload)
        if(response){
            setReplyContent("")
            setOpenReply(false)
            //success comment added // have to add it to state
        }else{
            unsuccessComment()
        }
        setReplyLoading(false)
    }
    
    
  return (
    <>
    <View className="bg-oBlack p-4 border-t border-b border-black-200 gap-4 z-50" style={styles.box}>
        <View className="flex-row gap-2" >

        <DiscussionAnswerVotesComponent discussionAnswerData={item}/>

        <ScrollView className="max-h-[200px] h-full">
            <RenderHTML
                tagsStyles={{
                span: {color:"white", fontFamily: 'Poppins-Light', marginTop:"0px", marginBottom: "5px"},
                h1: {color:"white", fontFamily: 'Poppins-Black', marginTop:"1.5em", marginBottom: "0.5em"},
                h2: {color:"white", fontFamily: 'Poppins-Bold', marginTop:"1.25em", marginBottom: "0.75em"},
                h3: {color:"white", fontFamily: 'Poppins-Medium', marginTop: "1em", marginBottom: "0.5em"},
                h4: {color:"white", fontFamily: "Poppins-Medium", marginTop: "0.75em", marginBottom: "0.5em"},
                h5: {color:"white", fontFamily:"Poppins-Regular", marginTop:"0.5em", marginBottom: "0.25em"},
                p: {color:"#9ca3af", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0px", marginBottom: "10px"},
                strong: {color:"white", fontFamily: "Poppins-Bold", fontSize: 12},
                li: {color:"white", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0.25em", marginBottom: "0.25em"},
                ol: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12,  marginTop: "1em", marginBottom: "1em"},
                ul: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12, marginTop: "1em", marginBottom: "1em"},
                }}
                contentWidth={width}
                source={{html: item.discussionAnswerContent}}
                classesStyles={{ //for classes exmpl yellow clr
                special: { color: 'green', fontStyle: 'italic' },
                }}
                systemFonts={['Poppins-Black', 'Poppins-Bold', 'Poppins-ExtraBold', 'Poppins-Light', 'Poppins-Medium', 'Poppins-Regular', 'Popping-SemiBold']}
            />
            {/* <Text className="text-white text-sm font-plight">{item.discussionAnswerContent}</Text> */}
        </ScrollView>
        </View>
        <View className="flex-row items-end justify-between">
            <TouchableOpacity className="flex-row items-center gap-1 border border-black-200 rounded-md bg-primary px-3 py-1.5" onPress={() => setOpenReply(!openReply)}>
                <Text className="text-white font-psemibold text-sm">Repliko</Text>
                <Image 
                    source={icons.chat}
                    className="h-4 w-4"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
                <View className="border border-black-200 rounded-md p-3">
                    <Image 
                        source={icons.profile}
                        className="h-6 w-6"
                        resizeMode='contain'
                    />
                </View>
                <View className="flex-col">
                    <Text className="text-white font-psemibold text-sm text-right">{item.userName}</Text>
                    <Text className="text-gray-400 text-xs font-plight text-right">{date}</Text>
                </View>
            </View>
        </View>
    </View>
    {openReply && <Animatable.View animation="bounceIn" className="bg-primary border-b border-l -mt-2  border-r border-black-200 mx-auto w-[90%] p-4 flex-row items-end gap-1.5 rounded-b-md" style={styles.box}>
        <TextInput 
            className="border-b border-black-200 text-sm font-plight text-white rounded-md placeholder:font-plight bg-primary p-2 flex-1 placeholder:text-gray-400 placeholder:text-sm"
            placeholder={`Repliko tek ${item.userName}`}
            multiline
            value={replyContent}
            onChangeText={(e) => setReplyContent(e)}
        />
        <TouchableOpacity onPress={makeReplyComment} disabled={replyLoading} className="p-2 border border-black-200 rounded-md bg-oBlack" style={styles.box}>
            <Image 
                source={icons.send}
                className="h-4 w-4"
                tintColor={"#ff9c01"}
                resizeMode='contain'
            />
        </TouchableOpacity>
    </Animatable.View>}
    {flatReplies.length > 0 && <Animatable.View animation="fadeInLeft" duration={700} className="bg-primary border border-black-200 rounded-md w-[90%] mx-auto p-4 -mt-2.5" style={styles.box}>
        {flatReplies.map((reply,idx) => {
            const replyDate = new Date(reply.createdAt).toLocaleDateString("sq-AL", {
                day: "2-digit",
                month: "short",
                year: "2-digit"
            }) 
            return (
            <Text key={reply.answerId} className={`text-gray-400 text-sm font-plight ${idx === (flatReplies.length - 1) ? "" : "mb-1 pb-1 border-b border-black-200"}`}>{reply.discussionAnswerContent} - <Text className="text-secondary font-psemibold">{reply.userName}</Text> <Text className="text-gray-200 text-xs">{replyDate}</Text></Text>
        )})}
    </Animatable.View>}
    </>
  )
}

export default DiscussionsCommentCard

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