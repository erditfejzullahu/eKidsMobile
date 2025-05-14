import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"
import Modal from "../components/Modal"
import { getCourseCategories, InstructorCreatedCoursesById, StartOnlineCourse } from '../services/fetchingService'
import EmptyState from './EmptyState'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'
import Loading from './Loading'

const STDINProfileFirstSection = ({data, userData}) => {
    const [courseModal, setCourseModal] = useState(false)
    const [coursesData, setCoursesData] = useState([])

    const [coursesLoading, setCoursesLoading] = useState(false)
    const getCourses = async () => {
        setCoursesLoading(true)
        const response = await InstructorCreatedCoursesById(data?.instructorId);
        setCoursesData(response);
        setCoursesLoading(false)
    }

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
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{data?.email}</Text>
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">Instruktor</Text>
            </View>
        </View>
        {!data?.isYourInstructor ? (
            <View>
                <Text className="text-white font-psemibold text-sm uppercase bg-secondary border border-white rounded-md px-2 py-1 mt-2" style={styles.box}>Tutori Juaj</Text>
            </View>
        ) : (
            <TouchableOpacity onPress={() => setCourseModal(true)} className="py-1 px-3 border border-white bg-secondary rounded-md mt-2" style={styles.box}>
                <Animatable.Text animation="pulse" iterationCount="infinite" className="text-white font-psemibold text-sm">Behuni student</Animatable.Text>
            </TouchableOpacity>
        )}
    </View>

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