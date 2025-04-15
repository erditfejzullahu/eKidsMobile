import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import DefaultHeader from "../../../components/DefaultHeader"
import FormField from '../../../components/FormField'
import { icons } from '../../../constants'
import CustomButton from '../../../components/CustomButton'

const becomeInstructor = () => {
  return (
    <ScrollView className="h-full bg-primary px-4">
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
                    placeholder={"Shkruani dicka per veten tuaj..."}
                />
                <Text className="text-gray-400 text-xs mt-1 font-plight">Biografia mund te perfshije arritjet tua shkollore, te projekteve, apo dicka nga arritja jote profesionale.</Text>
            </View>
            <View className="relative mt-2">
                <TouchableOpacity className="bg-oBlack rounded-xl items-center justify-center border-2 border-black-200 h-10 w-10 absolute right-0 -top-4">
                    <Image 
                        source={icons.plus}
                        className="h-8 w-8 p-1"
                        resizeMode='contain'
                        tintColor={"#ff9c01"}
                    />
                </TouchableOpacity>
                <View className="flex-row gap-1.5">
                    <View className="flex-1">
                        <FormField 
                            title={"Rrjetet tua sociale"}
                            placeholder={"P.sh linku Meta, Github etj."}
                        />
                    </View>
                    <View className="flex-[0.2] justify-end relative">
                        <View className="border-2 items-center justify-center border-black-200 rounded-xl h-16 bg-oBlack">
                            <Image 
                                source={icons.info}
                                className="h-10 w-10"
                                tintColor={"#ff9c01"}
                            />
                        </View>
                    </View>
                </View>
                <Text className="text-gray-400 text-xs mt-1 font-plight">Ne paraqitje te linkut do shfaqet ikona e duhur.</Text>
            </View>
            <View className="mt-4">
                <CustomButton 
                    title={"Paraqitni aplikimin"}
                    containerStyles={"!min-h-[60px]"}
                />
            </View>
        </View>
    </ScrollView>
  )
}

export default becomeInstructor