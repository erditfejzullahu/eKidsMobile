import { View, Text, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'

const initialDiscussionsSort = [
    { label: "Te rejat", icon: icons.latest, focused: true },
    { label: "Aktive", icon: icons.completedProgress, focused: false },
    { label: "Urgjente", icon: icons.star, focused: false },
    { label: "Pa pergjigjje", icon: icons.waiting, focused: false },
];

const DiscussionsFilter = () => {
    const [discussionsSort, setDiscussionsSort] = useState(initialDiscussionsSort)

    const handleDiscussionsFilter = (selectedItem, index) => {
        setDiscussionsSort((prevData) => ([
            ...prevData.map((item) => ({
                ...item,
                focused: item.label === selectedItem.label
            }))
        ]))
    }

    useEffect(() => {
        setDiscussionsSort(initialDiscussionsSort);
    }, []);

  return (
    <View className="flex-row flex-wrap justify-end mt-2">
        {discussionsSort.map((item, index) => (
            <TouchableOpacity onPress={() => handleDiscussionsFilter(item, index)} key={item.label} className={`flex-row px-4 py-1.5 items-center justify-center gap-1.5 border border-black-200 bg-oBlack`} style={styles.box}>
                <View>
                    <Text className={`${item.focused ? "text-secondary" : "text-white"} font-plight text-sm`}>{item.label}</Text>
                </View>
                <View>
                    <Image 
                        source={item.icon}
                        className="size-4"
                        tintColor={item.focused ? "#ff9c01" : "#fff"}
                    />
                </View>
            </TouchableOpacity>
        ))}
    </View>
  )
}

export default DiscussionsFilter

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