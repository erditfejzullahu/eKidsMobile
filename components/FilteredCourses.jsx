import { View, Text, Image } from 'react-native'
import { memo, useCallback } from 'react'
import { images, icons } from '../constants'
import * as Animatable from 'react-native-animatable'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { useShadowStyles } from '../hooks/useShadowStyles'

const FilteredCourses = ({ userCourses: { id, courseName, courseCategory, corseFeaturedImage, lessons, courseDescription, courseEnrolled } }) => {
  // console.log(userCourses, 'AAAAAAAAAAAAAAAAAAAAa');
  const {shadowStyle} = useShadowStyles();
  const animationType = id % 2 === 0 ? 'slideInLeft' : 'slideInRight'
  const router = useRouter();
  const enrollCourse = useCallback(() => {
    router.push(`/categories/course/${id}`)
  }, [router])
  return (
    <View className="w-full px-4">
      <TouchableOpacity
        onPress={enrollCourse}
      >
      <View className="mt-5" style={shadowStyle}>
        <View style={shadowStyle} className="bg-oBlack-light dark:bg-primary rounded-md overflow-hidden border-2 border-gray-200 dark:border-black-200 relative">
          <View className="relative" style={shadowStyle}>
            <Image
              source={images.testimage}
              resizeMode='cover'
              className="h-[150px] w-full rounded-b-md border-b-2 border-gray-200 dark:border-black-200"
            />
            <View className="absolute top-0 right-0 bg-oBlack-light dark:bg-black-200 z-2 p-1.5 pb-1 rounded-bl-[10px]">
            <Text className="text-oBlack dark:text-white font-pmedium text-xs">
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
            <View className="absolute bottom-0 right-0 bg-oBlack-light dark:bg-black-200 z-2 p-1.5 pb-1 rounded-tl-[10px]">
              <Text className="text-oBlack dark:text-white font-pmedium text-xs">
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
              <Text className="text-oBlack dark:text-white text-lg font-psemibold">{courseName}</Text>
            </View>
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight" numberOfLines={3}>
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
export default memo(FilteredCourses)