import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { getCourseCategories } from '../services/fetchingService';
import * as Animatable from "react-native-animatable"
import CustomModal from './Modal';
import { icons } from '../constants';


const SingleQuizComponent = ({quizData, allQuizzes = false, openCourseActions}) => {
    const {user, isLoading} = useGlobalContext();
    const userCategories = user?.data?.categories;
    
    // console.log(quizData);
    
    const bounceDownAnimation = {
        0: { transform: [{ translateY: 0 }] },
        0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
        1: { transform: [{ translateY: 0 }] }, // Back to original position
      };

    

  return (
    <View className="mt-4 mb-4" style={styles.box}>
            <TouchableOpacity>
              <View className="border border-black-200 bg-oBlack p-4 relative">
                  <Text className="text-white font-psemibold text-lg">{quizData?.quizName}</Text>
                  <Text className="text-gray-400 font-plight text-xs pb-2.5" numberOfLines={3}>{quizData?.quizDescription}</Text>

                  <View className="flex-row justify-between pt-2.5 border-t border-black-200">
                    <View>
                      <Text className="text-white font-psemibold text-xs">{allQuizzes ? "Statusi" : "Shikime"}</Text>
                      <Text className="text-secondary font-pbold text-sm">{allQuizzes ? "E perfunduar" : "100 shikime"}</Text>
                    </View>
                    <View>
                      <Text className="text-white font-psemibold text-xs text-right">Sa here i perfunduar?</Text>
                      <Text className="text-secondary font-pbold text-sm text-right">34 here</Text>
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