import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { useRole } from '../navigation/RoleProvider'
import * as ImagePicker from "expo-image-picker"
import { updateProfilePicture } from '../services/fetchingService'
import NotifierComponent from './NotifierComponent'
import { useColorScheme } from 'nativewind'

const INProfileFirstSection = ({data}) => {
  const {colorScheme} = useColorScheme();
    const {role} = useRole();
    const [userData, setUserData] = useState(data)    
    const [imageChoosen, setImageChoosen] = useState({
        type: null,
        base64: null,
        file: null
    })

    const {showNotification: requestPermission} = NotifierComponent({
        tite: "Dicka shkoi gabim!",
        description: "Na nevojitet akses ne librarine e fotove tuaja.",
        alertType: "warning",
        theme: colorScheme
      })

    const uploadPicture = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permission.granted === false){
            requestPermission()
            return;
        }
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0,
            aspect: [4,3],
            allowsEditing: true,
            base64: true
        })

        if(!image.canceled){
            setImageChoosen((prevData) => ({
                ...prevData,
                type: `data:${image.assets[0].mimeType};base64,`,
                base64: image.assets[0].base64,
                file: image.assets[0].uri
            }))
        }
    }

    const {showNotification: updateFailed} = NotifierComponent({
        tite: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning",
        theme: colorScheme
      })
    
      const {showNotification: profileUpdateSuccess} = NotifierComponent({
        title: "Fotoja juaj e profilit u perditesua me sukses!",
        theme: colorScheme
      }) 

    const changeProfilePicture = async (base64Data) => {
        const formattedBase64 = `${base64Data.type}${base64Data.base64}`

        try {
            const response = await updateProfilePicture(userData.id, {"base64Profile": formattedBase64})
            if(response === 200){
                profileUpdateSuccess()
                setUserData((prevData) => ({
                    ...prevData,
                    profilePictureUrl: imageChoosen.file
                }))
            }else{
                updateFailed()
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
      if(imageChoosen.type && imageChoosen.base64){
        changeProfilePicture(imageChoosen)
      }
    }, [imageChoosen])
    

    useEffect(() => {
      if(data){
        setUserData(data)
      }else{
        setUserData(null)
      }
    }, [data])
    
  return (
    <View className="relative items-center justify-center mt-20">
        <View className="gap-4">
            <TouchableOpacity onPress={uploadPicture} className="rounded-lg p-2 bg-secondary self-start mx-auto">
                <Image 
                    source={{uri: userData?.profilePictureUrl}}
                    className="h-10 w-10 rounded-md"
                    resizeMode='contain'
                />
            </TouchableOpacity>
            <View>
                <Text className="text-xl font-psemibold text-white text-center mb-1">{userData.firstname + " " + userData.lastname}</Text>
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{userData.email}</Text>
                <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{role}</Text>
            </View>
        </View>
    </View>
  )
}

export default INProfileFirstSection