import Checkbox from 'expo-checkbox';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Image, Text, View } from 'react-native';
import { icons } from '../constants';
import { currentUserID } from '../services/authService';
import { deleteBookmark, makeBookmark } from '../services/fetchingService';
import { useEvent } from 'expo';
import { TouchableOpacity } from 'react-native';
import CustomModal from './Modal';
import LessonContent from './LessonContent';
import NotifierComponent from './NotifierComponent';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';

const LessonVideoContent = ({videoContent, writtenContent, lessonData, successBookmarkDelete, successBookmarkMade}) => {
    const [videoCompleted, setVideoCompleted] = useState(false)
    const [showVideo, setShowVideo] = useState(true)
    const [isChecked, setIsChecked] = useState(false)
    const {colorScheme} = useColorScheme();

    const player = useVideoPlayer(videoContent, player => {
        if (player) {
        player.loop = false;
        player.play();
        }
    })

    const {isPlaying} = useEvent(player, 'playingChange', {isPlaying: player.playing});
    
    const {showNotification: errorLesson} = useMemo(() => NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
        alertType: "warning",
        theme: colorScheme
    }), [colorScheme])

    const delBookmark = useCallback(async () => {
        const userId = await currentUserID();
        try {
        const response = await deleteBookmark(userId, null, lessonData?.lesson?.id)
        if(response){
            successBookmarkDelete();
        }
        } catch (error) {
        errorLesson();
        console.error(error);
        }
    }, [deleteBookmark, successBookmarkDelete, errorLesson, lessonData])

    const reqBookmark = useCallback(async () => {
        const userId = await currentUserID()
        try {
        const response = await makeBookmark(userId, null, lessonData?.lesson?.id);
        if(response){
            successBookmarkMade();
        }
        } catch (error) {
            errorLesson();
            console.error(error);
        }
    }, [makeBookmark, successBookmarkDelete, lessonData, errorLesson])

    const switchBetweenContents = useCallback(() => {
        setIsChecked(!isChecked)
        setShowVideo(!showVideo)
    }, [setIsChecked, isChecked, setShowVideo, showVideo])

    // TODO: FIX VIDEO NOT PAUSING OR ERROR
    // useFocusEffect(
    //     useCallback(() => {
    //         return () => {
    //             try {
    //                 if(player && player?.playing){
    //                     player.pause();
    //                 }
    //             } catch (error) {
    //                 console.error('Error pausing ', error);
    //             }
    //         }
    //     }, [player])
    // )

    // useEffect(() => {
    //     if(videoContent){
    //     const completedVideo = player.addListener('playToEnd', () => {
    //         setVideoCompleted(true)
    //     })
    //     return () => {
    //         if(player && player?.playing) {
    //             player.pause();  // Pause the video
    //         }
    //         // Remove any listeners (important to prevent memory leaks)
    //         if (player && player.removeListener) {
    //             player.removeListener('playToEnd'); 
    //         }
    //     };
    //     }
    // }, [videoContent, player])


    

    // useEffect(() => {
    //     return () => {
    //     try {
    //         if(player.playing){
    //         player.pause();
    //         }
    //     } catch (error) {
            
    //     }
    //     }
    // }, [player])

    // useEffect(() => {
    //     if(player.duration){
    //     if(player.currentTime.toFixed(2) === player.duration.toFixed(2)){
    //         setTimeout(() => {
    //         setVideoCompleted(true);
    //         }, 400);
    //     }
    //     }
        
    // }, [player.currentTime, player.duration])

    useEffect(() => {
        showVideo ? player.play() : player.pause();
    }, [showVideo])

  return (
    <>
    <View className="bg-oBlack-light dark:bg-oBlack p-2 border-b border-gray-200 dark:border-black-200 flex-row items-center justify-between ">
        <View className="flex-row items-center gap-1 flex-1">
        <TouchableOpacity onPress={lessonData?.isBookmarked ? () => delBookmark : () => reqBookmark}><Text className={`text-sm ${lessonData?.isBookmarked ? "text-secondary border-secondary" : "text-oBlack dark:text-white border-black-200 dark:border-white"} font-psemibold border-b`}>{lessonData?.isBookmarked ? "Largo nga favoritet" : "Shto tek favoritet"}</Text></TouchableOpacity>
        <Image 
            source={icons.heart}
            className="w-4 h-4"
            style={{tintColor: lessonData?.isBookmarked ? "#FF9C01" : colorScheme  === "light" ? "#000" : "#fff"}}
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
            <Text className="text-oBlack dark:text-white text-sm font-psemibold">
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
        <LessonContent htmlContent={writtenContent}/>
    }
    </View>


    <CustomModal
        visible={videoCompleted}
        title={"Sapo perfunduat materialin!"}
        onClose={() => setVideoCompleted(false)}
        onlyCancelButton={true}
        cancelButtonText={"Largo dritaren"}
    >
        <View className="mt-2">
            <Text className="text-oBlack dark:text-white text-sm font-plight text-center">
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
  )
}

export default memo(LessonVideoContent)