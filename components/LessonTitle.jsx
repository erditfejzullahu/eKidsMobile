import React from 'react'
import { useState } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import * as Animatable from "react-native-animatable"
import { icons } from '../constants'
import CustomModal from './Modal'

const LessonTitle = ({lessonData}) => {
  const [visibleCurrentProgressModal, setVisibleCurrentProgressModal] = useState(false)
  
  return (
    <>
        <View className="flex-[1] flex-row gap-2 border-b border-t border-black-200 items-center justify-center p-2 py-3 bg-primary">
          <Text className="text-white font-pbold text-sm text-center">{lessonData?.lesson?.lessonName}</Text>
          <Animatable.View animation="pulse" iterationCount="infinite">
              <TouchableOpacity onPress={() => setVisibleCurrentProgressModal(true)}>
              <Image 
                  source={lessonData?.currentProgress?.isCompleted ? icons.completed : icons.completedProgress}
                  resizeMode='contain'
                  className="h-6 w-6"
                  tintColor={"#FF9C01"}
              />
              </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* njoftim mbi imazh ne top scr */}
        <CustomModal
          visible={visibleCurrentProgressModal}
          title={"Njoftim mbi imazhin"}
          onClose={() => setVisibleCurrentProgressModal(false)}
          onlyCancelButton={true}
          cancelButtonText={"Largo dritaren"}
          autoCloseDuration={3000}
        >
          <View className="mt-2">
            <Text className="text-white text-sm font-plight text-center">{lessonData?.currentProgress?.isCompleted ? "Ky imazh indikon se ky leksion ka perfunduar me sukes!" : "Ky imazh indikon se ky leksion eshte ne perfundim e siper!"}</Text>
          </View>
        </CustomModal>
        {/* njoftim mbi imazh ne top scr */}
        </>
  )
}

export default LessonTitle