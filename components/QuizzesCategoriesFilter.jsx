import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SorterComponent from './SorterComponent'
import { icons } from '../constants'

const QuizzesCategoriesFilter = ({sortQuizzes, filterQuizzes, userCategories}) => {
    const [openCategories, setOpenCategories] = useState(false)
  return (
    <View className={`mt-2 relative ${openCategories ? "h-[160px]" : ""} border-b border-black-200 pb-4`}>
        <View>
        <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className={`p-2 w-1/2 flex-row justify-center gap-2 border-black-200 border-b-0 border items-center ml-auto ${openCategories ? "bg-oBlack" : "bg-transparent"}`}>
            <Text className="font-plight text-sm text-white items-center justify-center gap-2">Kategorite</Text>
            <View>
                <Image
                source={icons.categories}
                className="h-5 w-5"
                resizeMode='contain'
                style={{tintColor: openCategories ? "#FF9C01" : "#fff"}}
                />
            </View>
            

        </TouchableOpacity>
        </View>
        <View>
        <SorterComponent
            showSorter={true}
            sortButton={(data) => sortQuizzes(data)}
        />
        </View>
        {openCategories && <View className="absolute flex-row flex-wrap z-20 w-full border-t border-l border-black-200 mt-9 bg-primary ">
        {userCategories.map((item) => {

            return(
            <View key={'category-' + item?.CategoryID} className="w-1/3">
                <TouchableOpacity onPress={() => filterQuizzes(item)} className="p-2 border-b border-r border-black-200 items-center justify-center">
                <Text className="text-white font-plight text-sm text-center">{item?.categoryName}</Text>
                </TouchableOpacity>
            </View>
            
            )
        })}
        </View>}
    </View>
  )
}

export default QuizzesCategoriesFilter