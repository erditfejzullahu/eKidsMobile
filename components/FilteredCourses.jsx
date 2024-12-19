import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, icons } from '../constants'
import * as Animatable from 'react-native-animatable'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'

const FilteredCourses = ({ userCourses: { id, courseName, courseCategory, corseFeaturedImage, lessons, courseDescription, courseEnrolled } }) => {
  // console.log(userCourses, 'AAAAAAAAAAAAAAAAAAAAa');
  const animationType = id % 2 === 0 ? 'slideInLeft' : 'slideInRight'
  const router = useRouter();
  const enrollCourse = () => {
    router.push(`/categories/course/${id}`)
  }
  return (
    <View className="w-full px-4">
      <TouchableOpacity
        onPress={enrollCourse}
      >
      <View className="mt-5" style={styles.box}>
        <View style={styles.box} className="bg-primary rounded-[15px] overflow-hidden border-2 border-black-200 relative">
          <View className="relative" style={styles.box}>
            <Image
              source={images.testimage}
              resizeMode='cover'
              className="h-[150px] w-full rounded-b-[15px]"
            />
            <View className="absolute top-0 right-0 bg-black-200 z-2 p-1.5 pt-1 rounded-bl-[10px]">
            <Text className="text-white font-pmedium text-xs">
                        {lessons?.length > 1 ? (
                            <>
                            <Text className="text-secondary">{lessons?.length}</Text> Materiale per shfletim
                            </>
                        ) : lessons?.length === 0 ? (
                            "Asnje material per shfletim!"
                        ) : (
                            <>
                            <Text className="text-secondary">{lessons?.length}</Text> Material per shfletim
                            </>
                        )}
                    </Text>
            </View>
            <View className="absolute bottom-0 right-0 bg-black-200 z-2 p-1.5 px-2 pt-1 rounded-br-[10px] rounded-tl-[10px]">
              <Text className="text-white font-pmedium text-xs">
              {courseEnrolled > 1 ? (
                                <>
                                Shfletuar nga <Text className="text-secondary">{courseEnrolled} studente</Text>
                                </>
                            ) : courseEnrolled == 1 ? (
                                <>
                                Shfletuar nga <Text className="text-secondary">{courseEnrolled} studente</Text>
                                </>
                            ) : (
                                <>
                                I <Text className="text-secondary">pashfletuar</Text> deri me tani 
                                </>
                            )}
              </Text>
            </View>
          </View>
          <View className="p-3 pt-2">
            <View>
              <Text className="text-white text-lg font-pblack">{courseName}</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs font-plight" numberOfLines={3}>
                {courseDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec mauris tristique, luctus magna eu, pellentesque magna.'}
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
                style={{ tintColor: "#ff9001" }}
              />
            </Animatable.View>
          </View>
        </View>
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
export default FilteredCourses