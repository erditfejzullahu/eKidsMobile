import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons, images } from '../constants'
import Search from "./SearchInput"
import { usePathname } from 'expo-router'

const LearnOnlineHeader = ({headerTitle, sentInput}) => {
    const pathname = usePathname();
    const [searchInput, setSearchInput] = useState("")
    const [showSearchBar, setShowSearchBar] = useState(true)

    useEffect(() => {
      sentInput(searchInput)
    }, [searchInput])
    
  return (
    <View className={`my-4 ${pathname === "/allTutors" || pathname === "/allOnlineMeetings" ? "border-b border-black-200 mb-1 pb-4" : ""} relative`}>
      <TouchableOpacity onPress={() => setShowSearchBar(!showSearchBar)} className="absolute right-4 z-50 top-0 p-1 bg-secondary rounded-md border border-white">
        <Image 
            source={showSearchBar ? icons.downArrow : icons.upArrow}
            className="size-6"
            resizeMode='contain'
            tintColor={"#fff"}
        />
      </TouchableOpacity>
        <Text className="text-2xl text-white font-pmedium">{headerTitle}
            <View>
            <Image
                source={images.path}
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                resizeMode='contain'
            />
            </View>
        </Text>
        {showSearchBar && <View className="mt-4">
            <Search 
                valueData={searchInput}
                placeholder={pathname === "/allTutors" ? "Kerkoni tutorin ose ekspertizen/lenden..." : pathname === "/allOnlineCourses" ? "Kerkoni kursin online te preferuar..." : "Kerkoni klaset qe jane caktuar..."}
                searchFunc={(data) => setSearchInput(data)}
            />
        </View>}
    </View>
  )
}

export default LearnOnlineHeader