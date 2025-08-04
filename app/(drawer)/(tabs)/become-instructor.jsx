import { View, Text, Platform, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import DefaultHeader from "../../../components/DefaultHeader"
import FormField from '../../../components/FormField'
import InstructorSocialsAdd from '../../../components/InstructorSocialsAdd'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../../components/Loading'
import { useShadowStyles } from '../../../hooks/useShadowStyles'

const BecomeInstructor = () => {
    const {shadowStyle} = useShadowStyles();
    const [expertise, setExpertise] = useState("")
    const [bio, setBio] = useState("")

    const [expertiseError, setExpertiseError] = useState(false)
    const [bioError, setBioError] = useState(false)

    const [hasInteractedExpertise, setHasInteractedExpertise] = useState(false)
    const [hasInteractedBio, setHasInteractedBio] = useState(false)

    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        if(hasInteractedExpertise && expertise === ""){
            setExpertiseError(true)
        }
        if(hasInteractedBio && bio === ""){
            setBioError(true)
        }
    }, [expertise, bio, hasInteractedBio, hasInteractedExpertise])
    
    if(isRefreshing) return <Loading />
  return (
    <KeyboardAwareScrollView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="h-full bg-primary-light dark:bg-primary px-4" refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={() => {setIsRefreshing(true); setExpertise(""); setBio(""); setHasInteractedBio(false); setHasInteractedExpertise(false); setTimeout(() => {setIsRefreshing(false)}, 300)}} />}>
        <DefaultHeader headerTitle={"Behuni instruktor"} showBorderBottom={true} bottomSubtitle={"Nga shnderrimi i llogarise tuaj ne Instruktor, je keni hapesira te posacshme per navigimin tuaj si Instruktor. Disa nga hapesirat sic jane: Vijimi i kurseve, leksioneve, kuizeve, favoritet dhe disa nga pjeset te cilat jane te krijuara per rolin e Studentit nuk do mund te jene te posacshme nga ana juaj!"}/>
        <View className="mt-3 gap-3" style={shadowStyle}>
            <View>
                <FormField 
                    title={"Ekspertiza"}
                    placeholder={"Shkruani ketu ekspertizen tuaj..."}
                    handleChangeText={(e) => {setExpertise(e); setHasInteractedExpertise(true)}}
                    value={expertise}
                />
                <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1 font-plight">Ekspertiza mund te jene fushen ne te cilen jeni ju te kualifikuar per te dhene mesime.</Text>
                {expertiseError && <Text className="font-plight text-red-500 mt-1 text-xs">Ju lutem paraqisni ekspertizen tuaj</Text>}
            </View>
            <View>
                <FormField 
                    title={"Biografia juaj"}
                    multiline
                    placeholder={"Shkruani dicka per veten tuaj..."}
                    value={bio}
                    handleChangeText={(e) => {setBio(e); setHasInteractedBio(true)}}
                />
                <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1 font-plight">Biografia mund te perfshije arritjet tua shkollore, te projekteve, apo dicka nga arritja jote profesionale.</Text>
                {bioError && <Text className="font-plight text-red-500 mt-1 text-xs">Ju lutem paraqisni biografine tuaj</Text>}
            </View>
            <View className="mt-2 gap-2 bg-oBlack-light dark:bg-oBlack rounded-md border border-gray-200 dark:border-black-200 p-2">
                <InstructorSocialsAdd expertise={expertise} bio={bio} isRefreshing={isRefreshing}/>
            </View>
            
        </View>
    </KeyboardAwareScrollView>
  )
}

export default BecomeInstructor