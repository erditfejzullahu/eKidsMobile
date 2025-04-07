import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import FormField from "./FormField"
import * as Animatable from "react-native-animatable"
import { icons } from '../constants'
import CustomButton from "./CustomButton"
import { CoreBridge, PlaceholderBridge, RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import Placeholder from '@tiptap/extension-placeholder'
import { currentUserID } from '../services/authService'
import { createDiscussion, getTagsByTitle } from '../services/fetchingService'
import NotifierComponent from './NotifierComponent'
import { useRouter } from 'expo-router'
import _ from 'lodash'

const CreateDiscussionForm = () => {
    const router = useRouter();
    const editor = useEditorBridge({
        bridgeExtensions: [
            ...TenTapStartKit,
            CoreBridge.configureCSS(`
                * {
                    font-family: 'Arial';
                }
            `),
            Placeholder.configure({
                placeholder: "Mbusheni pyetjen/diskutimin tuaj ketu"
            }),
        ],
        autofocus: true,
        avoidIosKeyboard: true,
    });

    
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [showAnonimityInformation, setShowAnonimityInformation] = useState(false)
    
    const [isLoading, setIsLoading] = useState(false)
    
    const [preferAnonimity, setPreferAnonimity] = useState(false)
    
    const [tagsResponse, setTagsResponse] = useState([])
    
    const editorContent = useEditorContent(editor, {type: "html"});
    const removeTag = (tag) => {
        setTags((prevData) => prevData.filter((itm) => itm !== tag))
        setTagInput((prevInput) => prevInput.split(" ").filter((word) => word !== tag).join(" "))
    }

    const addExistingTag = (tag) => {
        setTags((prevData) => [...prevData, tag])
        setTagInput((prevInput) => prevInput + ` ${tag}`)
    }

    const handleGetTags = async () => {        
        const response = await getTagsByTitle(tagInput);
        if(response){
            setTagsResponse(response)
        }else{
            setTagsResponse([])
        }
    }
    const debounceTagData = _.debounce(() => handleGetTags(), 500);

    useEffect(() => {
      debounceTagData()
    }, [tagInput])
    

    useEffect(() => {
      const newTags = tagInput.trim().split(" ").filter(tag => tag.length > 0);
      if(newTags.length > 0 && newTags[newTags.length - 1] !== tags[tags.length - 1]){
        setTags(newTags);
      }
    }, [tagInput])

    useEffect(() => {
      let timer;
      if(showAnonimityInformation){
        timer = setTimeout(() => {
            setShowAnonimityInformation(false)
        }, 4000);
      }
      return () => (
        clearTimeout(timer)
      )
    }, [showAnonimityInformation])

    useEffect(() => {
      editorContent && setContent(editorContent)
    }, [editorContent])


    
    const {showNotification: successCreation} = NotifierComponent({
        title: "Sukses",
        description: "Sapo krijuat pyetjen/diskutimin me sukses! Mund ta percillni gjendjen e saj tek profili juaj poashtu."
    })

    const {showNotification: failedCreation} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
    })

    const handleCreateDiscussion = async () => {
        setIsLoading(true)
        const userId = await currentUserID();
        const payload = {
            "title": title,
            "content": content,
            "userId": userId,
            "preferAnonimity": preferAnonimity ? 1 : 0,
            "tags": tags.map((tag) => ({"title": tag}))
        }
        
        const response = await createDiscussion(payload);
        if(response === 200){
            successCreation()
            router.replace('(blogs)/discussions/allDiscussions')
        }else{
            failedCreation()
        }
        setIsLoading(false)
    }

    

  return (
    <View className="p-4 bg-oBlack border flex-col gap-4 border-black-200 mb-4" style={styles.box}>
        {showAnonimityInformation && <Animatable.View animation="bounceIn" className="bg-oBlack rounded-md border border-black-200 p-4 absolute top-4 left-0 right-0 mx-4 z-50" style={styles.box}>
            <Text className="text-white font-plight text-sm"><Text className="text-secondary font-psemibold">Shfaq profilin: </Text>Pasi te behet publikimi i diskutimit, perdoruesit mund te shohin qe ju jeni ai/ajo qe e keni bere publikimin.</Text>
            <Text className="text-white font-plight text-sm"><Text className="text-secondary font-psemibold">Mos shfaq profilin: </Text>Pasi te behet publikimi i diskutimit, perdoruesit nuk mund te shohin qe ju jeni ai/ajo qe e keni bere publikimin.</Text>
        </Animatable.View>}
        <TouchableOpacity onPress={() => setShowAnonimityInformation(true)} className="absolute -top-2 -right-2 z-20">
            <Animatable.Image animation="pulse" duration={1000} iterationCount="infinite" 
                source={icons.infoFilled}
                className="h-5 w-5"
                tintColor={"#fff"}
                resizeMode='contain'
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPreferAnonimity((prevData) => !prevData)} className="absolute top-0 right-0 bg-secondary px-2 py-1 border-l border-black-200 border-b" style={styles.box}>
            <Animatable.Text animation="pulse" duration={1000} iterationCount="infinite" className="text-white font-psemibold text-sm">{preferAnonimity === false ? "Shfaq Profilin" : "Mos shfaq profilin"}</Animatable.Text>
        </TouchableOpacity>
        <View>
            <FormField 
                title={"Titulli"}
                placeholder={"Shkruani titullin e diskutimit ketu..."}
                value={title}
                handleChangeText={(text) => setTitle(text)}
                titleStyle={"!font-psemibold"}
            />
            <Text className="text-gray-400 mt-1 font-plight text-sm">Behuni specific ne krijimin e pyetjes/diskutimit tuaj.</Text>
        </View>
        <View>
            <View className="border min-h-[200px] rounded-xl border-black-200 overflow-hidden">
                <RichText editor={editor} style={[{backgroundColor: "#161622", borderRadius: 10, paddingLeft: 10, paddingRight: 10, maxHeight: "200"}, styles.box]}/>
                <KeyboardAvoidingView style={{position: "absolute", width: "100%", bottom: 0}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Toolbar editor={editor} />
                </KeyboardAvoidingView>
            </View>
            <Text className="text-gray-400 mt-1 font-plight text-sm">Perfshij te gjitha informacionet ne menyre te detajizuar.</Text>
            
            <Text className="text-secondary text-sm font-plight"><Text>Ndihmese!<View><Image source={icons.info} className="mx-0.5 -mb-1 h-4 w-4 " tintColor={"#FF9C01"}/></View>: </Text> <Text className="text-gray-400 mt-1 font-plight text-sm relative">Ne klikim te fushes do shfaqet shiriti per perdorime te ndryshme tekstuale.</Text></Text>
                
            
        </View>
        <View>
            <View className="relative">
                <FormField 
                    title={"Etiketimet"}
                    placeholder={"Shkruani etiketimet tuaj ketu..."}
                    value={tagInput}
                    handleChangeText={(text) => {setTagInput(text);}}
                    titleStyle={"!font-psemibold"}
                />
                {tagsResponse.length > 0 && <ScrollView nestedScrollEnabled className="absolute w-[80%] bottom-0 -mb-20 z-20 bg-primary max-h-[70px] h-full rounded-lg border border-black-200" style={styles.box}>
                    {tagsResponse.map((tag, idx) => (
                        <TouchableOpacity key={`tag-${idx}`} className="border-t border-b border-black-200 px-2 py-2" onPress={() => addExistingTag(tag.title)}>
                            <Text className="text-white font-psemibold text-sm">{tag.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>}
            </View>
        <Text className="text-gray-400 mt-1 font-plight text-sm">Vemendje: Per qdo hapsire qe behet, krijohet nje etikitim i ri!</Text>
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

        <CustomButton 
            isLoading={isLoading}
            title={"Krijoni"}
            containerStyles={"!min-h-[60px]"}
            handlePress={handleCreateDiscussion}
        />
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