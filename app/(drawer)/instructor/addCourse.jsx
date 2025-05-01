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

const addCourse = () => {
    const [step, setStep] = useState(1)
    const maxSteps = 3;
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [topic, setTopic] = useState("");

    const onRefresh = () => {
        setIsRefreshing(true)

        reset();
        setTopic("");

        setTimeout(() => {
            setIsRefreshing(false)
        }, 100);
    }

    const {control, handleSubmit, reset, trigger, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: "",
            description: "",
            topicsCovered: []
        },
        mode: "onTouched"
    }) 

    const nextStep = async () => {
        if(step === 1 && (await trigger("name") && (await trigger("description") && (await trigger("topicsCovered"))))){
            setStep((prev) => Math.min(prev + 1, maxSteps));
        }
    }

    const prevStep = () => {
        setStep((prev) => Math.min(prev - 1, maxSteps));
    }

    const onSubmit = () => {

    }

if(isRefreshing) return <Loading />
  return (
    <KeyboardAwareScrollView className="h-full px-4 bg-primary" behavior={Platform.OS === 'ios' ? 'padding' : 'height'} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>} >
        <DefaultHeader headerTitle={"Shto nje kurs"} showBorderBottom={true} bottomSubtitle={"Nga kjo forme mund te shtoni kurse te cilat do shfaqen me pas si planprogram se si do kete ecurine kursi juaj! Kjo shfaqet tek shfletimi nga studentet tek seksioni i intruktoreve."}/>
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
        <View className="gap-3 mb-4" style={styles.box}>
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
                    <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
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
                    <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
                )}
            </View>
            <View>
            <Controller
                control={control}
                name="topicsCovered"
                render={({ field }) => (
                    <View className="gap-2">
                    <FormField
                        title="Çka është përfshirë"
                        placeholder="P.sh. Temë e re"
                        value={topic}
                        onChangeText={setTopic}
                    />
                    <Text className="text-xs text-gray-400 font-plight mt-1">Shkruani se cka perfshihet ne kete kurs. Cilat tematika do permenden/mesohen etj.</Text>
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
                
                {errors.topicsCovered && (
                <Text className="text-red-500 text-xs mt-1">
                    {errors.topicsCovered.message}
                </Text>
                )}
            </View>
            <View className="my-4 flex-row items-center gap-2">
                {step !== 1 && <View className="flex-1">
                    <CustomButton 
                        title={`${step === 2 ? "Kthehu tek hapi 1" : "Kthehu tek hapi 2"}`}
                        containerStyles={"!min-h-[55px]"}
                        isLoading={isSubmitting}
                        handlePress={prevStep}
                    />
                </View>}
                <View className="flex-1">
                    <CustomButton 
                        title={`${step === 1 ? "Kalo tek hapi 2" : step === 2 ? "Kalo tek hapi 3" : "Krijoni kursin"}`}
                        containerStyles={"!min-h-[55px]"}
                        isLoading={isSubmitting}
                        handlePress={step === 3 ? handleSubmit(onSubmit) : nextStep}
                    />
                </View>
            </View>
        </View>
    </KeyboardAwareScrollView>
  )
}

export default addCourse

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