import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Touchable, useWindowDimensions, StyleSheet, Platform } from 'react-native'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useLocalSearchParams, useRouter, useSegments, usePathname, useFocusEffect } from 'expo-router';
import useFetchFunction from '../../../../../../hooks/useFetchFunction';
import { fetchLesson, getUserCourseStatus, reqCreateLessonLike, updateUserLessonStatus } from '../../../../../../services/fetchingService';
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

import ShareToFriends from '../../../../../../components/ShareToFriends';

import LessonTitle from '../../../../../../components/LessonTitle';
import LessonInteractions from '../../../../../../components/LessonInteractions';
import LessonComments from '../../../../../../components/LessonComments';
import { useLessonCommentsContext } from '../../../../../../context/LessonCommentsProvider';
import LessonVideoContent from '../../../../../../components/LessonVideoContent';
import { useShadowStyles } from '../../../../../../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';
const lessonContent = () => {
    const { lesson } = useLocalSearchParams(); 
    const {user} = useGlobalContext();
    const {width} = useWindowDimensions();

    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();

    const {updateCourseData, drawerItemLoading: loading}  = useDrawerUpdater();
    const {setHideHalfVideo, hideHalfVideo} = useLessonCommentsContext();

    const router = useRouter();
    const getPathName = usePathname();

    const {data, isLoading, refetch} = useFetchFunction(() => fetchLesson(lesson))

    const [lessonData, setLessonData] = useState(null)
    const [htmlContent, setHtmlContent] = useState({html: ''})
    


    const [refreshing, setRefreshing] = useState(false)
    
    const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    

    
    // const {status} = useEvent(player, 'playToEnd', {status: player?.status}); //check here per kur kryhet video leksioni

    const onRefresh = async () => {
      setRefreshing(true)
      setLessonData(null)
      setCommentData(null)
      await refetch()
      await commentRefetch()
      setRefreshing(false)
    }


    const handleLessonLike = async () => {
      // const userId = await currentUserID();
      try {
        const response = await reqCreateLessonLike(lesson);
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

    

    const {showNotification: completedLesson} = NotifierComponent({
      title: "Sapo perfunduat me sukses leksionin!",
      description: "Tani do te drejtoheni tek leksioni tjeter ne vijim..."
    })

    const {showNotification: errorLesson} = NotifierComponent({
      title: "Dicka shkoi gabim!",
      description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
      alertType: "warning"
    })

    

    

    const date = new Date();
    const formattedDate = date.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',  // Full month name
      day: 'numeric',
    });

    useEffect(() => {
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

    

    
    

    const timeChange = useCallback((time) => {
        // setCurrentTime(time);
    },[])

    
    
    
    const [modalVisible, setModalVisible] = useState(false)
    const [visibleCourseCompletationModal, setVisibleCourseCompletationModal] = useState(false)

    




    



    

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
    
    const handleBookmarkDelete = () => {
      setLessonData((prevData) => ({
        ...prevData,
        isBookmarked: false
      }))
    }

    const handleBookmarkMade = () => {
      setLessonData((prevData) => ({
        ...prevData,
        isBookmarked: true
      }))
    }

    
    //TODO: FIX PLAYER ERROR WHEN LEAVE SCREEN AND STUFF.

    
    if(isLoading || refreshing){
      return (
        <Loading />
      )
    }else{
      return (
        <>
        {/* absolute */}
        <View className="absolute bottom-0  bg-primary-light dark:bg-primary border-t border-gray-200 dark:border-black-200 border-l border-r right-0 w-full z-20">
          <View className="flex-1 flex-row items-center justify-center">
            {lessonData?.navigation?.hasPreviousLesson && <TouchableOpacity onPress={goLessonBack} className="flex-1 items-center h-14 border-r border-gray-200 dark:border-black-200"><View className="items-center justify-center flex-1 ">
              <Text className="text-oBlack dark:text-white text-base font-psemibold">Mbrapa</Text>
            </View></TouchableOpacity>}
              <TouchableOpacity onPress={goLessonFront} className="flex-1 items-center h-14">

                {/* ADD IF COMPLETED ME I HEK KTO  */}
            <View className="items-center justify-center flex-1">
                <Text className="text-secondary text-base font-psemibold">{lessonData?.navigation?.hasNextLesson ? "Vazhdoni" : "Perfundoni"}</Text>
            </View>
              </TouchableOpacity>
          </View>
        </View>
        
        {/* absolute */}
        
        <View className="flex-1 flex-col">
          <View className={`${hideHalfVideo ? "max-h-[200px]" : ""}`}>
            <View className="flex-row w-full">
              <View className="flex-[0.5] border border-l-0 border-b border-gray-200 dark:border-black-200 p-2 py-3 items-center justify-center bg-oBlack-light dark:bg-oBlack">
                <Text className="text-oBlack dark:text-white font-pregular text-sm text-center">{formattedDate}</Text>
              </View>
              <LessonTitle lessonData={lessonData}/>
              <View className="flex-[0.5] border border-r-0 border-b border-gray-200 dark:border-black-200 p-2 py-3 items-center justify-center bg-oBlack-light dark:bg-oBlack">
                <Text className="text-oBlack dark:text-white font-pregular text-sm text-center"><ClockComponent onTimeChange={timeChange}/></Text>
              </View>
            </View>
            
            {/* VIDEO WITH WRITTEN CONTENT  */}
              <LessonVideoContent successBookmarkDelete={handleBookmarkDelete} successBookmarkMade={handleBookmarkMade} videoContent={videoSource} writtenContent={htmlContent} lessonData={lessonData} />
            {/* VIDEO WITH WRITTEN CONTENT  */}

            {/* LESSON INTERACTIONS LIKE COMMENT  */}
            <LessonInteractions lessonData={lessonData} handleLessonLike={handleLessonLike}/>
            {/* LESSON INTERACTIONS LIKE COMMENT  */}

          </View>
            {/* proceed or not proceed n course completation */}
            
            {/* proceed or not proceed n course completation */}

          <View className="flex-1">
            <LessonComments lesson={lesson}/>
          </View>

        </View>

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
          <ShareToFriends  //nuk po hapet diqka ?? fix
            currentUserData={user?.data?.userData}
            shareType="lesson"
            passedItemId={lesson}
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