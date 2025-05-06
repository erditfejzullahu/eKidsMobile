import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Button, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import DefaultHeader from '../../../components/DefaultHeader'
import { Platform } from 'react-native'
import FormField from '../../../components/FormField'
import { icons } from '../../../constants'
import * as Animatable from "react-native-animatable"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { courseSchema } from '../../../schemas/addCourseSchema'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../../components/Loading'
import CustomButton from '../../../components/CustomButton'
import { InstructorCreateCourse } from '../../../services/fetchingService'
import NotifierComponent from '../../../components/NotifierComponent'
import { useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"
import { useRoute } from '@react-navigation/native'

const AddCourse = () => {
    const route = useRoute();
    const {courseData, updateData} = route.params || {};
    const isUpdateMode = updateData === true;

    const router = useRouter();
    const [step, setStep] = useState(1)
    const maxSteps = 3;
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [topic, setTopic] = useState("");
    const [sections, setSections] = useState("")
    const [sectionLessons, setSectionLessons] = useState([])
    const [sectionLessonsTouched, setSectionLessonsTouched] = useState([])

    const onRefresh = () => {
        setIsRefreshing(true)

        reset();
        setTopic("");
        setSections("")
        setSectionLessons([])
        setSectionLessonsTouched([])
        setStep(1)

        setTimeout(() => {
            setIsRefreshing(false)
        }, 100);
    }

    const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: isUpdateMode ? {
            name: courseData.name || "",
            description: courseData.description || "",
            topicsCovered: JSON.parse(courseData.topicsCovered) || [],
            sectionTitles: courseData.sectionTitles || [],
            sectionLessons: courseData.sectionLessons || [],
            image: courseData.image || ""
        } : {
            name: "",
            description: "",
            topicsCovered: [],
            sectionTitles: [],
            sectionLessons: [],
            image: ""
        },
        mode: "onTouched"
    }) 

    const nextStep = async () => {
        if(step === 1){
            const isNameValid = await trigger("name");
            const isDescriptionValid = await trigger("description");
            const isTopicsValid = await trigger("topicsCovered");
            
            if(isNameValid && isDescriptionValid && isTopicsValid){
                setStep((prev) => Math.min(prev + 1, maxSteps));
            }
        }else if (step === 2){
            const areSectionsValid = await trigger("sectionTitles");
            if(areSectionsValid){
                setStep((prev) => Math.min(prev + 1, maxSteps));
            }
        }
    }

    const prevStep = () => {
        setStep((prev) => Math.min(prev - 1, maxSteps));
    }

    const {showNotification: error} = NotifierComponent({
        title: "Gabim!",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
        alertType: "warning"
    })

    const {showNotification: success} = NotifierComponent({
        title: "Sukses!",
        description: "Sapo shtuat nje kurs me planprogram te detajizuar! Tani mund te krijoni kohe te takimeve online! Do ridrejtoheni pas pak.",
    })

    const {showNotification: requestPermission} = NotifierComponent({
            tite: "Dicka shkoi gabim!",
            description: "Na nevojitet akses ne librarine e fotove tuaja.",
            alertType: "warning"
          })

    const pickImage = async (onChange) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permission.granted === false){
            requestPermission();
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

    const onSubmit = async (data) => {
        console.log(data)
        const response = await InstructorCreateCourse(data);
        if(response){
            success()
            setTimeout(() => {
                router.replace('/instructors/addScheduleMeeting')
            }, 1500);
        }else{
            error()
        }
    }

if(isRefreshing) return <Loading />
  return (
    <KeyboardAwareScrollView className="h-full px-4 bg-primary" behavior={Platform.OS === 'ios' ? 'padding' : 'height'} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>} >
        <DefaultHeader headerTitle={ isUpdateMode ? "Perditesoni kursin" : "Shto nje kurs"} showBorderBottom={true} bottomSubtitle={"Nga kjo forme mund te shtoni kurse te cilat do shfaqen me pas si planprogram se si do kete ecurine kursi juaj! Kjo shfaqet tek shfletimi nga studentet tek seksioni i intruktoreve."}/>
        <Text className="absolute top-0 -right-4 font-psemibold text-gray-400 bg-oBlack text-xs rounded-md px-2 py-1 border border-black-200" style={styles.box}>Hapi <Text className="text-secondary">{step}</Text> nga <Text className="text-secondary">{maxSteps}</Text></Text>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} className="ml-auto">
            <TouchableOpacity className="flex-row items-center gap-1.5">
                <Image 
                    source={icons.infoFilled}
                    className="size-4"
                    resizeMode='contain'
                    tintColor={"#FF9C01"}
                />
                <Text className="text-gray-400 font-psemibold text-xs">Drejtohuni tek versioni WEB</Text>
            </TouchableOpacity>
        </Animatable.View>
        {step === 1 && (<View className="gap-3 mb-4" style={styles.box}>
            <View>
                <Controller 
                    control={control}
                    name='name'
                    render={({field: {onChange, value}}) => (
                        <FormField
                            title={"Emri i kursit"}
                            placeholder={"P.sh. Mesoni Vue.js"}
                            value={value}
                            handleChangeText={onChange}
                        />
                    )}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Ne baze te ketij emri studentet tuaj mund te identifikojne kursin tuaj.</Text>
                {errors.name && (
                    <Text className="text-red-500 text-xs font-plight">{errors.name.message}</Text>
                )}
            </View>
            <View>
                <Controller 
                    control={control}
                    name="description"
                    render={({field: {onChange, value}}) => (
                        <FormField
                            title={"Pershkrimi i kursit"}
                            placeholder={"P.sh. Nje pershkrim i shkurte i kursit"}
                            value={value}
                            handleChangeText={onChange}
                        />
                    )}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Nje pershkrim i shkurte i kursit. Cka behet fjale ne te, sa zgjat etj.</Text>
                {errors.description && (
                    <Text className="text-red-500 text-xs font-plight">{errors.description.message}</Text>
                )}
            </View>
            <View>
                <Controller 
                    control={control}
                    name="image"
                    render={({field: {value, onChange}}) => (
                        <>
                            <TouchableOpacity className="bg-secondary rounded-xl py-3" onPress={() => pickImage(onChange)}>
                                <Text className="text-oBlack text-center font-psemibold ">{value ? "Ndrysho foton" : "Zgjidh foton"}</Text>
                            </TouchableOpacity>
                            {value ? (
                                <View className="border mt-2 rounded-xl border-black-200 max-h-[200px]" style={styles.box}>
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
            </View>
            <View>
            <Controller
                control={control}
                name="topicsCovered"
                render={({ field }) => (
                    <View className="gap-2">
                    <FormField
                        title="Cka aftesohet studenti?"
                        placeholder="P.sh. Aftesohet ne kete pjese..."
                        value={topic}
                        handleChangeText={(e) => setTopic(e)}
                    />
                    <Text className="text-xs text-gray-400 font-plight mt-1">Shkruani se cka do jete i afte te beje studenti ne fund.</Text>
                    {errors.topicsCovered && (
                    <Text className="text-red-500 text-xs font-plight -mt-2">
                        {errors.topicsCovered.message}
                    </Text>
                    )}
                    <TouchableOpacity 
                        onPress={() => {
                        if (topic.trim() !== "") {
                            field.onChange([...field.value, topic.trim()]);
                            setTopic("");
                        }
                        }}
                        className="bg-secondary rounded-md items-center self-start px-4 py-2 mx-auto mt-2"
                        style={styles.box}
                    >
                    <Text className="text-white font-psemibold text-sm">Shto tematike</Text>
                    </TouchableOpacity>
                    {field?.value?.length > 0 && field?.value.map((t, i) => (
                        <View key={i} className="flex-row justify-between items-center bg-oBlack border border-black-200 px-3 py-2 rounded-md mt-2">
                            <View className="flex-row items-center gap-1.5">
                                <Text className="text-white font-psemibold text-sm">{i + 1}.</Text>
                                <Text className="text-white font-psemibold text-sm">{t}</Text>
                            </View>
                        <TouchableOpacity
                            onPress={() => {
                            const updated = field.value.filter((_, idx) => idx !== i);
                            field.onChange(updated);
                            }}
                        >
                            <Text className="text-red-500 font-psemibold">Fshij</Text>
                        </TouchableOpacity>
                        </View>
                    ))}
                    </View>
                )}
                />
                
                
            </View>
        </View>)}
        
        {step === 2 && (
            <View className="gap-3 mb-4" style={styles.box}>
                <View>
                    <Controller 
                        control={control}
                        name="sectionTitles"
                        render={({field }) => (
                            <View className="gap-2">
                                <FormField 
                                    title="Titulli i seksionit"
                                    placeholder="P.sh. Fillimi i literatures"
                                    value={sections}
                                    handleChangeText={(e) => setSections(e)}
                                />
                                <Text className="text-xs text-gray-400 font-plight mt-1">Ne baze te seksionit te dhene, ju do paraqisni titujt e literatures qe do mesohen.</Text>
                                {errors.sectionTitles && (
                                <Text className="text-red-500 text-xs font-plight -mt-2">
                                    {errors.sectionTitles.message}
                                </Text>)}
                                <TouchableOpacity 
                                    onPress={() => {
                                    if (sections.trim() !== "") {
                                        field.onChange([...field.value, sections.trim()]);
                                        setSections("");
                                    }
                                    }}
                                    className="bg-secondary rounded-md items-center self-start px-4 py-2 mx-auto mt-2"
                                    style={styles.box}
                                >
                                <Text className="text-white font-psemibold text-sm">Shto seksion</Text>
                                </TouchableOpacity>
                                {field?.value?.length > 0 && (
                                    <View className="gap-6 flex-1">
                                        {field?.value?.length > 0 && field?.value.map((t, i) => (
                                            <View key={i} className="flex-row justify-between flex-1 w-full relative items-center bg-oBlack border border-black-200 px-3 py-2 rounded-md mt-2">
                                                <View className="absolute left-0 right-0 -bottom-4 justify-center items-center">
                                                {/* Your content here */}
                                                    <Text className="text-white font-plight text-xs bg-primary rounded-md text-center px-1 py-0.5 border border-black-200" style={styles.box}>Llogaritni qe poshte ketij seksioni do shtoni tituj te literatures</Text>
                                                </View>
                                                <View className="flex-row items-center gap-1.5 flex-1">
                                                    <Text className="text-white font-psemibold text-sm">{i + 1}.</Text>
                                                    <Text className="text-white font-psemibold text-sm">{t}</Text>
                                                </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                const updated = field.value.filter((_, idx) => idx !== i);
                                                field.onChange(updated);
                                                }}
                                            >
                                                <Text className="text-red-500 font-psemibold">Fshij</Text>
                                            </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    />
                </View>
            </View>
        )}

        {step === 3 && (
            <View className="gap-3 my-4" style={styles.box}>
                <View className="gap-4 ">
                    {watch("sectionTitles").map((section, index) => (
                        <View key={index} className={`gap-3 border-b border-black-200 ${sectionLessonsTouched.includes(index) ? "pb-5" : "pb-2"}`}>
                            <TouchableOpacity 
                                className="flex-row justify-between flex-1 w-full relative items-center bg-oBlack border border-black-200 px-3 py-2 rounded-md mt-2"
                                onPress={() => setSectionLessonsTouched((prevData) => {
                                    if(prevData.includes(index)){
                                        return prevData.filter(idx => idx !== index);
                                    }else{
                                        return [...prevData, index];
                                    }
                                })}
                                >
                                <Animatable.View animation="pulse" duration={1000} iterationCount="infinite" className="absolute right-0 left-0 -top-2 items-center justify-center mx-auto">
                                    <View className="bg-primary rounded-full p-1 items-center justify-center border border-black-200" style={styles.box}>
                                        <Image 
                                            source={icons.plusnotfilled}
                                            className="size-4"
                                            resizeMode="contain"
                                            tintColor={"#ff9c01"}
                                        />
                                    </View>
                                </Animatable.View>
                                <View className="flex-row items-center gap-1.5 flex-1">
                                        <Text className="text-white font-psemibold text-sm">{index + 1}.</Text>
                                        <Text className="text-white font-psemibold text-sm">{section}</Text>
                                    </View>
                                <TouchableOpacity
                                    
                                >
                                    <Text className="text-red-500 font-psemibold">Ndrysho</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>

                            <View>
                                <Controller 
                                    control={control}
                                    name="sectionLessons"
                                    render={({field}) => (
                                        <View className="gap-2">
                                            <View className={`gap-4 mx-4 ${field?.value[index]?.length > 0 ? "mb-4" : ""}`}>
                                                {field?.value[index]?.length > 0 && field?.value[index].map((lesson, i) => (
                                                <View key={i} className="flex-row justify-between flex-1 w-full relative items-center bg-primary border border-black-200 px-3 py-2 rounded-xl -mt-2">
                                                    <View className="flex-row items-center gap-1.5 flex-1">
                                                        <Text className="text-white font-psemibold text-sm">{i + 1}.</Text>
                                                        <Text className="text-white font-psemibold text-sm">{lesson}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                        const updated = [...field.value];
                                                        updated[index] = updated[index].filter((_, idx) => idx !== i);
                                                        field.onChange(updated);
                                                        }}
                                                    >
                                                        <Text className="text-red-500 font-psemibold">Fshij</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                ))}
                                            </View>
                                            {sectionLessonsTouched.includes(index) && (<View>
                                                <FormField 
                                                    title={`Titulli i leksionit per seksionin ${index + 1}`}
                                                    placeholder={"P.sh. Leksioni i pare i ketij seksioni"}
                                                    value={sectionLessons?.[index] || ""}
                                                    handleChangeText={(e) => setSectionLessons(prevData => {
                                                        const newData = [...prevData];
                                                        newData[index] = e;
                                                        return newData;
                                                    })}
                                                />
                                                <Text className="text-xs text-gray-400 font-plight mt-1">Keto leksione do paraqiten si lloj planprogrami se cka do i informoni studentet tuaj potencial.</Text>
                                                {errors.sectionLessons && (
                                                    <Text className="text-red-500 text-xs font-plight mt-1">
                                                        {errors.sectionLessons[index]?.message}
                                                    </Text>
                                                )}
                                                <TouchableOpacity 
                                                    onPress={() => {
                                                        if ( sectionLessons?.[index]?.trim() !== undefined) {                                                            
                                                          const updated = [...field.value];
                                                          if (!updated[index]) {
                                                            updated[index] = [];
                                                          }
                                                          updated[index] = [...updated[index], sectionLessons?.[index]?.trim()];
                                                          field.onChange(updated);
                                                          
                                                          const newSectionLessons = [...sectionLessons]
                                                          newSectionLessons[index] = ""
                                                          setSectionLessons(newSectionLessons)
                                                        }
                                                    }}
                                                    className="bg-secondary rounded-md items-center self-start px-4 py-2 mx-auto mt-3"
                                                    style={styles.box}
                                                >
                                                <Text className="text-white font-psemibold text-sm">Shto leksion</Text>
                                                </TouchableOpacity>
                                            </View>)}
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        )}

        <View className="my-4 flex-row items-center gap-2">
            {step !== 1 && <View className="flex-1" style={styles.box}>
                <CustomButton 
                    title={`${step === 2 ? "Kthehu tek hapi 1" : "Kthehu tek hapi 2"}`}
                    containerStyles={"!min-h-[55px]"}
                    isLoading={isSubmitting}
                    handlePress={prevStep}
                />
            </View>}
            <View className="flex-1" style={styles.box}>
                <CustomButton 
                    title={`${step === 1 ? "Vazhdo tek hapi 2" : step === 2 ? "Vazhdo tek hapi 3" : `${isUpdateMode ? "Perditesoni kursin" : "Krijoni kursin"}`}`}
                    containerStyles={"!min-h-[55px]"}
                    isLoading={isSubmitting}
                    handlePress={step === 3 ? handleSubmit(onSubmit) : nextStep}
                />
            </View>
        </View>
    </KeyboardAwareScrollView>
  )
}

export default AddCourse

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