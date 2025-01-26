import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Touchable, useWindowDimensions, StyleSheet, Platform } from 'react-native'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useLocalSearchParams, useRouter, useSegments, usePathname, useFocusEffect } from 'expo-router';
import useFetchFunction from '../../../../../../hooks/useFetchFunction';
import { deleteBookmark, fetchLesson, getLessonComments, getUserCourseStatus, makeBookmark, reqCreateComment, reqCreateLessonLike, reqCreateLike, reqCreateReply, updateUserLessonStatus } from '../../../../../../services/fetchingService';
import Loading from '../../../../../../components/Loading';
import { images, icons } from '../../../../../../constants';
import ClockComponent from '../../../../../../components/ClockComponent';
import Checkbox from 'expo-checkbox';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import CommentsComponent from '../../../../../../components/CommentsComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { currentUserID } from '../../../../../../services/authService';
import NotifierComponent from '../../../../../../components/NotifierComponent';
import { useEventListener } from 'expo';
import EmptyState from '../../../../../../components/EmptyState'
import CustomModal from '../../../../../../components/Modal';
import RenderHTML from 'react-native-render-html';
import { useGlobalContext } from '../../../../../../context/GlobalProvider';

import { useDrawerUpdater } from '../../../../../../navigation/DrawerUpdater';
import apiClient from '../../../../../../services/apiClient';

import * as Animatable from "react-native-animatable"
import ShareToFriends from '../../../../../../components/ShareToFriends';

