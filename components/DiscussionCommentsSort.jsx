import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"
import { Platform } from 'react-native'
import { useShadowStyles } from '../hooks/useShadowStyles'

const DiscussionCommentsSort = () => {
    const {shadowStyle} = useShadowStyles();
    const [sortableComments, setSortableComments] = useState([
        {label: "Nga votat", sort: "votes", icon: icons.votes},
        {label: "Te rejat", sort: "newest", icon: icons.latest},
        {label: "Te vjetrat", sort: "oldest", icon: icons.oldest}
    ])

    const [selectedSort, setSelectedSort] = useState(sortableComments[0])
    const [openedSorter, setOpenedSorter] = useState(false)
  return (
    <View className="relative" style={shadowStyle}>
        <TouchableOpacity onPress={() => setOpenedSorter(!openedSorter)} className="border border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack px-2 py-1.5 flex-row items-center gap-1.5">
            <Text className="text-oBlack dark:text-white text-sm font-plight">{selectedSort.label}</Text>
            <Image 
                source={selectedSort.icon}
                className="w-6 h-6"
                resizeMode='contain'
                tintColor={"#ff9c01"}
            />
        </TouchableOpacity>
        {openedSorter && <Animatable.View animation="bounceIn" duration={1000} className="absolute -left-4  bottom-10 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 w-[130px]">
            {sortableComments.map((item, idx) => (
                <TouchableOpacity key={item.label} className={`${idx !== 2 ? "border-b" : ""} border-gray-200 dark:border-black-200 mx-2 justify-center flex-row items-center`}>
                    <Text className="text-oBlack dark:text-white font-plight text-center px-2 py-1.5">{item.label}</Text>
                    <Image 
                        source={item.icon}
                        className="w-6 h-6"
                        resizeMode='contain'
                        tintColor={"#ff9c01"}
                    />
                </TouchableOpacity>
            ))}
        </Animatable.View>}
    </View>
  )
}

export default DiscussionCommentsSort

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
});