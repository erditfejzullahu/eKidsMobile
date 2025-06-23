import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSectionSchema } from '../schemas/reportSectionSchema'
import NotifierComponent from './NotifierComponent'
import { Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as Animatable from "react-native-animatable"
import FormField from './FormField'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from "expo-image-picker"
import CustomButton from './CustomButton'
import { currentUserID } from '../services/authService'
import { CreateSupportReportTicket, reqUsersBySearch } from '../services/fetchingService'
import _ from 'lodash'
import { icons } from '../constants'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../hooks/useShadowStyles'
import * as Linking from "expo-linking"

const ReportForm = ({onSuccess, availableTickets = []}) => {
    const {colorScheme} = useColorScheme();
        const {shadowStyle} = useShadowStyles();
    const [showResults, setShowResults] = useState(false);
    const [resultLoading, setResultLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])

    const [userReportedId, setUserReportedId] = useState(null)

    
    
    
    const searchUsers = async (query) => {
        if(query.length < 3){
            setSearchResults([])
            return;
        }
        setResultLoading(true)
        const response = await reqUsersBySearch(query)
        console.log(response);
        
        setSearchResults(response);
        setResultLoading(false)
    }
    const debounceFetchUsers = useCallback(_.debounce(searchUsers, 500), [])
    
    const handleUserSelect = (user, onChange) => {
        onChange(user.name)
        setUserReportedId(user.id)
        
        setShowResults(false)
    }
    
    const {control, handleSubmit, watch, trigger, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(reportSectionSchema),
        defaultValues: {
            issueType: 13,
            description: "",
            image: "",
            otherTopic: "",
            reportUser: ""
        },
        mode: "onTouched"
    })

    const selectedTopic = watch("issueType");

    useEffect(() => {
        const isUserReport = selectedTopic === 16 || selectedTopic === 17;
        if (!isUserReport) {
            setUserReportedId(null);
            reset({ reportUser: "" }, {keepValues: true});
            setShowResults(false);
        }
    }, [selectedTopic, reset]);

    const {showNotification: success} = NotifierComponent({
        title: "Sukses",
        description: "Raportimi juaj shkoj me sukses. Do te njoftoheni ne emailin tuaj sa me shpejt qe eshte e mundur.",
        theme: colorScheme
    })

    const {showNotification: error} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri!",
        alertType: "warning",
        theme: colorScheme
    })

    const submitReport = async (data) => {
        if(userReportedId === null){
            UserIdNotSaved()
            return;
        }
        console.log(data)
        const userId = await currentUserID();
        const payload = {
            availableTicketId: data.issueType,
            ticketCreatorUserId: userId,
            reportedUserId: userReportedId,
            otherMessage: data.otherTopic,
            image: data.image
        }
        const response = await CreateSupportReportTicket(payload);
        if(response === 200){
            success()
            onSuccess()
        }else{
            error();
        }
    }

    const {showNotification: permissionNotification} = NotifierComponent({
        title: "Nevojitet leje!",
        description: "Klikoni per te shtuar lejet e posacshme",
        alertType: "warning",
        onPressFunc: () => Linking.openSettings(),
        theme: colorScheme
    })

    const {showNotification: UserIdNotSaved} = NotifierComponent({
        tite: "Dicka shkoi gabim!",
        description: "Klikoni personin qe deshironi te raportoni!",
        alertType: "warning",
        theme: colorScheme
    })

    const pickImage = async (onChange) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permission.granted === false){
            permissionNotification();
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
            let base64 =  `data:${image.assets[0].mimeType};base64,${image.assets[0].base64}`
            onChange(base64)
        }
    }

    useEffect(() => {
      return () => {
        debounceFetchUsers.cancel();
      }
    }, [debounceFetchUsers])
    

  return (
    <View className="gap-3" style={shadowStyle}>
      <View>
        <Controller 
            control={control}
            name="issueType"
            render={({field: {onChange, value}}) => (
                <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder={{ label: "Zgjidhni kategorine e problemit", value: '' }}
                    style={pickerSelectStyles}
                    itemStyle={{color: colorScheme === "dark" ? "#fff" : "#13131a", fontFamily: "Poppins-Regular"}}
                    >
                    {availableTickets.map((item) => (
                        <Picker.Item label={item.ticketTitle} key={item.id} value={item.id} />
                    ))}
                </Picker>
            )}
        />
        <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Zgjidh nje nga rubrikat me larte.</Text>
        {errors.issueType && (
            <Text className="text-red-500 font-plight text-xs">{errors.issueType.message}</Text>
        )}
      </View>

      {(selectedTopic === 17 || selectedTopic === 16) && (
            <Animatable.View animation={"fadeInLeft"}>
            <Controller 
                control={control}
                name="reportUser"
                render={({field: {onChange, value}}) => (
                    <>
                    <FormField 
                        title={"Emri i perdoruesit"}
                        value={value}
                        handleChangeText={(text) => {
                            onChange(text)
                            debounceFetchUsers(text)
                            setShowResults(true);
                        }}
                        placeholder={"P.sh. Erdit Fejzullahu"}
                    />
                    {showResults && (resultLoading ? (
                        <View className="flex-row items-center gap-1 py-1">
                            <Text className="text-oBlack dark:text-white text-sm font-psemibold py-2">Duke kërkuar...</Text>
                            <ActivityIndicator color={"#FF9C01"} size={24} />
                        </View>
                    ) : searchResults.length > 0 ? (
                        <View className="mt-1 bg-primary-light dark:bg-gray-800 rounded-lg max-h-40">
                            <ScrollView className="h-[80px] bg-oBlack-light dark:bg-oBlack border z-50 border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle} scrollEnabled>
                                {searchResults.map((item) => (
                                    <TouchableOpacity 
                                        key={item.id}
                                        className="p-3 bg-oBlack-light dark:bg-oBlack flex-row items-center justify-between border-b border-gray-200 dark:border-black-200"
                                        onPress={() => handleUserSelect(item, onChange)}
                                        style={shadowStyle}
                                    >
                                        <View className="flex-row items-center gap-2">
                                            <View>
                                                <Image 
                                                    source={{uri: item.profilePictureUrl}}
                                                    className="size-12 rounded-md border border-gray-200 dark:border-black-200 p-1"
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <View>
                                                <Text className="text-oBlack dark:text-white font-psemibold text-base">{item.name}</Text>
                                                <Text className="text-gray-600 dark:text-gray-400 font-plight text-xs">{item.isCloseFiend === false && item.isFriend === false ? "Perdorues" : "Mik"}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Image 
                                                source={icons.play2}
                                                className="size-6"
                                                resizeMode='contain'
                                                tintColor={"#ff9c01"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    ) : value.length >= 3 && (
                        <Text className="text-oBlack dark:text-white text-sm font-psemibold py-2">Nuk u gjet asnjë përdorues</Text>
                    ))}
                    </>
                )}
            />

            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Paraqitni emrin e perdoruesit qe deshironi te raportoni per X arsye. Ne shkrim e siper, perdoruesit qe perputhen me shkrimin tuaj do paraqiten ne dritare.</Text>
            {errors.reportUser && (
                <Text className="text-red-500 font-plight text-xs">{errors.reportUser.message}</Text>
            )}
            </Animatable.View>
        )}

      {(selectedTopic === 25 || selectedTopic === 17 || selectedTopic === 16) && (<Animatable.View animation={"fadeInLeft"}>
            <Controller 
                control={control}
                name="otherTopic"
                render={({field: {onChange, value}}) => (
                    <FormField
                        title={`${selectedTopic === 25 ? "Zgjidhni raportimin tjeter" : "Arsyja e raportimit te perdoruesit"}`}
                        value={value}
                        handleChangeText={onChange}
                        placeholder={`${selectedTopic === 25 ? "P.sh. Raportim ne lidhje me..." : "P.sh. Erdit Fejzullahu"}`}
                    />
                )}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">{selectedTopic === 25 ? "Shkruani raportimin tjeter." : "Parqitni arsyjen e raportimit te personit ne fjale."}</Text>
            {errors.otherTopic && (
                <Text className="text-red-500 font-plight text-xs">{errors.otherTopic.message}</Text>
            )}
        </Animatable.View>)}

        
        <View>
            <Controller 
                name="description"
                control={control}
                render={({field: {onChange, value}}) => (
                    <FormField 
                        title={"Pershkrimi i raportimit"}
                        value={value}
                        handleChangeText={onChange}
                        placeholder={"P.sh. Arsyja e raportimit eshte..."}
                    />
                )}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Pershkruani raportimin e problemit ose te ndonje perdoruesi.</Text>
            {errors.otherTopic && (
                <Text className="text-red-500 font-plight text-xs">{errors.otherTopic.message}</Text>
            )}
        </View>
        <View>
            <Controller 
                control={control}
                name="image"
                render={({field: {value, onChange}}) => (
                    <>
                        <Text className={`text-base text-gray-100 font-pmedium mb-2`}>Paraqitni imazhin /Opsionale</Text>
                        <TouchableOpacity className="bg-oBlack border-2 border-black-200 rounded-xl py-3" onPress={() => pickImage(onChange)}>
                            <Text className="text-white text-center font-psemibold ">{value ? "Ndrysho imazhin" : "Zgjidh imazhin"}</Text>
                        </TouchableOpacity>
                        {value ? (
                            <View className="border mt-2 rounded-xl border-black-200 max-h-[200px]" style={shadowStyle}>
                                <Image
                                    source={{uri: value}}
                                    className="w-full h-full"
                                    resizeMode='contain'
                                />
                            </View>
                        ) : null}
                    </>
                )}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Per vleresim me te mire te raportimit tuaj paraqitni screenshots(SC) te problemit/raportimit.</Text>
            {errors.image && (
                <Text className="text-red-500 font-plight text-xs">{errors.image.message}</Text>
            )}
        </View>
        <View>
            <CustomButton 
                title={`${isSubmitting ? "Duke u derguar" : "Dergoni"}`}
                isLoading={isSubmitting}
                handlePress={handleSubmit(submitReport)}
            />
        </View>
    </View>
  )
}

export default ReportForm

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700'
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700'
  },
});

const styles = StyleSheet.create({
    box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
  });