import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Platform } from 'react-native'
import { icons, images } from '../constants'
import { getCourseCategories } from '../services/fetchingService'
import * as Animatable from "react-native-animatable"
import { useNavigation } from 'expo-router'
import {useRole} from "../navigation/RoleProvider"

const OnlineClassesCard = ({classes, userCategories, managePlace = false, profilePlace = false}) => {
    const {role} = useRole();

    const navigation = useNavigation();
    const editCardPress = () => {
        navigation.navigate('addCourse', {
            courseData: classes,
            updateData: true
        })
    }
    if(profilePlace){
        return(
            <View></View>
        )
    }else{
        return (
          <TouchableOpacity className="relative p-4 bg-oBlack border rounded-md border-black-200 pb-10" style={styles.box}>
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