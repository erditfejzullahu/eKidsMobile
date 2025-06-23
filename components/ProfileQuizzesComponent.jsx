import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetchFunction from '../hooks/useFetchFunction'
import { getCompletedQuizzesByUser, getCourseCategories } from '../services/fetchingService'
import Loading from './Loading'
import EmptyState from './EmptyState'
import { useRouter } from 'expo-router'
import { images } from '../constants'
import * as Animatable from 'react-native-animatable'
import { Link } from 'expo-router'
import { useShadowStyles } from '../hooks/useShadowStyles'

const ProfileQuizzesComponent = ({quizzesCompleted, userCategories}) => {
  const {shadowStyle} = useShadowStyles();
  console.log(quizzesCompleted);
  
    const router = useRouter();
    const [inProgress, setInProgress] = useState(true)
    const [showMoreInQuizzes, setShowMoreInQuizzes] = useState([])

    const bounceDownAnimation = {
        0: { transform: [{ translateY: 0 }] },
        0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
        1: { transform: [{ translateY: 0 }] }, // Back to original position
      };
    
  return (
    <View>
        <View className="flex-row mx-auto p-2 flex-1 mt-2 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-[10px] justify-between w-[260px]" style={shadowStyle}>
            <TouchableOpacity onPress={() => setInProgress(true)} className="flex-1 items-center border-r border-gray-200 dark:border-black-200">
                <Text className={`${inProgress ? "text-secondary font-pregular" : "text-oBlack dark:text-white"} text-sm font-plight`}>Ne progress</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInProgress(false)} className="flex-1 items-center">
                <Text className={`${!inProgress ? "text-secondary font-pregular" : "text-oBlack dark:text-white"} text-sm font-plight`}>Te perfunduara</Text>
            </TouchableOpacity>
        </View>

        {quizzesCompleted ? <View className="mb-6">
            {quizzesCompleted?.filter((item) => {
                return inProgress ? item?.completed === false : item?.completed === true
            }).map((item, index) => {        
                const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
                      const formattedDate = date.toLocaleDateString('sq-AL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });            
                return (
                    <View 
                          key={"quizCompleted-" + item?.id}
                          style={shadowStyle}
                          className="bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 m-4 p-4 relative"
                        >
                          <View className="flex-row justify-between border-b border-gray-200 dark:border-black-200 pb-4 items-center gap-2">
                            <View className="gap-4 flex-col flex-[0.5]">
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Emri i kuizit:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.quiz?.quizName}</Text>
                              </View>
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Kategoria:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{getCourseCategories(userCategories, item?.quiz?.quizCategory)}</Text>
                              </View>
                            </View>
                            <View className="gap-4 flex-col flex-[0.5]">
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Gabimet:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white"><Text className="text-secondary">{item?.mistakes}</Text> {item?.mistakes === 1 ? "Gabim" : "Gabime"} </Text>
                              </View>
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Koha:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.duration}</Text>
                              </View>
                            </View>
                          </View>

                          <View className="absolute left-2 top-2">
                            <Image 
                              source={images.mortarBoard}
                              className="h-20 w-20 opacity-20"
                              resizeMode='contain'
                              tintColor={"#FF9C01"}
                            />
                          </View>
                          <Animatable.View 
                            className="absolute -bottom-3 items-center justify-center right-0 left-0 "
                            duration={1000}
                            iterationCount="infinite"
                            animation={bounceDownAnimation}
                          >
                            <TouchableOpacity onPress={() => setShowMoreInQuizzes((prevData) => prevData.includes(item?.id) ? prevData.filter((existingId => existingId !== item?.id)) : [...prevData, item?.id])}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreInQuizzes.includes(item?.id) ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                          </Animatable.View>
                            {showMoreInQuizzes.includes(item?.id) && <View className="mt-4 overflow-hidden relative">
                            <View className="absolute bottom-0 right-2">
                              <Image 
                                source={images.reward}
                                className="h-20 w-20 opacity-20"
                                resizeMode='contain'
                                tintColor={"#FF9C01"}
                              />
                            </View>
                              <Animatable.View
                                animation="fadeInLeft"
                                duration={700}
                              >
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">Pershkrimi i kuizit:</Text>
                                <Text className="text-xs font-light text-gray-600 dark:text-gray-400">{item?.quiz?.quizDescription}</Text>
                              </Animatable.View>

                              <View className="flex-row items-end justify-between overflow-hidden">
                                <View className="flex-1">
                                  <Link className="text-secondary font-psemibold text-xs underline" href={`/quiz/${item?.quiz?.id}`}>Drejtohuni per ne kuiz</Link>
                                </View>
                                <Animatable.View 
                                  className="flex-1"
                                  animation="fadeInRight"
                                  duration={700}
                                >
                                  <Text className="text-xs font-light text-oBlack dark:text-white text-right">{inProgress ? "Filluar me:" : "Perfunduar me:"}</Text>
                                  <Text className="text-base font-psemibold text-oBlack dark:text-white text-right">{formattedDate}</Text>
                                </Animatable.View>
                              </View>
                          </View>}
                        </View>
                )
            })}
        </View> : <View className="border border-gray-200 dark:border-black-200 m-4 bg-oBlack-light dark:bg-oBlack pt-2" style={shadowStyle}><EmptyState
                      title={"Nuk u gjet asnje kuiz i perfunduar"}
                      titleStyle={"!font-pregular mb-2"}
                      subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo vazhdoni kuizet e mbetura duke klikuar ne butonin e meposhtem!"}
                      buttonTitle={"Vazhdoni kuizet"}
                      buttonFunction={() => router.replace('/all-quizzes')}
                  /></View>}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
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
  });
export default ProfileQuizzesComponent