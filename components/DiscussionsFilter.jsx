import { View, Text, Image, TouchableOpacity } from 'react-native'
import { memo, useCallback, useEffect, useState } from 'react'
import { icons } from '../constants'
import { useColorScheme } from 'nativewind';
import { useShadowStyles } from '../hooks/useShadowStyles';
const initialDiscussionsSort = [
    { label: "Te rejat", icon: icons.latest, focused: false, param: 0 },
    { label: "Aktive", icon: icons.completedProgress, focused: false, param: 1 },
    { label: "Urgjente", icon: icons.star, focused: false, param: 2 },
    { label: "Pa pergjigjje", icon: icons.waiting, focused: false, param: 3 },
];

const DiscussionsFilter = ({sendData, sortBy}) => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const [discussionsSort, setDiscussionsSort] = useState(initialDiscussionsSort)

    const handleDiscussionsFilter = useCallback((selectedItem, index) => {
        setDiscussionsSort((prevData) => ([
            ...prevData.map((item) => ({
                ...item,
                focused: item.label === selectedItem.label
            }))
        ]))
        sendData(selectedItem.param)
    }, [setDiscussionsSort, sendData])

    useEffect(() => {
        setDiscussionsSort((prevData) => ([
            ...prevData.map((item) => ({
                ...item,
                focused: item.param === sortBy
            }))
        ]))
    }, [sortBy]);

  return (
    <View className="flex-row flex-wrap justify-end mt-2">
        {discussionsSort.map((item, index) => (
            <TouchableOpacity onPress={() => handleDiscussionsFilter(item, index)} key={item.label} className={`flex-row px-4 py-1.5 items-center justify-center gap-1.5 border border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack`} style={shadowStyle}>
                <View>
                    <Text className={`${item.focused ? "text-secondary" : "text-oBlack dark:text-white"} font-plight text-sm`}>{item.label}</Text>
                </View>
                <View>
                    <Image 
                        source={item.icon}
                        className="size-4"
                        tintColor={item.focused ? "#ff9c01" : colorScheme === "dark" ? "#fff" : "#000"}
                    />
                </View>
            </TouchableOpacity>
        ))}
    </View>
  )
}

export default memo(DiscussionsFilter)
