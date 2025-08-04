import { View, Text, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { memo } from 'react'
import { images } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider'
import { getCourseCategories } from '../services/fetchingService'
// import RenderHtml from 'react-native-render-html';
import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'

const Courses = ({ courses: { id, courseName, courseFeaturedImage, courseDescription, courseCategory, lessons, courseEnrolled } }) => {
    const {colorScheme} = useColorScheme();
    const router = useRouter();

    const {user} = useGlobalContext()
    const categories = user?.data?.categories;
    
    return (
        <View className="px-4 w-full mb-10 -mt-2" style={colorScheme === 'light' ? styles.lightBox : styles.darkBox}>
            <TouchableOpacity onPress={() => router.replace(`/categories/course/${id}`)} style={styles.box} className="bg-oBlack-light dark:bg-primary rounded-md overflow-hidden border-2 border-gray-200 dark:border-black-200">
                <View style={styles.box} className="relative">
                    <Image
                        source={images.testimage}
                        resizeMode='cover'
                        className="h-[150px] w-full rounded-b-md border-b-2 border-gray-200 dark:border-black-200"
                        
                    />
                    <View className="absolute top-0 left-0 border-b border-r bg-oBlack-light border-gray-200 dark:bg-black-200  dark:border-black-200 z-2 p-1.5 pb-1 rounded-br-[10px]">
                        <Text className="text-oBlack dark:text-white font-pmedium text-xs ">{getCourseCategories(categories, courseCategory)}</Text>
                    </View>
                    <View className="absolute top-0 right-0 bg-oBlack-light border-b border-l border-gray-200 dark:border-black-200 dark:bg-black-200 z-2 p-1.5 pb-1 rounded-bl-[10px]">
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
                    <View className="absolute bottom-[2px] right-0 bg-oBlack-light border-l border-t border-gray-200 dark:border-black-200 dark:bg-black-200 z-2 p-1.5 pb-1 rounded-br-[4px] rounded-tl-[10px]">
                        <Text className="text-oBlack dark:text-white font-pmedium text-xs ">
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
                            {courseDescription}
                        </Text>
                        {/* <RenderHtml
                        tagsStyles={styles}
                        source={source}
                        /> */}
                        
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    lightBox: {
        ...Platform.select({
            ios: {
                shadowColor: "#b8e1ff",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
    darkBox: {
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
export default memo(Courses)