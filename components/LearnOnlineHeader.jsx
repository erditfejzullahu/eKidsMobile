import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../constants'
import Search from "./SearchInput"
import { usePathname } from 'expo-router'

const LearnOnlineHeader = ({headerTitle, sentInput}) => {
    const pathname = usePathname();
    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {
      sentInput(searchInput)
    }, [searchInput])
    
  return (
    <View className={`my-4 ${pathname === "/allTutors" || pathname === "/allUpcomingMeetings" ? "border-b border-black-200 mb-1 pb-4" : ""}`}>
        <Text className="text-2xl text-white font-pmedium">{headerTitle}
            <View>
            <Image
                source={images.path}
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                resizeMode='contain'
            />
            </View>
        </Text>
        <View className="mt-4">
            <Search 
                valueData={searchInput}
                placeholder={pathname === "/allTutors" ? "Kerkoni tutorin ose ekspertizen/lenden..." : pathname === "/allOnlineClasses" ? "Kerkoni kursin online te preferuar..." : "Kerkoni klaset qe jane caktuar..."}
                searchFunc={(data) => setSearchInput(data)}
            />
        </View>
    </View>
  )
}

export default LearnOnlineHeader