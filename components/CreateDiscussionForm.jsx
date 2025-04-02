import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from "./FormField"
import * as Animatable from "react-native-animatable"
import { icons } from '../constants'

const CreateDiscussionForm = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState("")

    const [preferAnonimity, setPreferAnonimity] = useState(false)

    const removeTag = (tag) => {
        setTags((prevData) => prevData.filter((itm) => itm !== tag))
        setTagInput((prevInput) => prevInput.split(" ").filter((word) => word !== tag).join(" "))
    }

    useEffect(() => {
      const newTags = tagInput.trim().split(" ").filter(tag => tag.length > 0);
      if(newTags.length > 0 && newTags[newTags.length - 1] !== tags[tags.length - 1]){
        setTags(newTags);
      }
    }, [tagInput])
    

  return (
    <View className="flex-1 p-4 bg-oBlack border flex-col gap-4 border-black-200" style={styles.box}>
        <TouchableOpacity onPress={() => setPreferAnonimity((prevData) => !prevData)} className="absolute top-0 right-0 bg-secondary px-2 py-1 border-l border-black-200 border-b" style={styles.box}>
            <Animatable.Text animation="pulse" duration={1000} iterationCount="infinite" className="text-white font-psemibold text-sm">{preferAnonimity === false ? "Shfaq Profilin" : "Mos shfaq profilin"}</Animatable.Text>
        </TouchableOpacity>
        <FormField 
            title={"Titulli"}
            placeholder={"Shkruani titullin e diskutimit ketu..."}
            value={title}
            handleChangeText={(text) => setTitle(text)}
            titleStyle={"!font-psemibold"}
        />
        <FormField 
            title={"Pershkrimi"}
            placeholder={"Shkruani pershkrimin e diskutimit ketu..."}
            value={content}
            multiline
            handleChangeText={(text) => setContent(text)}
            titleStyle={"!font-psemibold"}
        />
        <View>
        <FormField 
            title={"Etiketimet"}
            placeholder={"Shkruani etiketimet tuaj ketu..."}
            value={tagInput}
            handleChangeText={(text) => setTagInput(text)}
            titleStyle={"!font-psemibold"}
        />
        <Text className="text-gray-400 mt-1 font-light text-sm">Vemendje: Per qdo hapsire qe behet, krijohet nje etikitim i ri!</Text>
        </View>

        {tags.length > 0 && <View><Text className="text-gray-400 text-base font-plight mb-2">Etiketimet e zgjedhura:</Text>
        <View className="flex-wrap gap-4 flex-row items-center">
            {tags.map((tag, idx) => (
                <View key={idx} className="bg-secondary px-2 py-1 rounded-md relative">
                    <Text className="text-white font-psemibold">{tag}</Text>
                    <TouchableOpacity className="absolute -top-2 -right-2 bg-white rounded-full p-1.5" onPress={() => removeTag(tag)}>
                        <Image 
                            source={icons.close}
                            className="h-2 w-2"
                            resizeMode='contain'
                            tintColor={"#FF9C01"}
                        />
                    </TouchableOpacity>
                </View> 
            ))}
        </View></View>}
    </View>
  )
}

export default CreateDiscussionForm

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