import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"
import Modal from "../components/Modal"
import { acceptFriendRequest, getCourseCategories, InstructorCreatedCoursesById, makeUserFriendReq, removeFriendReq, removeFriendRequestReq, StartOnlineCourse } from '../services/fetchingService'
import EmptyState from './EmptyState'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'
import Loading from './Loading'
import { icons } from '../constants'
import { navigateToMessenger } from '../hooks/useFetchFunction'
import { useRouter } from 'expo-router'
import CustomModal from '../components/Modal'

const STDINProfileFirstSection = ({data, userData, relationStatus, relationRefetch}) => {
    console.log(data);
    
    const router = useRouter();
    const [courseModal, setCourseModal] = useState(false)
    const [coursesData, setCoursesData] = useState([])
    const [removeFriendModal, setRemoveFriendModal] = useState(false)
    const [showbio, setShowbio] = useState(false)

    const [coursesLoading, setCoursesLoading] = useState(false)
    const getCourses = async () => {
        setCoursesLoading(true)
        const response = await InstructorCreatedCoursesById(data?.instructorId);
        setCoursesData(response);
        setCoursesLoading(false)
    }

    const date = new Date(data?.whenBecameInstructor).toLocaleDateString("sq-AL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    const {showNotification: success} = NotifierComponent({
        title: "Sukses",
        description: `Sapo filluat kursin e zgjedhur. Mund te drejtoheni tek kursi duke naviguar tek Profili juaj/Progresi ose tek seksioni Mesoni Online`
      })
    
      const {showNotification: failed} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim, ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
      })

    const handleBeStudentCourseId = async (item) => {
        const userId = await currentUserID();
        const payload = {
            userId,
            courseId: item?.id,
            instructorId: data?.instructorId
          }
        const response = await StartOnlineCourse(payload)
        if(response === 200){
            success()
            setCourseModal(false);
        }else{
            failed()
        }
    }

    const outputRelation = () => {
        if(relationStatus === null){
          return 0 // Shto miqesine 0
        }else{
          if((relationStatus?.senderId !== userData?.data?.userData?.id) && relationStatus?.status === 1){
            return 1 //ma ka qu aj mu // 1 //Shoqerohu!
          }else if((relationStatus?.senderId === userData?.data?.userData?.id) && relationStatus?.status === 1){
            return 2 // ja kom qu un atij // 2 //Ne pritje
          }else if((relationStatus?.receiverId !== userData?.data?.userData?.id) && relationStatus?.status === 1){
            return 1;
          }else if((relationStatus?.receiverId === userData?.data?.userData?.id) && relationStatus?.status === 1){
            return 2;
          }else{
            return 3 //shoqerohu
          }
        }
    }

    const { showNotification: successFriendReq } = NotifierComponent({
        title: "Kerkesa shkoi me sukes!",
        description: "Per statusin e miqesise do te njoftoheni tek seksioni i notifikimeve",
    })

    const {showNotification: successFriendDeletion} = NotifierComponent({
    title: "Kerkesa shkoi me sukses!",
    description: `Sapo e larguat ${data?.instructorName} nga statusi juaj miqesor me perdorues!`
    })

    const { showNotification: failedReq } = NotifierComponent({
    title: "Dicka shkoi gabim!",
    description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
    alertType: "warning"
    })

    const makeFriend = async () => {
        
        const payload = {
            userId: userData?.data?.userData?.id,
            receiverId: data?.userId,
            information: "user req",
            type: 4
        };
        const response = await makeUserFriendReq(payload)
        if(response === 200){
            successFriendReq()
        await relationRefetch();
        }else{
            failedReq()
        }
    }

    const acceptFriend = async () => {
        const response = await acceptFriendRequest(relationStatus?.senderId, relationStatus?.receiverId)
        if(response === 200){
            await refreshData();
        }else{
            failedReq()
        }
    }

    const removeOnWaitingFriend = async () => {
        const response = await removeFriendRequestReq(data?.userId);
        if(response === 200){
            await relationRefetch();
        }else{
            failedReq();
        }
    }

    const removeFriend = async () => {
        const response = await removeFriendReq(data?.userId)
        if(response === 200){
            successFriendDeletion()
            setRemoveFriendModal(false);
            await refreshData()
        }else{
            setRemoveFriendModal(false);
            failedReq()
        }
    }

    const contactInstructor = () => {
        const instructorData = {
            id: data?.userId,
            firstname: data?.instructorName.split(" ")[0],
            lastname: data?.instructorName.split(" ")[1],
            username: data?.instructorUsername,
            profilePictureUrl: data?.profilePictureUrl,
        }
        
        navigateToMessenger(router, instructorData, userData?.data?.userData);
    }

    useEffect(() => {
        let timeout;
      if(courseModal){
        getCourses()
      }else{
        timeout = setTimeout(() => {
            setCoursesData([])
        }, 1000);
      }

      return () => {
        if(timeout){
            clearTimeout(timeout);
        }
      }
    }, [courseModal])
    

  return (
    <>
    <View className="relative items-center justify-center mt-20">
        <View className="gap-4">
            <View className="rounded-lg p-2 bg-secondary self-start mx-auto">
                <Image
                    source={{uri: data?.profilePictureUrl}}
                    className="h-10 w-10 rounded-md"
                    resizeMode='contain'
                />
            </View>
            <View>
                <Text className="text-xl font-psemibold text-white text-center mb-1">{data?.instructorName}</Text>
                <Text className="text-gray-400 text-sm font-plight text-center mt-1">{data?.email}</Text>
                <Text className="text-secondary text-sm font-psemibold text-center mt-1">{data?.expertise}</Text>
                {!showbio && <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
                    <TouchableOpacity className="self-start mx-auto" onPress={() => setShowbio(true)}>
                        <Text className="text-white font-psemibold text-sm text-center bg-secondary border border-white rounded-md px-3 py-1 mt-4" style={styles.box}>Shfaq biografine</Text>
                    </TouchableOpacity>
                </Animatable.View>}
                {showbio && <Animatable.Text animation="fadeInLeft" className="text-gray-400 text-xs font-light italic px-2 text-center mt-1">{data?.bio}</Animatable.Text>}
            </View>
        </View>
        {data?.isYourInstructor ? (
            <View>
                <Text className="text-white font-psemibold text-sm text-center bg-secondary border border-white rounded-md px-3 py-1 mt-4" style={styles.box}>Tutori Juaj</Text>
            </View>
        ) : (
            <TouchableOpacity onPress={() => setCourseModal(true)} className="py-1 px-3 border border-white bg-secondary rounded-md mt-4" style={styles.box}>
                <Animatable.Text animation="pulse" iterationCount="infinite" className="text-white font-psemibold text-sm">Behuni student</Animatable.Text>
            </TouchableOpacity>
        )}

        <View className="max-w-[350px] flex-row flex-1 mx-auto gap-4 mt-6" style={styles.box}>
            <TouchableOpacity onPress={outputRelation() === 0 ? makeFriend : outputRelation() === 1 ? acceptFriend : outputRelation() === 2 ? removeOnWaitingFriend : outputRelation() === 3 ? () => setRemoveFriendModal(true) : {}} className="bg-secondary py-3 w-[150px] rounded-[10px] border border-white flex-row items-center justify-center gap-2">
                <Text className="text-white font-psemibold text-base text-center">{outputRelation() === 0 ? "Shto miqesine" : outputRelation() === 1 ? "Shoqerohu!" : outputRelation() === 2 ? "Ne pritje" : outputRelation() === 3 ? "Largo miqesine" : "default"}</Text>
                <Image 
                source={icons.friends}
                className="w-6 h-6"
                resizeMode='contain'
                tintColor={"#fff"}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={contactInstructor} className="bg-oBlack py-3 w-[150px] rounded-[10px] border border-black-200 flex-row items-center justify-center gap-2">
                <Text className="text-white font-psemibold text-base text-center">Kontakto</Text>
                <Image 
                source={icons.report}
                className="w-6 h-6"
                resizeMode='contain'
                tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>

        <Text className="text-white font-psemibold text-sm mt-3 border bg-oBlack border-black-200 rounded-md px-2 py-1 absolute -top-10 left-12" style={[styles.box, {transform: [{rotate: "-30deg"}]}]}>Qe nga <Text className="text-secondary">{date}</Text></Text>
    </View>

    <CustomModal
      visible={removeFriendModal}
      showButtons={true}
      title={"Njoftim mbi veprimin"}
      onClose={() => setRemoveFriendModal(false)}
      onProcced={removeFriend}
      cancelButtonText={"Largoni dritaren!"}
      proceedButtonText={"Largo miqesine!"}
    >
        <Text className="text-white font-plight text-sm text-center my-2">Nga ky veprim ju largoni miqesine me <Text className="text-secondary font-psemibold">{data?.instructorName}.</Text> Nese jeni te sigurte vazhdoni me veprimin nga butoni me poshte ose largoni dritaren!</Text>
    </CustomModal>

    <Modal
        visible={courseModal}
        onClose={() => setCourseModal(false)}
        onlyCancelButton={true}
        cancelButtonText={"Largoni dritaren"}
        title={"Zgjidhni me poshte"}
    >
        {coursesData.length > 0 && !coursesLoading && <Text className="text-gray-400 font-plight text-xs mt-1 text-center">Me ane te listes se gjeneruar me poshte, ju mund te zgjidhni nje kurs ne te cilin mund te beheni studente i <Text className="text-secondary">{data?.instructorName}</Text></Text>}
        {coursesLoading ? <View className="h-[120px]"><Loading /></View> : 
        (coursesData.length === 0 ? (
                <View className="-mt-14">
                <EmptyState 
                    title={"Nuk eshte gjetur ndonje kurs"}
                    subtitle={"Nese mendoni qe eshte gabim, provoni perseri apo kontaktoni panelin e ndihmes"}
                    showButton={false}
                    isSearchPage={true}
                />
                </View>
        ) : (
            <ScrollView className="h-[150px] gap-2 mt-2 bg-oBlack w-full rounded-md border-black-200 border" style={styles.box}>
            {coursesData.map((item) => {
                const date = new Date(item.createdAt).toLocaleDateString("sq-AL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                return (
                    <TouchableOpacity onPress={() => handleBeStudentCourseId(item.id)} key={item.id} className="bg-oBlack p-2 border-b relative border-black-200 rounded-b-md" style={styles.box}>
                        <Text className="text-white font-psemibold text-base">{item.name}</Text>
                        <Text className="text-gray-400 font-plight text-xs">{getCourseCategories(userData?.data?.categories, item.categoryId)}</Text>
                        <Text className="absolute bottom-0 right-0 bg-primary border-t border-l border-black-200 rounded-tl-md rounded-br-md px-2 py-0.5 text-white font-psemibold text-xs" style={styles.box}>{date}</Text>
                    </TouchableOpacity>
                )
            }
            )}
            </ScrollView>
        ))
        }
    </Modal>
    </>
  )
}

export default STDINProfileFirstSection

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