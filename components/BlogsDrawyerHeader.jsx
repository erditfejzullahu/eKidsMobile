import { View, Text, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTopbarUpdater } from '../navigation/TopbarUpdater';
import { images } from '../constants';

const BlogsDrawyerHeader = ({sendInput}) => {
    const {discussionSection} = useTopbarUpdater();
    const [isDiscussionSection, setIsDiscussionSection] = useState(false)
    const [tagInput, setTagInput] = useState("")

    useEffect(() => {
      if(tagInput){
        sendInput(tagInput)
      }
    }, [tagInput])
    

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
        <Text className="text-white font-psemibold text-xl">{isDiscussionSection ? "Shfletoni etiketimet" : "Shfletoni kategorite"}
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
        <TextInput
        value={tagInput}
        onChangeText={(e) => setTagInput(e)}
        className="text-white font-plight text-sm placeholder:text-gray-400 border border-black-200 p-3 rounded-md pb-2"
        placeholder='Kerkoni etiektime...'
        />
    </View>}
    </>
  )
}

export default BlogsDrawyerHeader