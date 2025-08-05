import { View, Text, TextInput, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { useTopbarUpdater } from '../navigation/TopbarUpdater';
import { images } from '../constants';
import SearchInput from "./SearchInput"

const BlogsDrawyerHeader = ({sendDiscussionInput, sendBlogsInput, discussionSection}) => {
    // const {discussionSection} = useTopbarUpdater();
    const [isDiscussionSection, setIsDiscussionSection] = useState(false)

    useEffect(() => {
        if(discussionSection){
            setIsDiscussionSection(true)
        }else{
            setIsDiscussionSection(false)
        }
    }, [discussionSection])

  return (
    <>
    <View className="mb-6">
        <Text className="text-oBlack dark:text-white font-psemibold text-xl">Shfletoni etiketimet
        <View>
            <Image
            source={images.path}
            className="h-auto w-[100px] absolute -bottom-8 -left-12"
            resizeMode='contain'
            />
        </View>
        </Text>
    </View>
    {isDiscussionSection && <View className="mb-4">
        <SearchInput 
          placeholder={"Kerkoni etiketime"}
          searchFunc={(e) => sendDiscussionInput(e)}
        />
    </View>}
    {!isDiscussionSection && <View className="mb-4">
        <SearchInput 
          placeholder={"Kerkoni etiketime"}
          searchFunc={(e) => sendBlogsInput(e)}
        />
    </View>}
    </>
  )
}

export default memo(BlogsDrawyerHeader)