const lessonContent = () => {
    const { lesson } = useLocalSearchParams(); 
    const {user} = useGlobalContext();
    const {width} = useWindowDimensions();

    const {updateCourseData, drawerItemLoading: loading}  = useDrawerUpdater();
  

    const router = useRouter();
    const getPathName = usePathname();

    const {data, isLoading, refetch} = useFetchFunction(() => fetchLesson(lesson))
    const {data: lessonComments, isLoading: commentLoading, refetch: commentRefetch} = useFetchFunction(() => getLessonComments(lesson, "lesson"))

    const [lessonData, setLessonData] = useState(null)
    const [commentData, setCommentData] = useState([])
    const [htmlContent, setHtmlContent] = useState({html: ''})
    const [videoCompleted, setVideoCompleted] = useState(false)

    const commentValue = useRef(null)

    const [refreshing, setRefreshing] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    
    const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const player = useVideoPlayer(videoSource, player => {
      if (player) {
        player.loop = false;
        player.play();
      }
    })

    useEffect(() => {
      if(videoSource){
        const completedVideo = player.addListener('playToEnd', () => {
          setVideoCompleted(true)
        })
        
        // return () => {
        //   completedVideo.remove();
        // }
      }
      
    }, [videoSource])
    
    

    const {isPlaying} = useEvent(player, 'playingChange', {isPlaying: player.playing});
    // const {status} = useEvent(player, 'playToEnd', {status: player?.status}); //check here per kur kryhet video leksioni

    const onRefresh = async () => {
      setRefreshing(true)
      setLessonData(null)
      setCommentData(null)
      await refetch()
      await commentRefetch()
      setRefreshing(false)
    }

    // useEffect(() => {
    //   console.log(player?.status);
    // }, [player])
    
    // to stop video when route chagnes 
    // useFocusEffect(
    //   React.useCallback(() => {
    //     // This will run when the screen is in focus or going out of focus
    //     return () => {
    //       try {
    //         if (player.playing) {
    //           player.pause();
    //         }
    //       } catch (error) {
    //         console.error('Error pausing player:', error);
    //       }
    //     };
    //   }, [player])
    // )

    useEffect(() => {
      return () => {
        try {
          if(player.playing){
            player.pause();
          }
        } catch (error) {
          
        }
      }
    }, [player])
    
    
    

    const handleLessonLike = async () => {
      const userId = await currentUserID();
      try {
        const response = await reqCreateLessonLike(lesson, userId);
        if(response){
          // console.log(response);
          
          // await refetch() 
          setLessonData((prevData) => ({
            ...prevData,
            isLiked: response.message === "Lesson Like removed" ? false : true,
            lesson: {
              ...prevData.lesson,
              likes: response.likes
            }
          }))
        }
      } catch (error) {
        
      }
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

    const {showNotification: completedLesson} = NotifierComponent({
      title: "Sapo perfunduat me sukses leksionin!",
      description: "Tani do te drejtoheni tek leksioni tjeter ne vijim..."
    })

    const {showNotification: errorLesson} = NotifierComponent({
      title: "Dicka shkoi gabim!",
      description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
      alertType: "warning"
    })

    const createComment = async () => {
      const userId = await currentUserID();
      try {
          const response = await reqCreateComment(userId, lesson, commentValue.text)
          if(response){
            commentMade()
            await commentRefetch()
            scrollToEnd()
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

    const date = new Date();
    const formattedDate = date.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',  // Full month name
      day: 'numeric',
    });

    useEffect(() => {
      setCommentData(null);
      setLessonData(null);
      refetch();
    }, [lesson])
    
    useEffect(() => {
      if(data){        
        setLessonData(data);    
        // console.log(data, 'data');
        
        setHtmlContent((prevData) => ({
          ...prevData,
          html: data?.lesson?.lessonContent
        }))
        updateCourseData(data?.lesson?.courseID)
      }

    }, [data])

    useEffect(() => {
      if(lessonComments){
        // console.log(lessonComments);
        
        setCommentData(lessonComments);       
      }
    }, [lessonComments])

    
    

    const timeChange = useCallback((time) => {
        // setCurrentTime(time);
    },[])

    
    
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(4)
    const [showAllComments, setShowAllComments] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [showVideo, setShowVideo] = useState(true)
    const [visibleCurrentProgressModal, setVisibleCurrentProgressModal] = useState(false)
    const [visibleCourseCompletationModal, setVisibleCourseCompletationModal] = useState(false)

    const reqBookmark = async () => {
      const userId = await currentUserID()
      try {
        const response = await makeBookmark(userId, null, lessonData?.lesson?.id);
        if(response){
          await onRefresh();
        }
      } catch (error) {
        errorLesson();
        console.error(error);
      }
    }

    const delBookmark = async () => {
      const userId = await currentUserID();
      try {
        const response = await deleteBookmark(userId, null, lessonData?.lesson?.id)
        if(response){
          // console.log(response);
          
          await onRefresh();
        }
      } catch (error) {
        errorLesson();
        console.error(error);
      }
    }

    const switchBetweenContents = () => {
      setIsChecked(!isChecked)
      setShowVideo(!showVideo)
    }
    useEffect(() => {
      if(player.duration){
        if(player.currentTime.toFixed(2) === player.duration.toFixed(2)){
          setTimeout(() => {
            setVideoCompleted(true);
          }, 400);
        }
      }
      
    }, [player.currentTime, player.duration])
    

    useEffect(() => {
      showVideo ? player.play() : player.pause();
    }, [showVideo])

    useEffect(() => {
      setVisibleCommentsCount(4); // Reset visible comments on lesson change
    }, [lesson]);

    const loadMoreComments = () => {
      if (visibleCommentsCount < commentData?.length) {
        setVisibleCommentsCount((prevCount) => prevCount + 4);
      }
    };


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

    const flatListRef = useRef(null)
    

    const scrollToEnd = () => {
      setShowAllComments(true);
      // setIsAtEnd(false);

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
        setTimeout(() => {
          if (!isAtEndRef.current) {
            scrollToEnd();
          } else {
            commentValue.current.focus();
          }
        }, 500);
      }

    };

    const scrollTotop = () => {
      // if (flatListRef.current) {
      //   flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      // } else {
      //   console.warn('FlatList reference is not set');
      // }

      console.log('not working fixx')
    };

    

    //ME KRIJU PJESEN PER KUR TE KRYHEN KREJT LESSONS NAJFAR CONGRATS A DICKA

    const updateStatus = async (userId, courseId, lessonId, nextLessonId) => {
      try {
        console.log('nrregull1');
        
        const response = await updateUserLessonStatus({
          "userId": userId,
          "courseId": courseId,
          "lessonId": lessonId,
          "isCompleted": true,
          "hasStarted": true,
        })
        // console.log(response);
        
        if(response === 200){
          await updateNextLessonStarted(userId, courseId, nextLessonId);
          return true;
        }else{
          errorLesson();
          return false;
        }
      } catch (error) {
        console.error(error, ' qitu?');
      }
    } 

    const updateNextLessonStarted = async (userId, courseId, lessonId) => {
      try {
        console.log('nrregull2');

        const response = await updateUserLessonStatus({
          "userId": userId,
          "courseId": courseId,
          "lessonId": lessonId,
          "isCompleted": false,
          "hasStarted": true,
        })
        // console.log(response);
        if(response === 200){
          completedLesson();
          return true;
        }else{
          errorLesson();
          return false;
        }
      } catch (error) {
        console.log('jo');
        
        console.error(error, ' qitu1111??');
      }
    }

    const getStatuses = async (processType) => {
      const userId = await currentUserID();
      try {
        const response = await getUserCourseStatus(userId, lessonData?.lesson?.courseID);
        const userProgress = response.data?.userProgress

        const getCurrentProgress = userProgress.find(item => item.progressLessonId === lessonData?.lesson?.id)
        const getCurrentIndex = userProgress.indexOf(getCurrentProgress);

        //const hasMoreInBack = getCurrentIndex > 0
        //const hasMoreInFront = getCurrentIndex < (userProgress.length - 1);

        if(processType === 'next'){
          if(lessonData?.navigation?.hasNextLesson){ // nese ka ma shum lesssons nese ska completation
            const getNextIndex = getCurrentIndex + 1;
            const getNextLessonObj =  userProgress[getNextIndex];

            // const hasMoreNextLessonInFront = getNextIndex < (userProgress.length - 1);
            // const hasMoreNextLessonInBack = getNextIndex > 0

            if(!getNextLessonObj?.progressLessonStarted){
              const updateResult = await updateStatus(userId, lessonData?.currentProgress?.courseId, lessonData?.currentProgress?.lessonId, lessonData?.navigation?.nextLessonId);
              if(!updateResult){
                return;
              }
            }
              router.replace(`/categories/course/lesson/${lessonData?.navigation?.nextLessonId}`)
          }else{
            const updateLatestResult = await apiClient.patch(`/api/UserProgress`, {
              "userId": userId,
              "courseId": lessonData?.currentProgress?.courseId,
              "lessonId": lessonData?.currentProgress?.lessonId,
              "isCompleted": true,
              "hasStarted": true,
            })
            if(updateLatestResult.status === 200){
              if(updateLatestResult.data?.isCompleted){
                setVisibleCourseCompletationModal(true); // in click edhe ne autoclose redirect user to course completation window
                setTimeout(() => {
                  router.replace(`/completed/${lessonData?.currentProgress?.courseId}`)
                }, 3000);
              }else{

              }
            }
          }
          // router.replace();
        }else if (processType === 'back'){
          if(lessonData?.navigation?.hasPreviousLesson){
            // const getBehindIndex = getCurrentIndex - 1;
            // const getPreviusLessonObj = userProgress[getBehindIndex];

            // const hasMoreNextLessonInFront = getBehindIndex < (userProgress.length - 1);
            // const hasMoreNextLessonInBack = getBehindIndex > 0

            router.replace(`/categories/course/lesson/${lessonData?.navigation?.previousLessonId}`)
          }
        }
      } catch (error) {
        console.error(error, 'apo qitu?');
      }
    }

    const handleModalClose = async () => {
      setModalVisible(false)
      await getStatuses('next')
    }

    const goLessonFront = async () => {
      setModalVisible(true);
      // await getStatuses('next');
    }

    const goLessonBack = async () => {
      await getStatuses('back')
    }


    
    if(isLoading || refreshing){
      return (
        <Loading />
      )
    }else{
      return (
        <>
        <View className="absolute bottom-0  bg-primary border-t border-black-200 border-l border-r right-0 w-full z-20">
          <View className="flex-1 flex-row items-center justify-center">
            {lessonData?.navigation?.hasPreviousLesson && <TouchableOpacity onPress={goLessonBack} className="flex-1 items-center h-14 border-r border-black-200"><View className="items-center justify-center flex-1 ">
              <Text className="text-white text-base font-psemibold">Mbrapa</Text>
            </View></TouchableOpacity>}
              <TouchableOpacity onPress={goLessonFront} className="flex-1 items-center h-14">

                {/* ADD IF COMPLETED ME I HEK KTO  */}
            <View className="items-center justify-center flex-1">
                <Text className="text-secondary text-base font-psemibold">{lessonData?.navigation?.hasNextLesson ? "Vazhdoni" : "Perfundoni"}</Text>
            </View>
              </TouchableOpacity>
          </View>
        </View>
        

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

        <View className="flex-1">
          <KeyboardAwareFlatList
          onContentSizeChange={false}
            ref={flatListRef}
            keyboardShouldPersistTaps="handled"
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
            ListHeaderComponent={() => (
            <>
            <View className="flex-row w-full">
              <View className="flex-[0.5] border border-l-0 border-b border-black-200 p-2 py-3 items-center justify-center bg-oBlack">
                <Text className="text-white font-pregular text-sm text-center">{formattedDate}</Text>
              </View>
              <View className="flex-[1] flex-row gap-2 border-b border-t border-black-200 items-center justify-center p-2 py-3">
                <Text className="text-white font-pbold text-sm text-center">{lessonData?.lesson?.lessonName}</Text>
                <Animatable.View animation="pulse" iterationCount="infinite">
                  <TouchableOpacity onPress={() => setVisibleCurrentProgressModal(true)}>
                    <Image 
                      source={lessonData?.currentProgress?.isCompleted ? icons.completed : icons.completedProgress}
                      resizeMode='contain'
                      className="h-6 w-6"
                      tintColor={"#FF9C01"}
                    />
                  </TouchableOpacity>
                </Animatable.View>
              </View>
              <View className="flex-[0.5] border border-r-0 border-b border-black-200 p-2 py-3 items-center justify-center bg-oBlack">
                <Text className="text-white font-pregular text-sm text-center"><ClockComponent onTimeChange={timeChange}/></Text>
              </View>
            </View>
            <View className="bg-oBlack p-2 border-b border-black-200 flex-row items-center justify-between ">
              <View className="flex-row items-center gap-1 flex-1">
                <TouchableOpacity onPress={lessonData?.isBookmarked ? delBookmark : reqBookmark}><Text className={`text-sm ${lessonData?.isBookmarked ? "text-secondary border-secondary" : "text-white border-white"} font-psemibold border-b`}>{lessonData?.isBookmarked ? "Largo nga favoritet" : "Shto tek favoritet"}</Text></TouchableOpacity>
                <Image 
                  source={icons.heart}
                  className="w-4 h-4"
                  style={{tintColor: lessonData?.isBookmarked ? "#FF9C01" : "#fff"}}
                />
              </View>
              <View className="flex-1">
                <TouchableOpacity className="flex-row items-center" onPress={switchBetweenContents}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={switchBetweenContents}
                    color={isChecked ? "#ff9c01" : "#232533"}
                    className="mr-2"
                  />
                  <Text className="text-white text-sm font-psemibold">
                    Kaloni tek permbajtja
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="min-w-full">
            {showVideo && <VideoView
              player={player}
              
              allowsFullscreen
              nativeControls
              allowsPictureInPicture
              contentFit='cover'
              style={{ width: '100%', height: "250" }}
            />
            }
            {!showVideo && 
              <ScrollView className="h-[40vh] overflow-x px-4 bg-primary">
                <RenderHTML 
                  tagsStyles={{
                    h1: {color:"white", fontFamily: 'Poppins-Black', marginTop:"1.5em", marginBottom: "0.5em"},
                    h2: {color:"white", fontFamily: 'Poppins-Bold', marginTop:"1.25em", marginBottom: "0.75em"},
                    h3: {color:"white", fontFamily: 'Poppins-Medium', marginTop: "1em", marginBottom: "0.5em"},
                    h4: {color:"white", fontFamily: "Poppins-Medium", marginTop: "0.75em", marginBottom: "0.5em"},
                    h5: {color:"white", fontFamily:"Poppins-Regular", marginTop:"0.5em", marginBottom: "0.25em"},
                    p: {color:"white", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0px", marginBottom: "10px"},
                    strong: {color:"white", fontFamily: "Poppins-Bold", fontSize: 12},
                    li: {color:"white", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0.25em", marginBottom: "0.25em"},
                    ol: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12,  marginTop: "1em", marginBottom: "1em"},
                    ul: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12, marginTop: "1em", marginBottom: "1em"}
                  }}
                  contentWidth={width}
                  source={htmlContent}
                  classesStyles={{ //for classes exmpl yellow clr
                    special: { color: 'green', fontStyle: 'italic' },
                  }}
                  systemFonts={['Poppins-Black', 'Poppins-Bold', 'Poppins-ExtraBold', 'Poppins-Light', 'Poppins-Medium', 'Poppins-Regular', 'Popping-SemiBold']}
                />
              </ScrollView>
            }
            </View>

            <View className="flex-row w-full border border-black-200">
              <View className="flex-1 bg-oBlack p-2.5">
                  <TouchableOpacity onPress={handleLessonLike} className="flex-row flex-1 items-center justify-center gap-1 border-r border-black-200">
                      <Text className={`${lessonData?.isLiked ? "text-secondary" : "text-white"} font-pregular text-sm text-center `}>{lessonData?.isLiked ? "I Pelqyer" : "Pelqeni"} 
                      </Text>
                        <View className="flex-row items-center justify-center">
                          <Image 
                            source={icons.star}
                            resizeMode='contain'
                            className="w-6 h-6"
                            tintColor={"#FF9C01"}
                          />
                        <View className="-ml-3.5">
                          <Text className="font-psemibold text-sm text-white">{lessonData?.lesson?.likes}</Text>
                        </View>
                      </View>
                  </TouchableOpacity>
              </View>
              <View className="flex-1 bg-oBlack p-2.5">
                  <TouchableOpacity onPress={scrollToEnd} className="flex-row flex-1 items-center justify-center gap-1">
                      <Text className="text-white font-pregular text-sm text-center">Komento</Text>
                      <View className="flex-row items-center justify-center">
                          <Image 
                            source={icons.chat}
                            resizeMode='contain'
                            className="w-6 h-6"
                            tintColor={"#FF9C01"}
                          />
                        <View className={`${lessonData?.countLessonComments > 9 ? "-ml-5" : "-ml-4"}`}>
                          <Text className="font-psemibold text-sm text-white">{lessonData?.countLessonComments}</Text>
                        </View>
                      </View>
                  </TouchableOpacity>
              </View>
            </View>


            {/* proceed or not proceed n course completation */}
            <CustomModal
              visible={modalVisible}
              title={"Keshille e bardhe!"}
              proceedButtonText={"Vazhdo"}
              cancelButtonText={"Qendro"}
              onClose={() => setModalVisible(false)}
              onProcced={async () => await handleModalClose()}
            >
              <View>
                <Text className="text-white font-pregular text-base text-center mb-4">Para se te kaloni ne leksionin e radhes sigurohuni qe informacioni i percjellur nga ligjerata eshte marre seriozisht nga ana juaj!</Text>
                <Text className="text-white font-plight text-sm text-center mb-2">Nese deshironi te percillni perseri materialin mediatik apo te shkruaj shtypni <Text className="text-secondary font-psemibold">Qendro</Text></Text>
                <Text className="text-white font-plight text-sm text-center mb-2">Kurse nese deshironi te procedoni me tutje me ligjeratat e radhes shtupni <Text className="text-secondary font-psemibold">Vazhdo</Text></Text>
              </View>
            </CustomModal>
            {/* proceed or not proceed n course completation */}
            </>
            )}
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
                    ref={commentValue}
                    className="text-white font-pregular flex-1 border border-black-200 p-4 rounded-[10px] bg-primary"
                    placeholder='Shprehe mendimin tend...'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    onChangeText={text => commentValue.text = text}
                    onSubmitEditing={createComment}
                  />
                </View> 
              </View>


              {/* njoftim mbi imazh ne top scr */}
              <CustomModal
                visible={visibleCurrentProgressModal}
                title={"Njoftim mbi imazhin"}
                onClose={() => setVisibleCurrentProgressModal(false)}
                onlyCancelButton={true}
                cancelButtonText={"Largo dritaren"}
                autoCloseDuration={3000}
              >
                <View className="mt-2">
                  <Text className="text-white text-sm font-plight text-center">{lessonData?.currentProgress?.isCompleted ? "Ky imazh indikon se ky leksion ka perfunduar me sukes!" : "Ky imazh indikon se ky leksion eshte ne perfundim e siper!"}</Text>
                </View>
              </CustomModal>
              {/* njoftim mbi imazh ne top scr */}


              <CustomModal
                visible={visibleCourseCompletationModal}
                title={"URIME!!!"}
                onClose={() => setVisibleCourseCompletationModal(false)}
                autoCloseDuration={3000}
                showButtons={false}
              >
                <View className="absolute -top-10 right-0">
                  <Image
                    source={images.mortarBoard}
                    className="h-10 w-10 opacity-50"
                    resizeMode='contain'
                    tintColor={"#FF9C01"}
                  />
                </View>
                <View className="absolute -top-10 left-0">
                  <Image
                    source={images.reward}
                    className="h-10 w-10 opacity-50"
                    resizeMode='contain'
                    tintColor={"#FF9C01"}
                  />
                </View>
                <View className="mt-2 bg-oBlack w-full rounded-[5px] p-2">
                  <Text className="font-plight text-base text-center text-white">Sapo keni perfunduar kursin</Text>
                  <Text className="font-pblack text-secondary text-center">{lessonData?.lesson?.course?.courseName}</Text>
                </View>
                <View className="mt-2">
                  <Text className="font-plight text-sm text-center text-white">Brenda disa sekondave do te ridrejtoheni tek dritarja e ardhshme ku do mund te shkarkoni diplomen tuaj te nenshkruar nga <Text className="text-secondary font-psemibold">ShokuMesimit</Text>...</Text>
                </View>
              </CustomModal>

              <CustomModal 
                visible={videoCompleted}
                title={"Sapo perfunduat materialin!"}
                onClose={() => setVideoCompleted(false)}
                onlyCancelButton={true}
                cancelButtonText={"Largo dritaren"}
              >
                <View className="mt-2">
                  <Text className="text-white text-sm font-plight text-center">
                  {lessonData?.currentProgress?.isCompleted 
                  ? <>
                      {"Materiali visual sapo perfundoj! Ju mund te shikoni nese autori ka lene permbajtje tekstuale apo mund te procedoni me tutje duke permbyllur kursin me butonin "}
                      <Text key="finish" className="text-secondary font-psemibold">Perfundo</Text>
                      {" dhe marrjen e certifikates se perfundimit me sukses te kursit "}
                      <Text key="courseName" className="text-secondary font-psemibold"> {lessonData?.lesson?.course?.courseName}</Text>
                    </>
                  : <>
                      {"Materiali visual sapo perfundoj! Ju mund te shikoni nese autori ka lene permbajtje tekstuale apo mund te procedoni me tutje duke klikuar mbi butonin "}
                      <Text key="continue" className="text-secondary font-psemibold">Vazhdoni</Text>
                      {" Ku mund te vazhdoni ne leksionin e radhes!"}
                    </>
                }
                  </Text>
                </View>
              </CustomModal>

              

              
                
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
        </View>


          <ShareToFriends  //nuk po hapet diqka ?? fix
            currentUserData={user?.data?.userData}
            shareType="lesson"
          />

          
        </>
      )
    }
}

const styles = StyleSheet.create({
  box: {
      ...Platform.select({
          ios: {
              shadowColor: '#fff',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
})

export default lessonContent