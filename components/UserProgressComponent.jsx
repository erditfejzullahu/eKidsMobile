import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import { userActualProgresses } from '../services/fetchingService'
import Loading from './Loading'
import useFetchFunction from '../hooks/useFetchFunction'
import { icons } from '../constants'
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable'
import { useRouter } from 'expo-router'
import EmptyState from "./EmptyState";

const UserProgressComponent = ({userDataId}) => {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false)
    const {data, refetch, isLoading} = useFetchFunction(() => userActualProgresses(userDataId))
    const [courseToggled, setCourseToggled] = useState([])
    const [theData, setTheData] = useState(null)
    
    useEffect(() => {
      if(userDataId){
        refetch()
      }
    }, [userDataId])

    useEffect(() => {
      if(data){
        setTheData(data)
      }else{
        setTheData(null)
      }
    }, [data])


    const toggleProgress = (id) => {
        setCourseToggled((prev) => {
            if(prev.includes(id)){
                return prev.filter(progressId => progressId !== id);
            } else {
                return [...prev, id]
            }
        })
    }

    const calculateProgress = (lessonDetails) => {
        if (!lessonDetails || lessonDetails.length === 0) return 0;
    
        const completedLessons = lessonDetails.filter(
          (lesson) => lesson.progress[0].lessonProgressCompleted
        ).length;
        
        return completedLessons / lessonDetails.length;
      };

    const navigateToLesson = (lessonItem) => {
        // console.log(lessonItem);
        router.push(`/categories/course/lesson/${lessonItem?.lessonId}`)
    }

    if (refreshing || isLoading) {
        return (
            <View className="h-1/2">
                <Loading />
            </View>
        )
    } else {
        return (
            <View className="p-4">
                <View className="mb-4">
                    <Text className="text-white font-pregular text-base">Kurset e shfletuara deri me tani</Text>
                </View>
                <View className="flex-col w-full gap-4">
                    {(userDataId && data?.length !== 0) ?  
                    data.map((progressItem, index) => {
                        const courseProgress = calculateProgress(progressItem?.lessonDetails);
                        const ProgressID = progressItem?.lessonDetails[0]?.progress[0]?.progressId;
                        return (
                        <View
                            className="  w-full border border-black-200 rounded-[10px] bg-oBlack"
                            key={index}
                            style={styles.box}
                        >
                            <TouchableOpacity
                            onPress={() => toggleProgress(ProgressID)}
                            >
                                <View className="p-4 flex-row relative">
                                    <View className="w-[90%] relative">
                                        <Text className="text-white font-psemibold text-base mb-2">{progressItem?.courseName}</Text>
                                        <Progress.Bar progress={courseProgress} unfilledColor='#d9d9d9' color="#ff9c01" borderWidth={0} height={12}  width={null} />
                                        <Text className="text-oBlock absolute -bottom-[2px] items-center justify-center w-full right-0 left-0 m-auto text-center font-psemibold text-xs">{courseProgress === 1 ? 100 : parseFloat(courseProgress * 100).toFixed(2)} %</Text>
                                    </View>
                                    <View className="w-[10%] items-end justify-center">
                                        <Animatable.Image
                                            animation="pulse"
                                            iterationCount="infinite"
                                            easing="ease-in-out" 
                                            source={courseToggled.includes(ProgressID) ? icons.upArrow : icons.downArrow}
                                            className="w-6 h-6"
                                            resizeMode='contain'
                                            style={{tintColor: "#ff9c01"}}
                                        />
                                    </View>

                                    {courseToggled.includes(ProgressID) && <View className="absolute w-[100%] -ml-[-5%] border-b-2 border-black-200 bottom-0" />}

                                </View>
                            </TouchableOpacity>
                            {courseToggled.includes(ProgressID) && 
                            <View className="overflow-hidden">
                            <Animatable.View
                                className="p-4 "
                                animation="fadeInLeft"
                                duration={700}
                            >
                                <View className="flex-col gap-2 w-full ">
                                {progressItem?.lessonDetails.map((lessonItem, lessonIndex) => {
                                    const lessonProgressStarted = lessonItem?.progress[0]?.lessonProgressStarted;
                                    const lessonProgressCompleted = lessonItem?.progress[0].lessonProgressCompleted;
                                    return(
                                        <TouchableOpacity onPress={() => navigateToLesson(lessonItem)}>
                                            <View
                                                className="w-full"
                                                key={lessonIndex}
                                            >
                                                <View className="flex-row items-center w-full p-4 border border-black-200 rounded-[10px]">
                                                    <View className="flex-row w-[90%]">
                                                        <Text className="text-secondary text-base font-pregular min-w-[20px]">{lessonIndex + 1}. </Text>
                                                        <Text className="text-white text-base font-psemibold pr-2">{lessonItem?.lessonName}</Text>
                                                    </View>
                                                    <View className="flex-col w-[10%]">
                                                        <Animatable.Image
                                                            animation={lessonProgressStarted ? "pulse" : ""}
                                                            iterationCount="infinite"
                                                            easing="ease-in-out"
                                                            source={lessonProgressStarted && !lessonProgressCompleted ? icons.completedProgress : lessonProgressStarted && lessonProgressCompleted ? icons.completed : icons.lock}
                                                            className="w-8 h-8"
                                                            resizeMode='contain'
                                                            style={{tintColor: "#ff9c01"}}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                                </View>
                            </Animatable.View>
                            </View>
                            }
                        </View>
                    )}
                ) : <View style={styles.box} className=" bg-oBlack border border-black-200 rounded-[5px] p-0.5 py-4 pt-5">
                        <EmptyState
                            title={"Nuk u gjet asnje vijushmeri"}
                            titleStyle={"!font-pregular mb-2"}
                            subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo shfletoni kurse te reja duke klikuar ne butonin e meposhtem!"}
                            buttonTitle={"Shfletoni kurse"}
                            buttonFunction={() => router.replace('/categories')}
                        />
                    </View>}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
  })
export default UserProgressComponent