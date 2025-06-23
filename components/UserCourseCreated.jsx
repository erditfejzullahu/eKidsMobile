import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React, {useState, useEffect} from 'react'
import { images } from '../constants';
import { getCourseCategories } from '../services/fetchingService';
import { Link } from 'expo-router';
import * as Animatable from 'react-native-animatable'
import { sortBy } from 'lodash';
import { useShadowStyles } from '../hooks/useShadowStyles';

const UserCourseCreated = ({userCourses, userCategories}) => {
    // console.log(userCourses);
    const {shadowStyle} = useShadowStyles();
    const [showMoreCreated, setShowMoreCreated] = useState([])
    const [sortName, setSortName] = useState(false)
    const [sortViews, setSortViews] = useState(false)
    const [sortedCourses, setSortedCourses] = useState([])
    useEffect(() => {
        if(sortName){
            setSortViews(false);
        }else if(sortViews){
            setSortName(false);
        }

      if(!sortName && sortViews){
        setSortedCourses(sortBy(userCourses, [(item) => -item.viewCount]));
      }else if(sortName && !sortViews){
        console.log('??');
        
        setSortedCourses(sortBy(userCourses, 'courseName'));
      }else{
        setSortedCourses(userCourses)
      }
    }, [sortName, sortViews])
    
    const bounceDownAnimation = {
        0: { transform: [{ translateY: 0 }] },
        0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
        1: { transform: [{ translateY: 0 }] }, // Back to original position
      };
  return (
    <>
    <View className="flex-row mx-auto p-2 flex-1 mt-2 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-[10px] justify-between w-[260px]" style={shadowStyle}>
        <TouchableOpacity onPress={() => {setSortName(!sortName), setSortViews(false)}} className="flex-1 items-center border-r border-gray-200 dark:border-black-200">
            <Text className={`${sortName ? "text-secondary font-pregular" : "text-oBlack dark:text-white"} text-sm font-plight`}>Nga emri</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setSortViews(!sortViews), setSortName(false)}} className="flex-1 items-center">
            <Text className={`${sortViews ? "text-secondary font-pregular" : "text-oBlack dark:text-white"} text-sm font-plight`}>Nga shikimet</Text>
        </TouchableOpacity>
    </View>
    <View className="mb-6">
        {sortedCourses.map((item) => {
            const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
            const formattedDate = date.toLocaleDateString('sq-AL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            });
            return (
                <View
                key={"courseCreated-" + item?.id}
                style={shadowStyle}
                className="bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 m-4 p-4 relative"
                >
                <View className="flex-row justify-between border-b border-gray-200 dark:border-black-200 pb-4 items-center gap-2">
                    <View className="gap-4 flex-col flex-[0.5]">
                    <View>
                        <Text className="text-xs font-plight text-oBlack dark:text-white">Emri i kursit:</Text>
                        <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.courseName}</Text>
                    </View>
                    <View>
                        <Text className="text-xs font-plight text-oBlack dark:text-white">Kategoria:</Text>
                        <Text className="text-base font-psemibold text-oBlack dark:text-white">{getCourseCategories(userCategories, item?.courseCategory)}</Text>
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
                    <TouchableOpacity onPress={() => setShowMoreCreated((prevData) => prevData.includes(item?.id) ? prevData.filter((existingIds) => existingIds !== item?.id) : [...prevData, item?.id])}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreCreated.includes(item?.id) ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                </Animatable.View>

                {/* more details */}
                {showMoreCreated.includes(item?.id) && <View className="mt-4 overflow-hidden relative">
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
                    <Text className="text-xs font-light text-gray-600 dark:text-gray-400">{item?.courseDescription}</Text>
                    </Animatable.View>
                    <View className="flex-row items-end justify-between overflow-hidden">
                    <View className="flex-1">
                        <Link className="text-secondary font-psemibold text-xs underline" href={`/categories/course/${item?.id}`}>Drejtohuni per me shume</Link>
                    </View>
                    <Animatable.View 
                        className="flex-1"
                        animation="fadeInRight"
                        duration={700}
                    >
                        <Text className="text-xs font-light text-oBlack dark:text-white text-right">Krijuar me:</Text>
                        <Text className="text-base font-psemibold text-oBlack dark:text-white text-right">{formattedDate}</Text>
                    </Animatable.View>
                    </View>
                </View>}
                {/* more details */}
                </View>
            )
        })}
        
    </View>
    </>
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
export default UserCourseCreated