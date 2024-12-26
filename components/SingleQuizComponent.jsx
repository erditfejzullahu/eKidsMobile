import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { getCourseCategories, increaseViewCount, reqGetStatusQuiz, reqStartQuizCompletation } from '../services/fetchingService';
import * as Animatable from "react-native-animatable"
import CustomModal from './Modal';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import NotifierComponent from './NotifierComponent';


const SingleQuizComponent = ({quizData, allQuizzes = false, openCourseActions}) => {
  
    const {user, isLoading} = useGlobalContext();
    const userCategories = user?.data?.categories;
    const userData = user?.data?.userData;
    const router = useRouter();
    
    const bounceDownAnimation = {
      0: { transform: [{ translateY: 0 }] },
      0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
      1: { transform: [{ translateY: 0 }] }, // Back to original position
    };

    const {showNotification: successNotification} = NotifierComponent({
      title: "Me sukses!",
      description: "Sapo startuat kuizin me sukes! Mund te percillni kuizet e startuara tek pjesa e Progresit tuaj tek Profili juaj!",
    })

    const {showNotification: unSuccessNotification} = NotifierComponent({
      title: "Dicka shkoi gabim!",
      description: "Ju lutem provoni perseri duke klikuar mbi kuizin ose kontaktoni Panelin e Ndihmes!"
    })

    const handleQuizStart = async () => {
      try {
        const payload = {
          "userId": userData?.id,
          "quizId": quizData?.id
        }
        await increaseViewCount(quizData?.id, 'quiz')
        const response = await reqStartQuizCompletation(payload)
        if(response === 200){
          successNotification();
          router.push(`/quiz/${quizData?.id}`)
        }else if (response === 400){
          unSuccessNotification();
        }else if (response === 409){
          router.push(`/quiz/${quizData?.id}`)
        }
        
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <View className="mt-4 mb-4" style={styles.box}>
            <TouchableOpacity onPress={allQuizzes ? handleQuizStart : () => router.push(`/quiz/${quizData?.id}`)}>
              <View className="border border-black-200 bg-oBlack p-4 relative">
                  <Text className="text-white font-psemibold text-lg">{quizData?.quizName}</Text>
                  <Text className="text-gray-400 font-plight text-xs pb-2.5" numberOfLines={3}>{quizData?.quizDescription}</Text>

                  <View className="flex-row justify-between pt-2.5 border-t border-black-200">
                    <View>
                      <Text className="text-white font-psemibold text-xs">{allQuizzes ? "Statusi" : "Shikime"}</Text>
                      <Text className="text-secondary font-pbold text-sm">{allQuizzes ? (quizData?.status ? "E perfunduar" : "E paperfunduar") : "100 shikime"}</Text>
                    </View>
                    <View>
                      <Text className="text-white font-psemibold text-xs text-right">Sa here i perfunduar?</Text>
                      <Text className="text-secondary font-pbold text-sm text-right">{quizData?.howMany === 0 ? "I pashfletuar" : quizData?.howMany + " Here"}</Text>
                    </View>
                  </View>

                  {/* kategoria absolute */}
                  <View className="absolute top-0 right-0 bg-secondary p-2.5 py-1 rounded-bl-[10px] items-center justify-center">
                    <Text className="text-white font-psemibold text-xs">{getCourseCategories(userCategories, quizData?.quizCategory)}</Text>
                  </View>
                  {/* kategoria absolute */}
                  <Animatable.View 
                    className="absolute -bottom-3 items-center justify-center right-0 left-0 "
                    duration={1000}
                    iterationCount="infinite"
                    animation={bounceDownAnimation}
                  >
                    {allQuizzes ? (
                        <Text className="text-white px-2 py-1 rounded-[5px] font-psemibold text-xs bg-secondary">Filloni tani!</Text>
                    ): (
                        <TouchableOpacity onPress={() => openCourseActions(quizData)}>
                            <Text className="text-white px-2 py-1 rounded-[5px] font-psemibold text-xs bg-secondary">Nderveprime te kuizit</Text>
                        </TouchableOpacity>
                    )}
                  </Animatable.View>
              </View>
            </TouchableOpacity>

            
      </View>
  )
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

export default SingleQuizComponent