import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'

const EmptyState = ({title, titleStyle, subtitle, buttonTitle, buttonFunction, isSearchPage, isBookMarkPage = false, showButton = true}) => {
  return (
    <View className="justify-center items-center px-4 mb-4">
      {isSearchPage ? (<Image 
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />) : null}
      <Text className={`text-2xl font-psemibold text-white text-center ${titleStyle}`}>{title}</Text>
      <Text className="font-pmedium text-sm text-gray-100 text-center mt-2">{subtitle}</Text>
      {isBookMarkPage ? (<View className="my-6">
        <Image
        source={images.breakHeart}
        className="w-auto h-20"
        resizeMode='contain' 
        tintColor={"#ff9c01"}
      />
      </View>) : null}
      {showButton && <CustomButton 
        title={buttonTitle}
        handlePress={buttonFunction}
        containerStyles={"w-full mt-4"}
      />}
    </View>
  )
}

export default EmptyState