import { View, Text, Image, Dimensions, StyleSheet, Platform } from 'react-native'
import React, { memo, useCallback } from 'react'
import { images, icons } from '../constants'
import * as Animatable from 'react-native-animatable'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useShadowStyles } from '../hooks/useShadowStyles'

const AllCategories = ({userCategories: {CategoryID, categoryName, categoryContent, categoryPictureUrl, courses}}) => {
    // console.log(categoryName);
    const {shadowStyle} = useShadowStyles();
    const router = useRouter();
    const animationType = CategoryID % 2 === 0 ? 'slideInLeft' : 'slideInRight'
    const enrollCourses = useCallback(() => {
      router.push(`/categories/${CategoryID}`)
    }, [router, CategoryID])
  return (
    <View className="w-full px-4">
        <TouchableOpacity
          onPress={enrollCourses}
        >
          <View className="mt-5" style={shadowStyle}>
            <View style={shadowStyle} className="bg-oBlack-light dark:bg-primary rounded-md overflow-hidden border-2 border-gray-200 dark:border-black-200 relative">
              <View style={shadowStyle} className=" relative">
                <Image 
                  source={images.testimage} // You may want to use categoryPictureUrl if available
                  resizeMode='cover'
                  className="h-[150px] w-full rounded-b-md border-b-2 border-gray-200 dark:border-black-200"
                />
                <View className="absolute top-0 right-0 bg-oBlack-light border-l border-b border-gray-200 dark:bg-black-200 dark:border-black-200 z-2 p-1.5 pb-1 rounded-bl-[10px]">
                  <Text className="text-oBlack dark:text-white font-pmedium text-xs">{courses?.length > 1 ? (<><Text className="text-secondary">{courses?.length}</Text> Kurse për shfletim </> ): courses?.length === 0 ? "Asnjë kurs për shfletim" : (<><Text className="text-secondary">{courses?.length}</Text> Kurs për shfletim</>)}</Text>
                </View>
              </View>
              <View className="p-3 pt-2">
                <View>
                  <Text className="text-oBlack dark:text-white text-lg font-psemibold">{categoryName}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight" numberOfLines={3}>
                    {categoryContent || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec mauris tristique, luctus magna eu, pellentesque magna.'}
                  </Text>
                </View>
              </View>

              <View className="absolute bottom-2 w-full flex-1 min-w-full">
                <Animatable.View
                  animation={animationType}
                  iterationCount="infinite"
                  duration={4000}
                  direction='alternate'
                >
                  <Image 
                    source={icons.learning}
                    className="h-20 w-20 opacity-5 m-auto"
                    resizeMode='contain'
                    style={{tintColor: "#ff9001"}}
                  />
                </Animatable.View>
              </View>

            </View>
          </View>
        </TouchableOpacity>
    </View>
  )

  
}

export default memo(AllCategories)