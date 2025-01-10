import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants';

const TagsByCategories = ({categories}) => {
    console.log(categories.categoryName);
    
  return (
    <View>
        <TouchableOpacity className="flex-row gap-2 items-center">
            <Text className="text-white font-plight text-sm">{categories.categoryName}</Text>
            <Image 
                source={icons.rightArrow}
                className="h-4 w-4"
                resizeMode='contain'
                tintColor={"#FF9C01"}
            />
        </TouchableOpacity>
        <View className="border bg-primary border-black-200 rounded-[5px] p-2 m-2 my-3">
            <View>
                <View className="flex-row relative items-center gap-2">
                    <Text className="text-white text-sm italic">asd</Text>
                    <Image 
                        source={icons.rightArrow}
                        className="h-4 w-4"
                        resizeMode='contain'
                        tintColor={"#FF9C01"}
                    />
                    <View className="absolute h-[12px] w-[1px] -bottom-4 left-[20px] bg-secondary"/>
                </View>
                <View className="mt-3.5 ml-3">
                    <Text className="text-white text-sm italic" numberOfLines={1}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod eaque quae praesentium debitis vel earum dolore necessitatibus perspiciatis, nesciunt neque perferendis amet molestias quam ut veritatis possimus sapiente omnis esse?</Text>
                    <Text className="text-white text-sm italic" numberOfLines={1}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod eaque quae praesentium debitis vel earum dolore necessitatibus perspiciatis, nesciunt neque perferendis amet molestias quam ut veritatis possimus sapiente omnis esse?</Text>
                    <Text className="text-white text-sm italic" numberOfLines={1}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod eaque quae praesentium debitis vel earum dolore necessitatibus perspiciatis, nesciunt neque perferendis amet molestias quam ut veritatis possimus sapiente omnis esse?</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default TagsByCategories