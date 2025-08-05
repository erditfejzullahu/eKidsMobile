import { View, Text, TouchableOpacity, Image } from 'react-native'
import {memo, useState } from 'react'
import { getCourseCategories } from '../services/fetchingService'
import UserProgressComponent from './UserProgressComponent'
import EmptyState from './EmptyState'
import * as Animatable from "react-native-animatable"
import { images } from '../constants'
import { Link } from 'expo-router'
import { useShadowStyles } from '../hooks/useShadowStyles'

const bounceDownAnimation = {
    0: { transform: [{ translateY: 0 }] },
    0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
    1: { transform: [{ translateY: 0 }] }, // Back to original position
  };

const ProfileCoursesComponent = ({userDataId, courseData, userCategories}) => { 
  const {shadowStyle} = useShadowStyles();
    
    const [inProgress, setInProgress] = useState(true)
    const [showMoreCompleted, setShowMoreCompleted] = useState([])
  return (
    <View>
        <View className="flex-row mx-auto p-2 flex-1 mt-2 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-[10px] justify-between w-[260px]" style={shadowStyle}>
            <TouchableOpacity onPress={() => setInProgress(true)} className="flex-1 items-center border-r border-gray-200 dark:border-black-200">
                <Text className={`${inProgress ? "text-secondary font-pregular" : "border-gray-200 dark:text-white"} text-sm font-plight`}>Ne progress</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInProgress(false)} className="flex-1 items-center">
                <Text className={`${!inProgress ? "text-secondary font-pregular" : "border-gray-200 dark:text-white"} text-sm font-plight`}>Te perfunduara</Text>
            </TouchableOpacity>
        </View>

        {inProgress && <View className="mb-4"><UserProgressComponent userDataId={userDataId}/></View>}
        {!inProgress &&
        <View className="mb-6">
            {courseData ? courseData?.map((item) => {

                    const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
                    const formattedDate = date.toLocaleDateString('sq-AL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                return (
                    <View 
                    key={"progressItem-" + item?.id}
                    style={shadowStyle}
                    className="bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 m-4 p-4 relative"
                  >
                    <View className="flex-row justify-between border-b border-gray-200 dark:border-black-200 pb-4 items-center gap-2">
                      <View className="gap-4 flex-col flex-[0.5]">
                        <View>
                          <Text className="text-xs font-plight text-oBlack dark:text-white">Emri i kursit:</Text>
                          <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.course?.courseName}</Text>
                        </View>
                        <View>
                          <Text className="text-xs font-plight text-oBlack dark:text-white">Kategoria:</Text>
                          <Text className="text-base font-psemibold text-oBlack dark:text-white">{getCourseCategories(userCategories, item?.course?.courseCategory)}</Text>
                        </View>
                      </View>
                      <View className="flex-[0.5] rounded-[10px]  overflow-hidden">
                        <Image
                          source={images.testimage}
                          className="h-[100px] w-full border border-gray-200 dark:border-black-200 rounded-[10px]"
                          resizeMode='cover'
                        />
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
                      <TouchableOpacity onPress={() => setShowMoreCompleted((prevData) => prevData.includes(item?.id) ? prevData.filter((existingIds) => existingIds !== item?.id) : [...prevData, item?.id])}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreCompleted.includes(item?.id) ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                    </Animatable.View>

                    {/* more details */}
                    {showMoreCompleted.includes(item?.id) && <View className="mt-4 overflow-hidden relative">
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
                        <Text className="text-base font-psemibold text-oBlack dark:text-white">Pershkrimi i kursit:</Text>
                        <Text className="text-xs font-light  text-gray-600 dark:text-gray-400">{item?.course?.courseDescription}</Text>
                      </Animatable.View>
                      <View className="flex-row items-end justify-between overflow-hidden">
                        <View className="flex-1">
                          <Link className="text-secondary font-psemibold text-xs underline" href={`/categories/course/${item?.course?.id}`}>Shfletoni kursin</Link>
                        </View>
                        <Animatable.View 
                          className="flex-1"
                          animation="fadeInRight"
                          duration={700}
                        >
                          <Text className="text-xs font-light text-oBlack dark:text-white text-right">Perfunduar me:</Text>
                          <Text className="text-base font-psemibold text-oBlack dark:text-white text-right">{formattedDate}</Text>
                        </Animatable.View>
                        
                      </View>
                      {item?.testimonial &&<Animatable.View
                        className="flex-1 my-4"
                        animation="fadeInLeft"
                        duration={700}
                        >
                          <Text className="text-xs font-light text-oBlack dark:text-white">Deshmija:</Text>
                          <Text className="text-sm font-psemibold text-secondary">{item?.testimonial}</Text>
                        </Animatable.View>}
                    </View>}
                    {/* more details */}
                  </View>
                )
            }
            ) : <EmptyState
            title={"Nuk u gjet asnje kurs i perfunduar"}
            titleStyle={"!font-pregular mb-2"}
            subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo vazhdoni kurset e mbetura duke klikuar ne butonin e meposhtem!"}
            buttonTitle={"Vazhdoni kurset"}
            buttonFunction={() => router.replace('/categories')}
            />}
        </View>}
    </View>
  )
}

export default memo(ProfileCoursesComponent)