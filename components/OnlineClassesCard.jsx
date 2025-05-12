import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import { icons, images } from '../constants'
import { getCourseCategories } from '../services/fetchingService'
import * as Animatable from "react-native-animatable"
import { useNavigation } from 'expo-router'
import {useRole} from "../navigation/RoleProvider"
import { useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Modal from "../components/Modal"

const OnlineClassesCard = ({classes, userCategories, managePlace = false, profilePlace = false}) => {
    console.log(classes);
    const [showCourseLessons, setShowCourseLessons] = useState(false)
    const [showLessonInfoModal, setShowLessonInfoModal] = useState(false)
    
    const router = useRouter();
    const {role} = useRole();

    const navigation = useNavigation();
    const editCardPress = () => {
        navigation.navigate('addCourse', {
            courseData: classes,
            updateData: true
        })
    }

    const handleLessonPress = (item) => {
        if(item.routeTo){
            router.replace();
        }else{
            setShowLessonInfoModal(true)
        }
    }

    const handleCoursePress = () => {
        router.push(`onlineClass/${classes.id}`)
    }

    if(profilePlace){
        return(
            <>
            <TouchableOpacity onPress={() => setShowCourseLessons(!showCourseLessons)} className="bg-oBlack p-4 border rounded-md border-black-200" style={styles.box}>
                <Text className="bg-primary text-white font-psemibold text-sm absolute top-0 right-0 border-b border-l border-black-200 rounded-bl-md rounded-tr-md px-2 py-0.5" style={styles.box}>{getCourseCategories(userCategories, classes.course.categoryId)}</Text>
                <Text className="text-white font-psemibold text-lg">{classes.course.name}</Text>
                <View className={`relative flex-row items-center justify-between gap-2 ${showCourseLessons ? "border-b pb-3 border-black-200 mb-3" : ""}`}>
                    <View className="flex-1">
                        <Progress.Bar progress={classes.completionPercentage / 100} unfilledColor='#d9d9d9' color="#ff9c01" borderWidth={0} height={12}  width={null} />
                        <Text className="text-oBlock absolute -bottom-[1.5px] items-center justify-center w-full right-0 left-0 m-auto text-center font-psemibold text-xs">{classes.completionPercentage}%</Text>
                    </View>
                    <View className="-mt-1">
                        <Image 
                            source={showCourseLessons ? icons.upArrow : icons.downArrow}
                            className="size-6"
                            resizeMode='contain'
                            tintColor={"#ff9c01"}
                        />
                    </View>
                </View>

                {showCourseLessons && <View className="gap-2.5">
                    {classes?.lessons?.map((item) => (
                        <TouchableOpacity onPress={() => handleLessonPress(item)} key={item.id} className="flex-row items-center justify-between bg-primary rounded-md border border-black-200 p-3" style={styles.box}>
                            <Text className="font-psemibold text-sm text-white">{item.title}</Text>
                            <View className="flex-row items-center gap-2">
                                {item.routeTo && (<Animatable.Image 
                                    animation="pulse"
                                    iterationCount="infinite"
                                    duration={2000}
                                    easing="ease-in-out"
                                    source={icons.available}
                                    className="size-8"
                                    resizeMode='contain'
                                    tintColor={"#ff9c01"}
                                />)}
                                <Animatable.Image 
                                    animation="pulse"
                                    iterationCount="infinite"
                                    duration={2000}
                                    easing="ease-in-out"
                                    source={item.isCompleted ? icons.completed : icons.completedProgress}
                                    className="size-6"
                                    resizeMode='contain'
                                    tintColor={"#ff9c01"}
                                />
                            </View>
                        </TouchableOpacity>))} 
                </View>}
            </TouchableOpacity>

            <Modal
                visible={showLessonInfoModal}
                onClose={() => setShowLessonInfoModal(false)}
                onlyCancelButton={true}
                title={"Njoftim mbi veprimin"}
                cancelButtonText={"Largo dritaren"}

            >
                <Text className="text-gray-400 text-center text-xs mt-1 font-plight">Leksionet qe nuk kane imazhin e dispozicionit(Available) ende nuk kane ndodhur. Porsa te ndodhin do merrni njoftimin e posacshem.</Text>
            </Modal>
            </>
        )
    }else{
        return (
          <TouchableOpacity onPress={handleCoursePress} className="relative p-4 bg-oBlack border rounded-md border-black-200 pb-10" style={styles.box}>
              {/* absolute */}
              {managePlace && (<Animatable.View animation="pulse" duration={1000} iterationCount="infinite" className="absolute right-0 left-0 top-8 items-center justify-center z-50">
                  <TouchableOpacity onPress={editCardPress} className="z-50  mx-auto items-center justify-center bg-oBlack px-4 py-2 border border-black-200 w-[80%]" style={styles.box}>
                      <Image 
                          source={icons.edit}
                          className="size-5"
                          resizeMode='contain'
                          tintColor={"#ff9c01"}
                      />
                  </TouchableOpacity>
              </Animatable.View>)}
              <View className="absolute -top-2 z-20 -right-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
                  <Text className="text-white font-psemibold text-sm">{getCourseCategories(userCategories, classes.categoryId)}</Text>
              </View>
              {role !== "Instructor" && <View className="absolute top-5 z-20 -right-2 bg-primary border border-black-200 p-2 rounded-bl-lg rounded-tr-lg" style={styles.box}>
                  <Image
                      className="size-6"
                      source={classes.enrolled ? icons.heart : icons.play2}
                      tintColor={"#ff9c01"}
                      resizeMode='contain'
                  />
              </View>}
              <View className="absolute -left-2 -top-2 flex-row gap-2 p-2 rounded-md border border-black-200 items-center bg-primary z-20 max-w-[200px]" style={styles.box}>
                  <Image 
                      source={{uri: classes.profilePictureUrl}}
                      className="h-12 w-12 border border-black-200 rounded-sm p-2"
                      resizeMode='contain'
                  />
                  <View className="flex-1">
                      <Text className="text-white font-psemibold text-md break-words" numberOfLines={1}>{classes.instructorName}</Text>
                      <Text className="text-gray-400 text-xs font-plight">Instruktor</Text>
                  </View>
              </View>
              {/* absolute */}
      
              <View className="h-[120px] border border-black-200" style={styles.box}>
                  {!classes.image ? (<Image 
                      source={images.logoNew}
                      className="h-full w-full py-2 bg-primary"
                      resizeMode='contain'
                  />) : (
                      <Image
                          source={{uri: classes.image}}
                          className="h-full w-full"
                          resizeMode='cover'
                      />
                  )}
              </View>
              
              <Text className="text-white font-psemibold text-xl mt-4">{classes.name}</Text>
              <Text numberOfLines={4} className="text-gray-400 text-xs font-plight">{classes.description}</Text>
              
              <View className="absolute -bottom-2 z-20 -left-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
                  <Text className="text-white font-psemibold text-xs">Niveli <Text className="text-secondary">Fillestar</Text></Text>
              </View>
              <View className="absolute -bottom-2 z-20 -right-2 bg-primary px-2.5 py-1.5 border rounded-md border-black-200 " style={styles.box}>
              <Text className="text-white font-psemibold text-xs">
                  {classes.enrolledStudents === 0 ? (
                      <Text className="text-secondary">Nuk ka shfletime ende</Text>
                  ) : (
                      <>
                      <Text className="text-secondary">{classes.enrolledStudents}</Text>
                      {' '}Studente duke shfletuar
                      </>
                  )}
                  </Text>
              </View>
          </TouchableOpacity>
        )
    }
}

export default OnlineClassesCard
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