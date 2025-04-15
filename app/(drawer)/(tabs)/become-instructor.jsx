import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import DefaultHeader from "../../../components/DefaultHeader"
import FormField from '../../../components/FormField'
import { icons } from '../../../constants'
import CustomButton from '../../../components/CustomButton'
import InstructorSocialsAdd from '../../../components/InstructorSocialsAdd'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const becomeInstructor = () => {
  return (
    <KeyboardAwareScrollView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="h-full bg-primary px-4">
        <DefaultHeader headerTitle={"Behuni instruktor"} showBorderBottom={true} bottomSubtitle={"Nga shnderrimi i llogarise tuaj ne Instruktor, je keni hapesira te posacshme per navigimin tuaj si Instruktor. Disa nga hapesirat sic jane: Vijimi i kurseve, leksioneve, kuizeve, favoritet dhe disa nga pjeset te cilat jane te krijuara per rolin e Studentit nuk do mund te jene te posacshme nga ana juaj!"}/>
        <View className="mt-3 gap-3">
            <View>
                <FormField 
                    title={"Ekspertiza"}
                    placeholder={"Shkruani ketu ekspertizen tuaj..."}

                />
                <Text className="text-gray-400 text-xs mt-1 font-plight">Ekspertiza mund te jene fushen ne te cilen jeni ju te kualifikuar per te dhene mesime.</Text>
            </View>
            <View>
                <FormField 
                    title={"Biografia juaj"}
                    multiline
                    placeholder={"Shkruani dicka per veten tuaj..."}
                />
                <Text className="text-gray-400 text-xs mt-1 font-plight">Biografia mund te perfshije arritjet tua shkollore, te projekteve, apo dicka nga arritja jote profesionale.</Text>
            </View>
            <View className="mt-2 gap-2 bg-oBlack rounded-md border border-black-200 p-2">
                <InstructorSocialsAdd />
            </View>
            <View className="mt-4">
                <CustomButton 
                    title={"Paraqitni aplikimin"}
                    containerStyles={"!min-h-[60px]"}
                />
            </View>
        </View>
    </KeyboardAwareScrollView>
  )
}

export default becomeInstructor