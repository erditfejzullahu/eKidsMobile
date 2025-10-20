import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { useLocalSearchParams } from 'expo-router'
import Loading from '../../../../components/Loading'
import { GetCourseById, StartOnlineCourse } from '../../../../services/fetchingService'
import { icons, images } from '../../../../constants'
import * as Animatable from "react-native-animatable"
import OnlineCourseSectionExpander from '../../../../components/OnlineCourseSectionExpander'
import { useRouter } from 'expo-router'
import NotifierComponent from '../../../../components/NotifierComponent'
import { currentUserID } from '../../../../services/authService'
import CustomModal from '../../../../components/Modal'
import ShareToFriends from '../../../../components/ShareToFriends'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../../../../hooks/useShadowStyles'

const OnlineClass = () => {
  const {shadowStyle} = useShadowStyles();
  const {colorScheme} = useColorScheme();
  const router = useRouter();
  const {id} = useLocalSearchParams()
  
  const {data, isLoading, refetch} = useFetchFunction(() => GetCourseById(id))
  const [courseData, setCourseData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {user, isLoading: userLoading} = useGlobalContext()

  const [instructorMoreInformation, setInstructorMoreInformation] = useState(false)

  const [openInformationModal, setOpenInformationModal] = useState(false)
  
  const instructorRef = useRef(null)
  const scrollViewRef = useRef(null);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false)
  }, [setIsRefreshing, refetch])

  const {showNotification: success} = useMemo(() => NotifierComponent({
    title: "Sukses",
    description: `Sapo filluat kursin ${courseData?.courseName}. Tani do te ridrejtoheni tek leksionet vijuese`,
    theme: colorScheme
  }), [colorScheme])

  const {showNotification: failed} = useMemo(() => NotifierComponent({
    title: "Gabim",
    description: "Dicka shkoi gabim, ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
    alertType: "warning",
    theme: colorScheme
  }), [colorScheme])

  const {showNotification: becomeStudent} = useMemo(() => NotifierComponent({
    title: "Gabim",
    description: "Per te proceduar tek leksioni i klikuar, ju duhet te filloni kursin",
    alertType: "warning",
    theme: colorScheme
  }), [colorScheme])

  const handleCourseStart = useCallback(async () => {
    if(courseData?.routes?.enrolled){
      router.replace(`meetings/${courseData?.routes?.routeTo?.id}`)
    }else{
      const userId = await currentUserID();
      
      const payload = {
        userId,
        courseId: courseData?.courseId,
        instructorId: courseData?.instructorId
      }

      const response = await StartOnlineCourse(payload)
      if(response === 200){
        success();
        // router.replace();
      }else{
        failed();
      }
    }
  }, [router, courseData, StartOnlineCourse])

  const handleGoToInstructor = useCallback(() => {
    instructorRef.current?.measure((x, y, width, height, pageX, pageY) => {
      if (pageY !== undefined) {
        scrollViewRef.current?.scrollTo({ y: pageY, animated: true });
      }
    });
    
    if (!instructorMoreInformation) {
      setInstructorMoreInformation(true);
    }
  }, [setInstructorMoreInformation, scrollViewRef, instructorRef, instructorMoreInformation]);


  const proceedToAvailableRoute = useCallback((id) => {
    if(courseData?.routes?.enrolled){
      router.replace(`meetings/${id}`)
    }else{
      becomeStudent()
    }
  }, [router, courseData, becomeStudent])

  useEffect(() => {
    setCourseData(data || null)
  }, [data])

  useEffect(() => {
    refetch()
  }, [id])

  if(isLoading || isRefreshing || !courseData) return <Loading />
  return (
    <ScrollView
    ref={scrollViewRef}
      refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
      className="h-full bg-primary-light dark:bg-primary"
    >
      <View className="h-[200px] relative border-b border-r border-l border-gray-200 dark:border-black-200" style={shadowStyle}>
        {courseData?.image ? (
          <Image 
            source={{uri: courseData?.image}}
            className="h-full w-full"
            resizeMode='cover'
          />
        ) : (
          <Image 
            source={images.logoNew}
            className="h-full w-full p-4 bg-primary-light dark:bg-primary"
            resizeMode='contain'
          />
        )}

        <View className="absolute top-0 left-0 bg-oBlack-light dark:bg-oBlack p-3 rounded-br-md border-r border-b border-gray-200 dark:border-black-200" style={shadowStyle}>
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

        <TouchableOpacity className="absolute right-0 top-0" onPress={handleGoToInstructor}>
          <Animatable.View animation="pulse" iterationCount="infinite" duration={2500} className="p-2 flex-row gap-2 items-center bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle}>
            <View>
              <Image 
                source={{uri: courseData.instructorProfilePicture}}
                className="size-10 rounded-md border border-gray-200 dark:border-black-200"
                resizeMode='contain'
              />
            </View>
            <View className="max-w-[100px]">
              <Text className="text-oBlack dark:text-white font-psemibold text-base" numberOfLines={1}>{courseData.intructorName}</Text>
              <Text className="text-gray-600 dark:text-gray-400 font-plight text-xs">Instruktor</Text>
            </View>
          </Animatable.View>
        </TouchableOpacity>
      </View>
      <View className="border-b relative border-l border-r border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack p-4 flex-row items-center justify-between" style={shadowStyle}>
        <Text className="text-oBlack dark:text-white font-psemibold text-xl">{courseData.courseName}</Text>
        <TouchableOpacity className="bg-primary-light dark:bg-primary p-2 border items-center justify-between gap-2 border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle}
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
        <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight absolute -top-3.5 right-4 bg-primary-light dark:bg-primary border border-gray-200 dark:border-black-200 rounded-md px-2 py-1" style={shadowStyle}>{courseData?.routes?.enrolled ? "Vazhdoni" : "Filloni"}</Text>
      </View>
      <View className="p-4">
        <Text className="text-oBlack dark:text-white font-psemibold">Permbajtja</Text>
        <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight">{courseData.courseDescription}</Text>
      </View>
      <View className="p-4 border border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary mb-6" style={shadowStyle}>
        <Text className="text-oBlack dark:text-white font-psemibold">Ne cka do shkelqeni ne fund?</Text>
        {courseData?.topicsCovered && (
          <View className="flex-row flex-wrap justify-between gap-2 border border-gray-200 dark:border-black-200 p-4 mt-2 bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
            {JSON.parse(courseData.topicsCovered).map((item, idx) => (
              <View className={`flex-row items-center gap-1 w-[48%] ${JSON.parse(courseData.topicsCovered)?.length > 1 ? "pb-2 pr-1" : ""}`} key={`topics-${idx}`}>
                <Image 
                  source={icons.tick}
                  tintColor={"#ff9c01"}
                  className="size-5"
                  resizeMode='contain'
                />
                <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight">{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="relative">
        <TouchableOpacity onPress={() => setOpenInformationModal(!openInformationModal)} className="absolute right-4 -top-4 z-50 p-2 bg-secondary dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle}>
          <Animatable.Image
            animation={"pulse"}
            iterationCount={"infinite"}
            duration={1000}
            source={icons.infoFilled}
            className="size-5"
            tintColor={"#fff"}
          />
        </TouchableOpacity>

        <Text className="text-white font-plight px-1.5 py-0.5 text-xs bg-secondary rounded-md border border-white  absolute -top-2 left-2 z-50" style={shadowStyle}>Planprogrami mesimor i ndare ne seksione</Text>
        <OnlineCourseSectionExpander currentUserData={user} sections={courseData?.sections} handleInformationBar={() => setOpenInformationModal(true)} proceedToAvailableRoute={proceedToAvailableRoute}/>
      </View>

      <View ref={instructorRef} className="p-4 border border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary my-4" style={shadowStyle}>
        <Text className="text-oBlack dark:text-white font-psemibold">Me shume rreth instruktorit</Text>

        <TouchableOpacity onPress={() => router.replace(`tutor/${courseData?.instructorId}`)} className="flex-row flex-wrap items-center justify-between gap-2 border border-gray-200 dark:border-black-200 p-4 mt-2 bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
          <View className="flex-row gap-2 items-center">
            <View>
              <Image 
                source={{uri: courseData?.instructorProfilePicture}}
                className="size-14"
                resizeMode='contain'
              />
            </View>
            <View>
              <Text className="text-oBlack dark:text-white font-psemibold">{courseData?.intructorName}</Text>
              <Text className="text-gray-600 dark:text-gray-400 font-plight text-xs">{courseData?.instructorExpertise}</Text>
            </View>
          </View>
          <View>
            <Image 
              source={icons.play2}
              className="size-6"
              tintColor={"#ff9c01"}
              resizeMode='contain'
            />
          </View>

          {!instructorMoreInformation && <View className="absolute left-0 right-0 -bottom-2 items-center justify-center mx-auto">
            <TouchableOpacity className="bg-secondary self-start mx-auto" onPress={() => setInstructorMoreInformation(true)}>
              <Text className="text-white font-psemibold text-xs border border-white px-2 py-0.5">Shiko me shume</Text>
            </TouchableOpacity>
          </View>}
        </TouchableOpacity>

        {instructorMoreInformation && <View className="flex-row flex-wrap items-center justify-between gap-2 border border-gray-200 dark:border-black-200 p-4 mt-2 bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
          <Text className="text-gray-600 dark:text-gray-100 font-plight text0-sm">{courseData?.instructorBio}</Text>
          <TouchableOpacity onPress={() => router.replace(`tutorCourses/${courseData?.instructorId}`)} className="bg-primary-light dark:bg-primary items-center flex-row gap-2 border border-gray-200 dark:border-black-200 px-2 py-1" style={shadowStyle}>
            <Text className="text-oBlack dark:text-white font-pmedium text-sm">Shfletoni te gjitha kurset</Text>
            <Image 
              source={icons.courses}
              className="size-6"
              resizeMode='contain'
              tintColor={"#ff9c01"}
            />
          </TouchableOpacity>
        </View>}
        {!instructorMoreInformation && <TouchableOpacity onPress={() => router.replace(`tutorCourses/${courseData?.instructorId}`)} className="bg-primary-light dark:bg-primary mt-6 self-start items-center flex-row gap-2 border border-gray-200 dark:border-black-200 px-2 py-1" style={shadowStyle}>
          <Text className="text-oBlack dark:text-white font-pmedium text-sm">Shfletoni te gjitha kurset</Text>
          <Image 
            source={icons.courses}
            className="size-6"
            resizeMode='contain'
            tintColor={"#ff9c01"}
          />
        </TouchableOpacity>}
      </View>

      {/* informacione per imazhe te leksioneve tek seksionet */}
      <CustomModal 
        onClose={() => setOpenInformationModal(false)}
        visible={openInformationModal}
        title={"Informacione mbi leksione"}
        onlyCancelButton={true}
        cancelButtonText={"Largo dritaren"}
      >
        <View className="">
          <Text className="text-gray-600 dark:text-gray-400 font-plight text-sm text-center">Gjate shfletimit te dritares se kursit, mund te shfletoni manualisht leksionet e kaluara, ku do mund te shihni disponueshmerine e materialit te leksionit perkates</Text>

          <View className="bg-oBlack-light dark:bg-oBlack items-center rounded-md p-2 border border-gray-200 dark:border-black-200 mt-2" style={shadowStyle}>
            <View className="flex-row items-center justify-center w-full gap-2">
              <View className="border border-gray-200 dark:border-black-200 rounded-md bg-secondary dark:bg-oBlack p-1 items-center justify-center" style={shadowStyle}>
                <Animatable.Image
                  animation={"pulse"}
                  iterationCount={"infinite"}
                  duration={2000}
                  source={icons.play2}
                  className="size-4"
                  resizeMode='contain'
                  tintColor={colorScheme === "dark" ? "#ff9c01" : "#fff"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-plight text-oBlack dark:text-white text-xs">Ky imazh tregon se leksioni ne fjale, ka material/ka ndodhur</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center w-full mt-2 gap-2">
              <View className="border border-gray-200 dark:border-black-200 rounded-md bg-secondary dark:bg-oBlack p-1 items-center justify-center" style={shadowStyle}>
                <Animatable.Image
                  animation={"pulse"}
                  iterationCount={"infinite"}
                  duration={2000}
                  source={icons.close}
                  className="size-4"
                  resizeMode='contain'
                  tintColor={colorScheme === "dark" ? "#b91c1c" : "#fff"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-plight text-oBlack dark:text-white text-xs">Ky imazh tregon se leksioni ne fjale, nuk ka material/nuk ka ndodhur <Text className="font-psemibold text-secondary">(nuk mund te navigoheni)</Text></Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center w-full mt-2 gap-2">
              <View className="border border-gray-200 dark:border-black-200 rounded-md bg-secondary dark:bg-oBlack p-1 items-center justify-center" style={shadowStyle}>
                <View className="flex-row items-center gap-0.5">
                  <Animatable.Image
                    animation={"pulse"}
                    iterationCount={"infinite"}
                    duration={2000}
                    source={icons.close}
                    className="size-4"
                    resizeMode='contain'
                    tintColor={colorScheme === "dark" ? "#b91c1c" : "#fff"}
                  />
                  <Animatable.Image
                    animation={"pulse"}
                    iterationCount={"infinite"}
                    duration={2000}
                    source={icons.videoCamera}
                    className="size-4"
                    resizeMode='contain'
                    tintColor={colorScheme === "dark" ? "#b91c1c" : "#fff"}
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-plight text-oBlack dark:text-white text-xs">Ky imazh tregon se leksioni ne fjale, nuk ka ndodhur por ka material <Text className="font-psemibold text-secondary">(mund te navigoheni)</Text></Text>
              </View>
            </View>

          </View>
        </View>
      </CustomModal>
      {/* informacione per imazhe te leksioneve tek seksionet */}
      <ShareToFriends
        currentUserData={user?.data?.userData}
        shareType={"instructorCourse"}
        passedItemId={id}
      />
    </ScrollView>
  )
}

export default OnlineClass