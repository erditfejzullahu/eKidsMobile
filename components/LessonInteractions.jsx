import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { icons } from '../constants'
import { useLessonCommentsContext } from '../context/LessonCommentsProvider'

const LessonInteractions = ({lessonData, handleLessonLike, handleLessonComment}) => {

    const {setFireUpEndScroll} = useLessonCommentsContext();
    
  return (
    <View className="flex-row w-full border border-gray-200 dark:border-black-200">
        <View className="flex-1 bg-oBlack-light dark:bg-oBlack">
            <TouchableOpacity onPress={handleLessonLike} className="flex-row items-center justify-center gap-1 border-r border-gray-200 dark:border-black-200 p-2.5">
                <Text className={`${lessonData?.isLiked ? "text-secondary" : "text-oBlack dark:text-white"} font-pregular text-sm text-center `}>{lessonData?.isLiked ? "I Pelqyer" : "Pelqeni"} 
                </Text>
                <View className="flex-row items-center justify-center">
                    <Image
                        source={icons.star}
                        resizeMode='contain'
                        className="w-6 h-6"
                        tintColor={"#FF9C01"}
                    />
                <View className="-ml-3.5">
                    <Text className="font-psemibold text-sm text-white">{lessonData?.lesson?.likes}</Text>
                </View>
                </View>
            </TouchableOpacity>
        </View>
        <View className="flex-1 bg-oBlack-light dark:bg-oBlack ">
            <TouchableOpacity onPress={() => setFireUpEndScroll(true)} className="flex-row items-center justify-center gap-1 p-2.5">
                <Text className="text-oBlack dark:text-white font-pregular text-sm text-center">Komento</Text>
                <View className="flex-row items-center justify-center">
                    <Image 
                    source={icons.chat}
                    resizeMode='contain'
                    className="w-6 h-6"
                    tintColor={"#FF9C01"}
                    />
                <View className={`${lessonData?.countLessonComments > 9 ? "-ml-5" : "-ml-4"}`}>
                    <Text className="font-psemibold text-sm text-white">{lessonData?.countLessonComments}</Text>
                </View>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default LessonInteractions