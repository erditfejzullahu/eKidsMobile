import { View, Text, ScrollView, StyleSheet, RefreshControl, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { getCourseCategories, GetMeetingInformation, StartOnlineCourse } from '../../../../services/fetchingService'
import { useLocalSearchParams } from 'expo-router'
import Loading from '../../../../components/Loading'
import { TouchableOpacity } from 'react-native'
import { icons, images } from '../../../../constants'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import * as Animatable from "react-native-animatable"
import CountdownTimer from '../../../../components/CountdownTimer'
import { currentUserID } from '../../../../services/authService'
import NotifierComponent from '../../../../components/NotifierComponent'
import * as Linking from "expo-linking"
import FullscreenWebViewModal from '../../../../components/FullscreenWebViewModal'
import { useRouter } from 'expo-router'
import { useNavigateToSupport } from '../../../../hooks/goToSupportType'

const Meetings = () => {
  const {id} = useLocalSearchParams();
  const {user, isLoading: userLoading} = useGlobalContext();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {data, isLoading, refetch} = useFetchFunction(() => GetMeetingInformation(id))
  const [meetingData, setMeetingData] = useState(null)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const navigateToSupport = useNavigateToSupport();
  //LOGJIKA NESE KA VIDEO QE U BA UPLOAD E SENE (dmth u kry online meetingu po me pas mundsin me kqyr online meetingun qe u kry)
  const startingDate = new Date(meetingData?.scheduleDateTime).toLocaleTimeString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "2-digit"
  })

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false)
  }

  const outputText = () => {
    if(!meetingData?.isAllowed){
      return (
        <TouchableOpacity onPress={becomeStudentOfInstructor} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <Text className="text-white font-psemibold uppercase">Nuk lejoheni</Text>
          <Image 
            source={icons.close}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
          <Text className="text-gray-400 font-plight text-xs absolute -bottom-6 bg-primary border border-black-200 rounded-md px-2 py-1 -ml-7" style={styles.box}>Kushtoni vemendje rubrikes ne fund!</Text>
        </TouchableOpacity>
      )
    }

    if(meetingData?.status === "Nuk eshte mbajtur(Mungese Instruktori)"){
      return (
        <TouchableOpacity onPress={() => navigateToSupport("report")} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <Text className="text-white font-psemibold uppercase">Paraqisni ankese</Text>
          <Image 
            source={icons.chat}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )
    }else if(meetingData?.status === "Eshte anuluar"){
      return (
        <TouchableOpacity onPress={() => navigateToSupport("report")} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <Text className="text-white font-psemibold uppercase">Paraqisni ankese</Text>
          <Image 
            source={icons.chat}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )
    }else if(meetingData?.status === "Nuk ka filluar ende"){
      return (
        <TouchableOpacity onPress={() => setShowMeetingModal(true)} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <CountdownTimer meetingData={meetingData}/>
          <Image 
            source={icons.clock}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )
    }else if(meetingData?.status === "Ka filluar"){
      return (
        <TouchableOpacity onPress={() => setShowMeetingModal(true)} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <Text className="text-white font-psemibold uppercase">Filloni tani</Text>
          <Image 
            source={icons.play2}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )
    }else if(meetingData?.status === "Ka perfunduar"){
      return (
        <TouchableOpacity onPress={() => setShowMeetingModal(true)} className="flex-row items-center gap-2 bg-primary p-4 border border-black-200" style={styles.box}>
          <Text className="text-white font-psemibold uppercase">Shiko materialin</Text>
          <Image 
            source={icons.videoConference}
            tintColor={"#ff9c01"}
            className="size-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )
    }
  }

  const outputMeetingTimeOutput = () => {
    
    if(meetingData?.status === "Nuk eshte mbajtur(Mungese Instruktori)"){
      return (
        <>
          <Text className="text-white font-psemibold">Ka pase te mbahet me: <Text className="text-secondary">{startingDate}</Text></Text>
        </>
      )
    }else if(meetingData?.status === "Ka perfunduar"){
      const date = new Date(meetingData?.scheduleDateTime);
      date.setMinutes(date.getMinutes() + meetingData?.durationTime)
      const finalDate = date.toLocaleTimeString("sq-AL", {
        day: "numeric",
        month: "short",
        year: "2-digit"
      })
      return (
        <>
          <Text className="text-white font-psemibold">Ka mbaruar takimi me: <Text className="text-secondary">{finalDate}</Text></Text>
        </>
      )
    }else if(meetingData?.status === "Ka filluar"){
      return (
        <Text className="text-white font-psemibold">Takimi eshte duke u mbajtur momentalisht</Text>
      )
    }else if(meetingData?.status === "Nuk ka filluar ende"){
      return (
        <>
          <Text className="text-white font-psemibold">Mbajtja e takimit: <Text className="text-secondary">{startingDate}</Text></Text>
        </>
      )
    }else if(meetingData?.status === "Ka perfunduar"){
      const date = new Date(meetingData?.scheduleDateTime);
      date.setMinutes(date.getMinutes() + meetingData?.durationTime)
      const finalDate = date.toLocaleTimeString("sq-AL", {
        day: "numeric",
        month: "short",
        year: "2-digit"
      })
      return (
        <Text className="text-white font-psemibold">Eshte mbaruar me: <Text className="text-secondary">{finalDate}</Text></Text>
      )
    }
  }

  const {showNotification: success} = NotifierComponent({
    title: "Sukses",
    description: `Ju tani mund te kyceni ne te gjithe permbajtjen e instruktorit ${meetingData?.instructor}`
  })

  const {showNotification: failed} = NotifierComponent({
    title: "Gabim",
    description: `Dicka shkoi gabim. Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes`,
    alertType: "warning"
  })

  const becomeStudentOfInstructor = async () => {
    const userId = await currentUserID();
    const payload = {
      userId,
      courseId: meetingData?.courseId,
      instructorId: meetingData?.instructorId
    }
    const response = await StartOnlineCourse(payload)
    if(response === 200){
      success();
      await refetch();
    }else{
      failed();
    }
  }

  useEffect(() => {
    console.log(data, ' data?');
    
    setMeetingData(data || null)
  }, [data])
  

  if(isLoading || isRefreshing) return <Loading />
  return (
    <>
    <ScrollView 
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      className="h-full bg-primary"
      >
        <View className="h-[140px] bg-oBlack border-b border-l border-r items-center justify-center relative border-black-200" style={styles.box}>
          <Image 
            source={images.logoNew}
            className="absolute w-full h-full p-2 left-0 right-0 top-0 bottom-0 z-0 opacity-30"
            resizeMode='contain'
          />
          <Image 
            source={icons.videoConference}
            className="absolute right-2 top-2 size-10 z-0 opacity-30"
            resizeMode='contain'
            tintColor={"#ff9c01"}
          />
          <Image 
            source={icons.videoCamera}
            className="absolute left-2 bottom-2 size-10 z-0 opacity-30"
            resizeMode='contain'
            tintColor={"#ff9c01"}
          />
          <Text className="text-white font-psemibold text-xs bg-primary absolute z-50 top-0 left-0 border-b border-r border-black-200 rounded-br-md px-2 py-1" style={styles.box}>{meetingData?.status}</Text>
          {outputText()}
        </View>
        <View className="bg-primary border-b border-l border-r border-black-200 p-4" style={styles.box}>
          {outputMeetingTimeOutput()}
        </View>


        <View className="p-4 pb-2">
          <View className="bg-oBlack p-2 mb-1 rounded-md border border-black-200 relative" style={styles.box}>
            <Image 
              source={icons.infoFilled}
              tintColor={"#ff9c01"}
              className="size-4 absolute -right-2 -top-2"
              resizeMode='contain'
            />
            <Text className="text-gray-400 font-plight text-xs">Vegeza ne rast se deshironi te ridrejtoheni tek shfletuesi:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`https://2xd0xqpd-3000.euw.devtunnels.ms/room/${meetingData?.meetingUrl}`)}>
              <Animatable.Text animation={{from: {transform: [{scale: 1}, {translateX: 0}]}, to: {transform: [{scale: 1.03}, {translateX: 5}]}}} duration={3000} direction="alternate" iterationCount="infinite" className="text-secondary font-psemibold text-xs">https://2xd0xqpd-3000.euw.devtunnels.ms/room/{meetingData?.meetingUrl}</Animatable.Text>
            </TouchableOpacity>
          </View>
          <View className="bg-oBlack p-2 mb-3 rounded-md border border-black-200 relative" style={styles.box}>
            <Image 
              source={icons.infoFilled}
              tintColor={"#ff9c01"}
              className="size-4 absolute -right-2 -top-2"
              resizeMode='contain'
            />
            <Text className="text-gray-400 font-plight text-xs">Ne klikim te vegezes, ju duheni te kyceni me llogarine e njejte qe jeni ne perdorim aktual</Text>
          </View>
          <Text className="text-white font-psemibold">Pershkrimi i takimit</Text>
          <Text className="text-gray-400 font-plight text-sm mt-1">{meetingData?.description}</Text>
        </View>

        <View className="mx-4">
          <View className="border border-black-200 p-4 bg-oBlack" style={styles.box}>
            {meetingData?.course && <View>
              <Text className="text-white font-psemibold mb-2">Detaje te kursit:</Text>
              <Text className="text-white font-plight text-sm">Titulli: <Text className="font-psemibold text-secondary">{meetingData?.course?.name}</Text></Text>
            </View>}
            <Text className="text-white font-plight text-sm">Kategoria: <Text className="font-psemibold text-secondary">{getCourseCategories(user?.data?.categories, meetingData?.course?.categoryId)}</Text></Text>

            <TouchableOpacity onPress={() => router.replace(`tutor/${meetingData?.instructorId}`)}>
              <Animatable.View animation="pulse" iterationCount="infinite" duration={4000} className="mt-2 flex-row items-center gap-2 border border-black-200 rounded-md p-2 bg-primary" style={styles.box}>
                <Image 
                  source={{uri: meetingData?.profilePictureUrl}}
                  className="size-14 border border-black-200 rounded-md p-1"
                  resizeMode='contain'
                />
                <View>
                  <Text className="text-white font-plight text-sm">{meetingData?.instructor}</Text>
                  <Text className="text-gray-400 font-plight text-sm">Instruktor</Text>
                </View>
              </Animatable.View>
            </TouchableOpacity>
          </View> 
        </View>

      <View className="mb-4">
        {meetingData?.lesson && <View className="mx-4 mt-4">
          <View className="border border-black-200 p-4 bg-oBlack" style={styles.box}>
            <Text className="text-white font-psemibold mb-2">Detaje te leksionit:</Text>
            <Text className="text-white font-plight text-sm">Titulli: <Text className="font-psemibold text-secondary">{meetingData?.lesson?.title}</Text></Text>
            {meetingData?.lesson?.content && <Text className="text-gray-400 font-plight text-sm">{meetingData?.lesson?.content}</Text>}
          </View> 
        </View>}

        {!meetingData?.isAllowed && <Animatable.View animation={{from: {scale: 1}, to: {scale: 1.02}}} direction="alternate" iterationCount="infinite" easing="ease-in-out" duration={1000}>
          <TouchableOpacity onPress={becomeStudentOfInstructor} className="mt-4 bg-primary border border-black-200 p-4" style={styles.box}>
            <Text className="text-secondary font-psemibold text-sm">Vemendje:</Text>
            <Text className="text-white font-plight text-xs">Ju nuk jeni student te instruktorit <Text className="text-secondary">{meetingData?.instructor}</Text>. Per te vazhduar me tutje ne ndjekjen e ligjeratave te instruktorit ne fjale, ju duhet te beheni studente te tij/saj. <Text className="text-secondary">Kikoni ketu per te proceduar kerkesen.</Text></Text>
          </TouchableOpacity>
        </Animatable.View>}
      </View>
    </ScrollView>

    <FullscreenWebViewModal visible={showMeetingModal} onClose={() => setShowMeetingModal(false)} url={`https://2xd0xqpd-3000.euw.devtunnels.ms/room/${meetingData?.meetingUrl}`}/>
    </>
  )
}

export default Meetings

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