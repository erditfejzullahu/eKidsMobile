import { View, Text, Image, Dimensions, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { images, icons } from '../constants'
import * as Animatable from 'react-native-animatable'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

const AllCategories = ({userCategories: {CategoryID, categoryName, categoryContent, categoryPictureUrl, courses}}) => {
    // console.log(categoryName);
    const router = useRouter();
    const animationType = CategoryID % 2 === 0 ? 'slideInLeft' : 'slideInRight'
    const enrollCourses = () => {
      router.push(`/categories/${CategoryID}`)
    }
  return (
    <View className="w-full px-4">
        <TouchableOpacity
          onPress={enrollCourses}
        >
          <View className="mt-5" style={styles.box}>
            <View style={styles.box} className="bg-primary rounded-[15px] overflow-hidden border-2 border-black-200 relative">
              <View style={styles.box} className=" relative">
                <Image 
                  source={images.testimage} // You may want to use categoryPictureUrl if available
                  resizeMode='cover'
                  className="h-[150px] w-full rounded-b-[15px]"
                />
                <View className="absolute top-0 right-0 bg-black-200 z-2 p-1.5 pt-1 rounded-bl-[10px]">
                  <Text className="text-white font-pmedium text-xs">{courses?.length > 1 ? (<><Text className="text-secondary">{courses?.length}</Text> Kurse për shfletim </> ): courses?.length === 0 ? "Asnjë kurs për shfletim" : (<><Text className="text-secondary">{courses?.length}</Text> Kurs për shfletim</>)}</Text>
                </View>
              </View>
              <View className="p-3 pt-2">
                <View>
                  <Text className="text-white text-lg font-pblack">{categoryName}</Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs font-plight" numberOfLines={3}>
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
export default AllCategories