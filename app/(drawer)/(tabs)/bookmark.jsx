import { View, Text, ScrollView, Image, RefreshControl, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, icons } from '../../../constants'
import Loading from '../../../components/Loading'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { deleteBookmark, deleteBookmarkById, getBookmarks } from '../../../services/fetchingService'
import EmptyState from '../../../components/EmptyState'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import * as Animatable from "react-native-animatable"
import NotifierComponent from '../../../components/NotifierComponent'
import { useNavigateToSupport } from '../../../hooks/goToSupportType'
import { useColorScheme } from 'nativewind'

const bookmark = () => {
  const {colorScheme} = useColorScheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false)
  const [showCourses, setShowCourses] = useState(true)
  const [bookmarkData, setBookmarkData] = useState(null)
  const {data, isLoading, refetch} = useFetchFunction(() => getBookmarks())
  const onRefresh = async () => {
    setRefreshing(true)
    setIsCourseListEmpty([])
    setIsLessonsListEmpty([])
    await refetch()
    setRefreshing(false)
  }

  useEffect(() => {
    if(data){
      setBookmarkData(data);
    }else{
      setBookmarkData(null)
    }
    
    
  }, [data])

  useEffect(() => {
    refetch()
  
    return () => {
      refetch()
    }
  }, [])
  
  const filterData = () => {
    const courseData = data?.filter(item => item.course)
    const lessonData = data?.filter(item => item.lesson)
    return {courseLength: courseData.length, lessonLength: lessonData.length};
  }

  const navigateCourses = () => {
    router.push('/categories')
  }

  const {showNotification: bookmarkDeleted} = NotifierComponent({
    title: "Njoftim mbi favoritin tuaj!",
    description: "Favoriti juaj eshte fshire me sukses!",
    theme: colorScheme
  })

  const {showNotification: bookmarkNotDeleted} = NotifierComponent({
    title: "Njoftim mbi favoritin tuaj!",
    alertType: "warning",
    description: "Problem ne fshirjen e favoritit tuaj! Provoni perseri!",
    theme: colorScheme
  })

  const delBookmark = async (id) => {
    try {
      const response = await deleteBookmarkById(id);
      if(response === 200){
        await onRefresh()
        bookmarkDeleted()
      }else{
        bookmarkNotDeleted()
      }
    } catch (error) {
      console.error(error);
    }
  }
  const [isCourseListEmpty, setIsCourseListEmpty] = useState([])
  const [isLessonsListEmpty, setIsLessonsListEmpty] = useState([])
  const proceedLearning = (item, type) => {
    // console.log(item.courseId);
    if(type === 'course'){
      router.push(`/categories/course/${item?.courseId}`)
    }else if (type === 'lession'){      
      router.push(`/categories/course/lesson/${item?.lessonId}`)
    }
    
  }

  if(refreshing || isLoading){
    return (
      <Loading />
    )
  }else{
    return (
      <ScrollView 
        className="h-full bg-primary px-4 w-full"
        refreshControl={<RefreshControl  refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
        >
        <View>
          <Text className="text-white font-pmedium text-2xl mt-4">Favoritet tuaj!
            <View>
              <Image
                source={images.path}
                resizeMode="contain"
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
              />
            </View>
          </Text>
        </View>

        <View className="flex-row w-full items-center border border-black-200 mt-6 mb-4">
          <TouchableOpacity
            className={` w-1/2 items-center border-r border-black-200 p-2 ${showCourses ? "bg-oBlack" : ""}`}
            onPress={() => setShowCourses(true)}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white font-regular text-sm">Kurset</Text>
              <Image 
                source={icons.courses}
                resizeMode='contain'
                className="h-6 w-6"
                tintColor={"#ff9c01"}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-1/2 items-center p-2 ${!showCourses ? "bg-oBlack" : ""}`}
            onPress={() => setShowCourses(false)}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white font-regular text-sm">Leksionet</Text>
              <Image 
                source={icons.lectures}
                resizeMode='contain'
                className="h-6 w-6"
                tintColor={"#ff9c01"}
              />
            </View>
          </TouchableOpacity>
        </View>

        {bookmarkData ? (
        <View className="flex-col gap-4 w-full mt-4">
          {bookmarkData.map((bookItem, index) => {
          const date = new Date(bookItem?.createdAt);
          const formattedDate = date.toLocaleDateString('sq-AL', {
              year: 'numeric',
              month: 'long',  // Full month name
              day: 'numeric',
            });
          
            return showCourses ? (
              (filterData().courseLength === 0) ? (
                (index < 1 && <View
                  className="mt-12 border border-black-200 p-4 pt-6 rounded-[10px] w-full"
                >
                  <EmptyState 
                    title={"Nuk keni ndonje favorit aktual te kurseve!"}
                    titleStyle={"font-pmedium text-xl"}
                    subtitle={"Provoni te shkoni tek seksioni i leksioneve duke klikuar larte apo duke klikuar butonin me poshte"}
                    isBookMarkPage={true}
                    buttonTitle={"Vazhdo me veprimin"}
                    buttonFunction={() => setShowCourses(false)}
                  /> 
                </View>)
              ) : (
                (bookItem?.course && <View
                  key={bookItem?.id}
                  className="border border-black-200 rounded-[10px] p-4 relative w-full mb-6"
                  style={styles.box}
                >
                  <View className="absolute -right-2 -top-2 bg-oBlack rounded-[5px] p-2 px-8 border border-black-200">
                    <Text className="text-white font-pregular text-sm">Kurs favorit</Text>
                  </View>
                  <View  className="flex-row w-full">
                    <View className="flex-col gap-4 w-[75%]">
                      <View>
                        <Text className="text-white font-pregular text-xl">{bookItem.course?.courseName}</Text>
                      </View>
                      <View>
                        <Text className="text-gray-400 text-xs font-plight" numberOfLines={3}>{bookItem?.course?.courseDescription}</Text>
                        <TouchableOpacity onPress={() => proceedLearning(bookItem, 'course')}><Text className="text-secondary font-psemibold text-xs underline mt-2">Vazhdo kursin</Text></TouchableOpacity>
                      </View>
                    </View>
                    <View className="w-[35%] items-center">
                      <TouchableOpacity onPress={() => delBookmark(bookItem.id)} className="mt-1">
                        <Animatable.Image 
                          animation="pulse"
                          duration={700}
                          iterationCount="infinite"
                          easing="ease-in-out" 
                          source={icons.heart}
                          className="w-8 h-8"
                          resizeMode='contain'
                          tintColor={"#ff9c01"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="mt-2 justify-end items-end relative">
                    <Text className="text-sm font-psemibold text-white">{formattedDate}</Text>
                    <View className="absolute -left-6 -bottom-6 bg-secondary rounded-[5px] p-2 px-8">
                      <Text className="text-white font-pregular text-sm">{bookItem?.course?.category?.categoryName}</Text>
                    </View>
                  </View>
                </View>)
              )
            ) : (
              (filterData().lessonLength === 0) ? (
                (index < 1 && <View
                  className="mt-12 border border-black-200 p-4 pt-6 rounded-[10px] w-full"
                >
                  <EmptyState 
                    title={"Nuk keni ndonje favorit aktual te leksioneve!"}
                    titleStyle={"font-pmedium text-xl"}
                    subtitle={"Provoni te shkoni tek seksioni i kurseve duke klikuar larte apo duke klikuar butonin me poshte"}
                    isBookMarkPage={true}
                    buttonTitle={"Vazhdo me veprimin"}
                    buttonFunction={() => setShowCourses(true)}
                  /> 
                </View>)
              ) : (
                  (bookItem?.lesson && <View
                    key={bookItem?.id}
                    className="border border-black-200 rounded-[10px] p-4  w-full relative mb-6"
                    style={styles.box}
                  >
                    <View className="absolute -right-2 -top-2 bg-oBlack rounded-[5px] p-2 px-8 border border-black-200">
                      <Text className="text-white font-pregular text-sm">Leksion favorit</Text>
                    </View>
                    <View className="flex-row">
                      <View className="flex-col gap-4 w-[75%]">
                        <View>
                          <Text className="text-white font-pregular text-xl">{bookItem?.lesson?.lessonName}</Text>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-xs font-plight" numberOfLines={3}>{bookItem?.lesson?.lessonExcerpt}</Text>
                          <TouchableOpacity onPress={() => proceedLearning(bookItem, 'lession')}><Text className="text-secondary font-psemibold text-xs underline mt-2">Vazhdo ligjeraten</Text></TouchableOpacity>

                        </View>
                      </View>
                      <View className="w-[35%] items-center">
                        <TouchableOpacity onPress={() => delBookmark(bookItem?.id)} className="mt-1">
                          <Animatable.Image 
                            animation="pulse"
                            duration={700}
                            iterationCount="infinite"
                            easing="ease-in-out" 
                            source={icons.heart}
                            className="w-8 h-8"
                            resizeMode='contain'
                            tintColor={"#ff9c01"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="mt-2 justify-end items-end relative">
                      <Text className="text-sm font-psemibold text-white">{formattedDate}</Text>
                      <View className="absolute -left-6 -bottom-6 bg-secondary rounded-[5px] p-2 px-8">
                        <Text className="text-white font-pregular text-sm">{bookItem?.lesson?.course?.category?.categoryName}</Text>
                      </View>
                    </View>
                  </View>)
              )
            )
          })}<View>

          </View>
        </View> ) : (
          <View className="mt-12 border border-black-200 p-4 pt-6 rounded-[10px]">
            <EmptyState 
              title={"Nuk keni ndonje favorit aktual!"}
              titleStyle={"font-pmedium text-xl"}
              subtitle={"Nese mendoni qe ka ndodhur nje gabim ju lutem klikoni butonin e meposhtem!"}
              isBookMarkPage={true}
              buttonTitle={"Vazhdo tek Paneli Ndihmes"}
              buttonFunction={() => useNavigateToSupport("report")}
            /> 
        </View>)
        }

      </ScrollView>
    )
  }
}
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
})
export default bookmark