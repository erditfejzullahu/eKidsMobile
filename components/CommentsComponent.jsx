import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Platform, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { images, icons } from '../constants'
import FormField from '../components/FormField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useLessonCommentsContext } from '../context/LessonCommentsProvider'


const CommentsComponent = ({commentData, handleLessonLike, handleReplyComment, handleCommentLike }) => {
    const [interactions, setInteractions] = useState(null)
    const [commentValue, setCommentValue] = useState({})
    const [showReply, setShowReply] = useState([])

    const [showRepliesComments, setShowRepliesComments] = useState(false)
    const [showFirstTierRepliesComments, setShowFirstTierRepliesComments] = useState(false)

    const {setHideHalfVideo} = useLessonCommentsContext();

    const makeReply = useCallback((reply) => {
        setShowReply((prevReplies) => {
            if(prevReplies.includes(reply)){
                return [];
            }else{
                return [reply]
            }
        })       
    }, [showReply, setShowReply])

    const prepareReplyComment = (item, commentValue) => {
        handleReplyComment(item, commentValue)
        setCommentValue({});
        makeReply(item.commentId);
    }

    const prepareLikeComment = (item) => {
        handleCommentLike(item)
    }

    useEffect(() => {
        if(commentData){                
            setInteractions(commentData);
        }
    }, [commentData])

    

    const replies = (replyItem, commentIndex, limit, commentType) => {


        const visibleReplies = commentType === 'first' ? (showFirstTierRepliesComments ? replyItem : replyItem.slice(0, limit)) : (showRepliesComments ? replyItem : replyItem.slice(0, 3));

        if(commentType === 'second'){
            if(visibleReplies.length >= 3 || visibleReplies[0].replies[0]?.replies[0]){
                // setShowRepliesComments(!showRepliesComments);
                
                visibleReplies.filter((item) => {
                    return item.replies && item.replies.length > 0 && item.replies[0]?.replies[0];
                })
                
            }
        }
        return visibleReplies.map((item) => {                        
            // console.log(item?.isLiked, '???ASd');
            // if(item?.replies)
            // console.log(item?.replies?.length);
            
            return (
                <View key={item?.commentId} className="flex-1 flex-col w-full">
                    <View className={`flex-row gap-2 p-3 flex-1 ${commentIndex === 1 ? "ml-8" : "ml-16"}`}>
                        <View className="flex-[0.2] items-center relative">
                            <View className="border border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack rounded-[10px] h-14 w-14 items-center justify-center relative">
                                <Image
                                    source={icons.profile}
                                    resizeMode="contain"
                                    className="h-8 w-8"
                                />
                                <View className="absolute w-full h-2 -bottom-2 bg-primary-light dark:bg-primary -z-10" />
                            </View>
                            {showRepliesComments && <View className=" absolute w-[1px] right-4 -z-20 h-full bg-gray-200 dark:bg-black-200 -bottom-4" />}
                        </View>
                        <View className="flex-1 flex-col gap-1">
                            <View>
                                <Text className="text-gray-600 dark:text-gray-400 font-psemibold text-xs">
                                    {item?.user?.name}
                                </Text>
                                <Text className="text-oBlack dark:text-white font-plight text-sm">
                                    {item?.comment_Content}
                                </Text>
                                
                            </View>
                            <View className="flex-row gap-4 items-center">
                                <TouchableOpacity
                                    onPress={() => prepareLikeComment(item)}
                                    className="flex-row gap-1 items-center justify-center"
                                >
                                    <Text className={`${item?.isLiked ? "text-secondary" : "text-gray-600 dark:text-white"} text-xs font-pbold`}>{item?.isLiked ? "I Pelqyer" : "Pelqeni"}</Text>
                                    <View className="flex-row items-center">
                                        <Image
                                            source={icons.star}
                                            resizeMode="contain"
                                            className="h-6 w-6"
                                            style={{ tintColor: "#FF9C01" }}
                                        />
                                        <View className="-ml-3.5">
                                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item?.likes}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => makeReply(item?.commentId)}>
                                    <Text className="text-gray-600 dark:text-white text-xs font-pbold">Repliko</Text>
                                </TouchableOpacity>
                            </View>

                            

                            {/* pjesa e replikes */}
                            {(showReply.includes(item?.commentId) &&
                                <View className="flex-1 border rounded-[10px] border-gray-200 dark:border-black-200 p-2 bg-oBlack-light dark:bg-oBlack">
                                    <View>
                                        <Text className="text-gray-600 dark:text-gray-400 font-plight text-xs">Duke replikuar ne komentin e <Text className="text-secondary font-psemibold">{interactions?.user?.name}</Text></Text>
                                    </View>
                                    <View className="flex-row gap-2 w-full mt-1.5">
                                        <View className="flex-[0.2] items-center justify-center border border-gray-200 dark:border-black-200 rounded-[10px]">
                                            <Image
                                                source={icons.profile}
                                                resizeMode='contain'
                                                className="h-8 w-6"
                                            />
                                        </View>
                                        <View className="flex-1 ">

                                            <TextInput
                                                className="text-oBlack text-sm placeholder:text-gray-400 dark:placeholder:text-gray-700 dark:text-white font-pregular flex-1 border border-gray-200 dark:border-black-200 p-4 rounded-[10px]"
                                                value={commentValue}
                                                placeholder='Shprehe mendimin tend...'
                                                placeholderTextColor="rgba(255,255,255,0.2)"
                                                onChangeText={(text) => setCommentValue(text)}
                                                onFocus={() => setHideHalfVideo(true)}
                                                onBlur={() => setHideHalfVideo(false)}
                                                onSubmitEditing={() => prepareReplyComment(item, commentValue)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                            {/* pjesa e replikes */}


                        </View>
                    </View>

                    {item?.replies?.length > 0 && (
                        <>
                            {showRepliesComments ? (
                               
                                <Animatable.View
                                animation="fadeInLeft"
                                duration={700}
                            >
                                {replies(item?.replies, 2, 3, 'second')}
                            </Animatable.View> 
                            ) : (
                                <View className="ml-28">
                                    <TouchableOpacity onPress={() => setShowRepliesComments((prevValue) => !prevValue)}>
                                        <Text className="text-secondary underline text-xs font-psemibold">
                                            {showRepliesComments ? 'Fshih komentet' : 'Shiko te gjithe replikat'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </View>
            )
        })
    }


    return (
        <>
            <View  className="relative flex-col mb-4 justify-between flex-1 border-l border-r border-gray-200 dark:border-black-200 w-full">
                <View className="gap-2 w-full flex-1 border-b border-white dark:border-black-200 pb-4">
                    <Animatable.View animation="fadeInLeft" duration={700} key={interactions?.commentId} className={`flex-row gap-2 p-2`}>
                            <View className="flex-[0.2] items-center relative">
                                <View className="border border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack rounded-[10px] h-14 w-14 items-center justify-center relative">
                                    <Image 
                                        source={icons.profile}
                                        resizeMode='contain'
                                        className="h-8 w-8"
                                    />
                                    <View className="absolute w-full h-2 -bottom-2 bg-primary-light dark:bg-primary -z-10"/>
                                </View>
                                <View className="absolute w-[1px] right-4 -z-20 h-full bg-white dark:bg-black-200 -bottom-4" />
                            </View>
                            <View className="flex-[1] flex-col gap-1">
                                <View>
                                    <Text className="text-gray-600 dark:text-gray-400 font-psemibold text-xs">{interactions?.user?.name}</Text>
                                    <Text className="text-oBlack dark:text-white font-plight text-sm">{interactions?.comment_Content}</Text>
                                </View>
                                <View className="flex-row gap-4 items-center">
                                    <TouchableOpacity onPress={() => prepareLikeComment(interactions)} className="flex-row gap-1 items-center justify-center">
                                        <Text className={`${interactions?.isLiked ? "text-secondary" : "text-gray-600 dark:text-white"} text-xs font-pbold`}>{interactions?.isLiked ? "I Pelqyer" : "Pelqeni"}</Text>
                                        <View className="flex-row items-center">
                                            <Image 
                                                source={icons.star}
                                                resizeMode='contain'
                                                className="h-6 w-6"
                                                style={{tintColor: "#FF9C01"}}
                                            />
                                            <View className="-ml-3.5">
                                                <Text className="font-psemibold text-sm text-oBlack dark:text-white">{interactions?.likes}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => makeReply(interactions?.commentId)}>
                                    <Text className="text-gray-600 dark:text-white text-xs font-pbold">Repliko</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* pjesa e replikes */}
                                {(showReply.includes(interactions?.commentId) &&
                                <View className="flex-1 border rounded-[10px] border-gray-200 dark:border-black-200 p-2 bg-oBlack-light dark:bg-oBlack">
                                    <View>
                                        <Text className="text-gray-600 dark:text-gray-400 font-plight text-xs">Duke replikuar ne komentin e <Text className="text-secondary font-psemibold">{interactions?.user?.name}</Text></Text>
                                    </View>
                                    <View className="flex-row gap-2 w-full mt-1.5">
                                        <View className="flex-[0.2] items-center justify-center border border-gray-200 dark:border-black-200 rounded-[10px]">
                                            <Image
                                                source={icons.profile}
                                                resizeMode='contain'
                                                className="h-8 w-8"
                                            />
                                        </View>
                                        <View className="flex-1 ">
                                            
                                            <TextInput 
                                                className="text-oBlack placeholder:text-gray-400 dark:placeholder:text-gray-700 dark:text-white font-pregular flex-1 border border-gray-200 dark:border-black-200 p-4 rounded-[10px] text-sm"
                                                value={commentValue}
                                                placeholder='Shprehe mendimin tend...'
                                                placeholderTextColor="rgba(255,255,255,0.2)"
                                                onChangeText={(text) => setCommentValue(text)}
                                                onSubmitEditing={() => prepareReplyComment(interactions, commentValue)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                )}
                                {/* pjesa e replikes */}
                            </View> 
                    </Animatable.View>
                    {interactions?.replies?.length > 0 && (
                        <>
                            {interactions.replies.length <= 3 ? (
                                <Animatable.View animation="fadeInLeft" duration={700}>{replies(interactions?.replies, 1, 3, 'first')}</Animatable.View> 
                            ) : (
                                <>
                                <Animatable.View animation="fadeInLeft" duration={700}>
                                    {replies(interactions?.replies, 1, 2, 'first')}
                                </Animatable.View>
                                <Animatable.View animation="fadeInLeft" duration={700} className="ml-12">
                                    <TouchableOpacity onPress={() => setShowFirstTierRepliesComments(!showFirstTierRepliesComments)}>
                                        <Text className="text-secondary underline text-xs font-psemibold"> {showFirstTierRepliesComments ? 'Shiko me pak komente' : "Shiko te gjithe komentet"}</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                                </>
                            )}
                        </>
                    )}
                    {/* {(interactions?.replies?.length > 0 < 3 && showFirstTierRepliesComments 
                        ?   <Animatable.View animation="fadeInLeft" duration={700}>{replies(interactions?.replies, 1)}</Animatable.View> 
                        :   <Animatable.View animation="fadeInLeft" duration={700} className="ml-4">
                                <TouchableOpacity onPress={() => setShowFirstTierRepliesComments(!showFirstTierRepliesComments)}>
                                    <Text className="text-secondary underline text-xs font-psemibold">Shiko te gjithe komentet</Text>
                                </TouchableOpacity>
                            </Animatable.View>)} */}

                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 10, height: 6 },
                shadowOpacity: 1,
                shadowRadius: 20,
              },
              android: {
                elevation: 8,
              },
        })
    },
})
export default CommentsComponent