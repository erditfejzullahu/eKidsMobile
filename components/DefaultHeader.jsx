import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const DefaultHeader = ({headerTitle, topSubtitle, bottomSubtitle, showBorderBottom}) => {
  return (
    <View className={`my-4 ${showBorderBottom ? "border-b border-black-200 pb-2 mb-2" : ""}`}>
        {topSubtitle && <Text className="text-gray-100 font-pmedium text-sm">{topSubtitle}</Text>}
        <Text className="text-2xl text-white font-pmedium">{headerTitle}
            <View>
            <Image
                source={images.path}
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                resizeMode='contain'
            />
            </View>
        </Text>
        {bottomSubtitle && <Text className="text-gray-100 font-plight text-xs mt-2.5">{bottomSubtitle}</Text>}
    </View>
  )
}

export default DefaultHeader