import React, { useEffect, useRef, useState } from 'react'
import useFetchFunction from '../hooks/useFetchFunction'
import { getLessonComments, reqCreateComment, reqCreateLike, reqCreateReply } from '../services/fetchingService'
import NotifierComponent from './NotifierComponent'
import { currentUserID } from '../services/authService'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import CommentsComponent from './CommentsComponent'
import { Image, RefreshControl, TextInput, TouchableOpacity, View } from 'react-native'
import { icons } from '../constants'
import EmptyState from './EmptyState'
import { useLessonCommentsContext } from '../context/LessonCommentsProvider'

const LessonComments = ({lesson}) => {
    const [commentData, setCommentData] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const flatListRef = useRef(null)
    const commentValueRef = useRef(null);
    const [commentValue, setCommentValue] = useState("")

    const {fireUpEndScroll, setFireUpEndScroll, setHideHalfVideo, hideHalfVideo} = useLessonCommentsContext();

    const {data: lessonComments, isLoading: commentLoading, refetch: commentRefetch} = useFetchFunction(() => getLessonComments(lesson, "lesson"))

    const onRefresh = async () => {
        setRefreshing(true)
        setCommentData(null)
        await commentRefetch()
        setRefreshing(false)
    }

    const {showNotification: commentMade} = NotifierComponent({
        title: "Komenti u shtua me sukses!",
        description: "Interaktiviteti mes jush krijon mesim me funksional",
      });
  
    const {showNotification: commentNotMade} = NotifierComponent({
    title: "Problem ne krijim te komentit!",
    description: "Ju lutem provoni perseri ose kontaktoni panelin e ndihmes",
    alertType: "warning"
    })

    const createComment = async () => {
        const userId = await currentUserID();
        try {
            if(commentValue.length === 0) {
                commentNotMade();
                return;
            }
            
            const response = await reqCreateComment(userId, lesson, commentValue)
            if(response){
            commentMade()
            await commentRefetch()
            scrollToEnd()
            setCommentValue("")
            }else{
            commentNotMade()
            }
        } catch (error) {
            commentNotMade()
            console.log(error);
        }
    }

    const createReplyComment = async (object, commentValue) => {
        const userId = await currentUserID();
        try {
        const response = await reqCreateReply(userId, lesson, object.commentId, commentValue);
        if(response){          
            commentMade()
            // updateCommentDataWithReply(commentData, object.commentId, response);
            // console.log(commentData);
            await commentRefetch()
        }else{
            commentNotMade()
        }
        } catch (error) {
            commentNotMade()
        console.error(error);
        }
    }
    
    const createLikeComment = async (item) => {      
        const userId = await currentUserID();
        try {
        const response = await reqCreateLike(item.commentId, userId)
        if(response){
            await commentRefetch()
        }
        } catch (error) {
        console.error(error);
        }
    }

    const [visibleCommentsCount, setVisibleCommentsCount] = useState(4)
    const [showAllComments, setShowAllComments] = useState(false)

    const loadMoreComments = () => {
      if (visibleCommentsCount < commentData?.length) {
        setVisibleCommentsCount((prevCount) => prevCount + 4);
      }
    };

    useEffect(() => {
        setVisibleCommentsCount(4); // Reset visible comments on lesson change
    }, [lesson]);
    

    useEffect(() => {
        if(lessonComments){
        // console.log(lessonComments);
        
        setCommentData(lessonComments);       
        }
    }, [lessonComments])


    

    const [inputIsActive, setInputIsActive] = useState(false)
    


    const [hasCrossed, setHasCrossed] = useState(false);
    
    const isAtEndRef = useRef(false);

    const checkScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height; // Height of the entire content
        const contentOffsetY = event.nativeEvent.contentOffset.y; // How far the user has scrolled
        const layoutHeight = event.nativeEvent.layoutMeasurement.height; // Height of the visible part of the list

        
        const paddingToBottom = 0;
        const reachedEnd = layoutHeight + contentOffsetY >= contentHeight - paddingToBottom;
        isAtEndRef.current = reachedEnd;
        
    // If the user has scrolled to the bottom
        if (contentOffsetY + layoutHeight >= contentHeight - 50) {
        setHasCrossed(true); // Show "Scroll to Top" button
        } else {
        setHasCrossed(false); // Hide "Scroll to Top" button
        }
        
    }

    useEffect(() => {
        if(fireUpEndScroll){
            scrollToEnd();
            return;
        }
        console.log("? A?SD?A S?D A?S D?AS");
    }, [fireUpEndScroll])
      
  
    const scrollToEnd = () => {
        setShowAllComments(true);
        // setIsAtEnd(false);
        setFireUpEndScroll(false)
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
            setTimeout(() => {
                if (commentValueRef.current) {
                    commentValueRef.current.focus();
                }
            }, 300);
        // setTimeout(() => {
        //     if (!isAtEndRef.current) {
        //         scrollToEnd();
        //         console.log("A?SD?AS?DAS?DAS?D?ASD?ASD?ASD?A?SD");
        //     } else {
        //         commentValueRef.current.focus();
        //     }
        // }, 500);
        }
    };

    const scrollTotop = () => {

    }

  return (
    <>
    {/* butoni per top edhe bottom */}
              <TouchableOpacity onPress={hasCrossed ? scrollTotop : scrollToEnd} className="absolute items-end right-4 bottom-4 justify-end rounded-[10px] z-20 w-10 h-10 p-2 " style={{ backgroundColor: "rgba(0,0,0,.2)" }}>
                <Image
                  source={hasCrossed ? icons.upArrow : icons.downArrow}
                  className=' h-6 w-6'
                  resizeMode='contain'
                  tintColor={"#FF9C01"}
                />
              </TouchableOpacity>
            {/* butoni per top edhe bottom */}
    
    <KeyboardAwareFlatList
            onContentSizeChange={false}
            ref={flatListRef}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={-70}
            data={showAllComments ? commentData : commentData?.slice(0, visibleCommentsCount)}
            keyExtractor={(item) => item?.commentId?.toString()}
            renderItem={({ item }) => {              
              return (
              <CommentsComponent
                commentData={item}
                handleReplyComment={createReplyComment}
                handleCommentLike={createLikeComment}
              />
              )
             }}
             onScroll={checkScroll}
             scrollEventThrottle={16}
            onEndReached={loadMoreComments}
            onEndReachedThreshold={0.1}
            className="h-full bg-primary w-full"
            refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
            ListFooterComponent={() => (
            <>
            <View className="border-t border-b flex-row justify-center items-center gap-2 p-2 py-4 bg-oBlack border-black-200 flex-1 -mt-4 mb-[50px]">
            <View className="flex-[0.2] items-center justify-center h-full bg-primary border border-black-200 rounded-[10px]">
                <View>
                <Image 
                    source={icons.profile}
                    resizeMode='contain'
                    className="h-8 w-8"
                />
                </View>
            </View> 
            <View className="flex-1">
                <TextInput
                ref={commentValueRef}
                className="text-white font-pregular flex-1 border border-black-200 p-4 rounded-[10px] bg-primary"
                placeholder='Shprehe mendimin tend...'
                placeholderTextColor="rgba(255,255,255,0.2)"
                onChangeText={text => setCommentValue(text)}
                onFocus={() => setHideHalfVideo(true)}
                onBlur={() => setHideHalfVideo(false)}
                onSubmitEditing={createComment}
                />
            </View> 
            </View>
            </>
            )}
            ListEmptyComponent={() => (
                <View className="mt-4">
                <EmptyState
                    title={"Nuk ka ende komentues!"}
                    titleStyle={"!font-pregular"}
                    subtitle={"Shpreheni mendimin tuaj mbi kete leksion dhe behuni komentusi i pare!"}
                    isBookMarkPage={true}
                    showButton= {false}
                />
                </View>
            )}
            enableOnAndroid={true} // Enable keyboard handling for Android
            contentContainerStyle={{ flexGrow: 1 }}
            />
            </>
  )
}

export default LessonComments