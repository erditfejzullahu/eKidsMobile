import { View, Text, ScrollView, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { useLocalSearchParams } from 'expo-router'
import Loading from '../../../../components/Loading'
import { GetCourseById, StartOnlineCourse } from '../../../../services/fetchingService'
import { Platform } from 'react-native'
import { icons, images } from '../../../../constants'
import * as Animatable from "react-native-animatable"
import OnlineCourseSectionExpander from '../../../../components/OnlineCourseSectionExpander'
import { useRouter } from 'expo-router'
import NotifierComponent from '../../../../components/NotifierComponent'
import { currentUserID } from '../../../../services/authService'

const OnlineClass = () => {
  const router = useRouter();
  const {id} = useLocalSearchParams()
  
  const {data, isLoading, refetch} = useFetchFunction(() => GetCourseById(id))
  const [courseData, setCourseData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false)
  }

  const {showNotification: success} = NotifierComponent({
    title: "Sukses",
    description: `Sapo filluat kursin ${courseData?.courseName}. Tani do te ridrejtoheni tek leksionet vijuese`
  })

  const {showNotification: failed} = NotifierComponent({
    title: "Gabim",
    description: "Dicka shkoi gabim, ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
    alertType: "warning"
  })

  const handleCourseStart = async () => {
    if(enrolled){
      router.replace(`/`)
    }else{
      const userId = await currentUserID();
      const payload = {
        userId,
        courseId: courseData?.id,

      }
      const response = await StartOnlineCourse(payload)
      if(response === 200){
        success();
      }else{
        failed();
      }
    }
  }

  useEffect(() => {
    console.log(data);
    
    setCourseData(data || null)
  }, [data])

  useEffect(() => {
    refetch()
  }, [id])

  if(isLoading || isRefreshing || !courseData) return <Loading />
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      className="h-full bg-primary"
    >
      <View className="h-[200px] relative border-b border-r border-l border-black-200" style={styles.box}>
        {courseData?.image ? (
          <Image 
            source={{uri: courseData?.image}}
            className="h-full w-full"
            resizeMode='cover'
          />
        ) : (
          <Image 
            source={images.logoNew}
            className="h-full w-full p-4 bg-primary"
            resizeMode='contain'
          />
        )}

        <View className="absolute top-0 left-0 bg-oBlack p-3 rounded-br-md border-r border-b border-black-200" style={styles.box}>
          <Animatable.Image
            animation="pulse"
            iterationCount="infinite" 
            duration={3000}
            source={icons.completedProgress}
            className="size-8"
            tintColor={"#ff9c01"}
            resizeMode='contain'
          />
        </View>

        <TouchableOpacity className="absolute right-0 top-0">
          <Animatable.View animation="pulse" iterationCount="infinite" duration={2500} className="p-2 flex-row gap-2 items-center bg-oBlack border border-black-200 rounded-md" style={styles.box}>
            <View>
              <Image 
                source={{uri: courseData.instructorProfilePicture}}
                className="size-10 rounded-md border border-black-200"
                resizeMode='contain'
              />
            </View>
            <View className="max-w-[100px]">
              <Text className="text-white font-psemibold text-base" numberOfLines={1}>{courseData.intructorName}</Text>
              <Text className="text-gray-400 font-plight text-xs">Instruktor</Text>
            </View>
          </Animatable.View>
        </TouchableOpacity>
      </View>
      <View className="border-b relative border-l border-r border-black-200 bg-oBlack p-4 flex-row items-center justify-between" style={styles.box}>
        <Text className="text-white font-psemibold text-xl">{courseData.courseName}</Text>
        <TouchableOpacity className="bg-primary p-2 border items-center justify-between gap-2 border-black-200 rounded-md" style={styles.box}
          onPress={handleCourseStart}
        >
          <Animatable.Image 
            animation="pulse"
            iterationCount="infinite"
            source={icons.play2}
            className="size-5"
            resizeMode='contain'
            tintColor={"#ff9c01"}
          />
        </TouchableOpacity>
        <Text className="text-gray-400 text-xs font-plight absolute -top-3.5 right-4 bg-primary border border-black-200 rounded-md px-2 py-1" style={styles.box}>{courseData.enrolled ? "Vazhdoni" : "Filloni"}</Text>
      </View>
      <View className="p-4">
        <Text className="text-white font-psemibold">Permbajtja</Text>
        <Text className="text-gray-400 text-xs font-plight">{courseData.courseDescription}</Text>
      </View>
      <View className="p-4 border border-black-200 bg-primary mb-6" style={styles.box}>
        <Text className="text-white font-psemibold">Ne cka do shkelqeni ne fund?</Text>
        {courseData?.topicsCovered && (
          <View className="flex-row flex-wrap justify-between gap-2 border border-black-200 p-4 mt-2 bg-oBlack" style={styles.box}>
            {JSON.parse(courseData.topicsCovered).map((item, idx) => (
              <>
              <View className={`flex-row items-center gap-1 w-[48%] ${JSON.parse(courseData.topicsCovered)?.length > 1 ? "pb-2 pr-1" : ""}`} key={idx}>
                <Image 
                  source={icons.tick}
                  tintColor={"#ff9c01"}
                  className="size-5"
                  resizeMode='contain'
                />
                <Text className="text-gray-400 text-xs font-plight">{item}</Text>
              </View>
          </>
            ))}
          </View>
        )}
      </View>

      <View className="relative">
        <Text className="text-white font-plight px-1.5 py-0.5 text-xs bg-secondary rounded-md border border-white  absolute -top-2 left-2 z-50" style={styles.box}>Planprogrami mesimor i ndare ne seksione</Text>
        <OnlineCourseSectionExpander sections={courseData?.sections} />
      </View>
    </ScrollView>
  )
}

export default OnlineClass

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