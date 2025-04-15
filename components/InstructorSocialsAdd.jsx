import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import FormField from './FormField'
import { currentUserID, logout } from '../services/authService'
import { becomeInstructor } from '../services/fetchingService'
import NotifierComponent from './NotifierComponent'
import CustomButton from './CustomButton'

const InstructorSocialsAdd = ({expertise, bio, isRefreshing}) => {
    const [socialsData, setSocialsData] = useState([{}])
    const [socialsError, setSocialsError] = useState([]);
    const [isLoading, setIsLoading] = useState(false)


    const isValidUrl = (url) => {
        const pattern = new RegExp(
          "^(https?:\\/\\/)?" +                             // optional protocol
          "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+" + // domain name
          "[a-zA-Z]{2,}|" +                                  // domain extension
          "((\\d{1,3}\\.){3}\\d{1,3}))" +                    // OR IP address
          "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" +          // optional port and path
          "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" +                // optional query
          "(\\#[-a-zA-Z\\d_]*)?$",                          // optional fragment
          "i"
        );
        return pattern.test(url);
      };

    const getSocialIcon = (link) => {
        if (!link) return {icon: icons.info, label: "Other"};
      
        const lowercase = link.toLowerCase();
      
        if (lowercase.includes("github")) return {icon: icons.githubIcon, label: "Github"};                           // GitHub
        if (lowercase.includes("meta") || lowercase.includes("facebook")) return {icon: icons.metaIcon, label: "Facebook"}; // Facebook
        if (lowercase.includes("insta") || lowercase.includes("instagram")) return {icon: icons.instagramIcon, label: "Instagram"}; // Instagram
        if (lowercase.includes("twitter") || lowercase.includes("x.com")) return {icon: icons.twitterIcon, label: "Twitter"};  // Twitter/X
        if (lowercase.includes("linkedin")) return {icon: icons.linkedinIcon, label: "Linkedin"};                      // LinkedIn
        if (lowercase.includes("tiktok")) return {icon: icons.tiktokIcon, label: "Tiktok"};                          // TikTok
        if (lowercase.includes("youtube") || lowercase.includes("youtu.be")) return {icon: icons.youtubeIcon, label: "Youtube"}; // YouTube
        if (lowercase.includes("reddit")) return {icon: icons.redditIcon, label: "Reddit"};                          // Reddit
        if (lowercase.includes("snapchat")) return {icon: icons.snapchatIcon, label: "Snapchat"};                      // Snapchat
        if (lowercase.includes("discord")) return {icon: icons.discordIcon, label: "Discord"};                        // Discord
        if (lowercase.includes("t.me") || lowercase.includes("telegram")) return {icon: icons.telegramIcon, label: "Telegram"}; // Telegram
      
        return {icon: icons.info, label: "Other"}; // Fallback icon if no match found
      };
      
      useEffect(() => {
        console.log(socialsData)
      }, [socialsData])
      
    const updateSocialsData = (idx, link) => {
        const isValid = isValidUrl(link);
        const icon = isValid ? getSocialIcon(link) : icons.info;
        setSocialsData(prev => {
            const newData = [...prev];
            newData[idx] = { link, icon: icon.icon, label: icon.label };
            return newData;
        });

        setSocialsError(prev => {
            const newErrors = [...prev];
            newErrors[idx] = isValid ? null : "Linku nuk është valid!";
            return newErrors;
          });
    }

    const removeSocial = (idx) => {
        setSocialsData((prevData) => {
            return prevData.filter((_, index) => index !== idx)
        })
    }

    const {showNotification: success} = NotifierComponent({
        title: "Sukses!",
        description: "Ne vazhdim do behen disa kontrollime. Deri atehere mund te veproni ne fushen tuaj perkatese. Kycuni perseri per te vazhduar me tutje!"
    })
    const {showNotification: unsuccess} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
        alertType: "warning"
    })
    const {showNotification: fillfields} = NotifierComponent({
        title: "Gabim",
        description: "Ju lutem mbushini te gjitha fushat e kerkuara.",
        alertType: "warning"
    })

    const submit = async () => {
        if(expertise === "" || bio === "" || socialsError.length !== 0){
            fillfields()
            return;
        }
        setIsLoading(true)
        const userId = await currentUserID();
        const payload = {
            userId,
            "expertise": expertise,
            "bio": bio,
            "socials": socialsData
        }
        const response = await becomeInstructor(payload)
        if(response === 200){
            success()
            await logout()
        }else{
            unsuccess()
        }
        setIsLoading(false)
    }

    useEffect(() => {
      if(isRefreshing){
        setSocialsData([{}])
        setSocialsError([])
      }
    }, [isRefreshing])
    
    
  return (
    <>
    {socialsData.map((item, idx) => {
        return (
            <View key={idx} className="relative">
                {idx > 0 && <TouchableOpacity onPress={() => removeSocial(idx)} className="bg-oBlack absolute rounded-xl items-center justify-center border-2 border-black-200 h-8 w-8 -left-4 top-6 z-20">
                    <Image 
                        source={icons.close}
                        className="h-8 w-8 p-2"
                        resizeMode='contain'
                        tintColor={"#ff9c01"}
                    />
                </TouchableOpacity>}
                {idx === socialsData.length - 1 &&<TouchableOpacity 
                    className="bg-oBlack rounded-xl items-center justify-center border-2 border-black-200 h-10 w-10 absolute right-0 -top-4"
                    onPress={() => setSocialsData((prevData) => [...prevData, {}])}
                    >
                    <Image
                        source={icons.plus}
                        className="h-8 w-8 p-1"
                        resizeMode='contain'
                        tintColor={"#ff9c01"}
                    />
                </TouchableOpacity>}
                <View className="flex-row gap-1.5">
                    <View className="flex-1">
                        <FormField
                            title={`Rrjeti social ${idx + 1}`}
                            placeholder={"P.sh linku Meta, Github etj."}
                            value={socialsData[idx]?.link}
                            handleChangeText={(e) => updateSocialsData(idx, e)}
                        />
                    </View>
                    <View className="flex-[0.2] justify-end relative">
                        <View className="border-2 items-center justify-center border-black-200 rounded-xl h-16 bg-oBlack">
                            <Image 
                                source={socialsData[idx]?.icon ?? icons.info}
                                className="h-10 w-10"
                                tintColor={"#ff9c01"}
                            />
                        </View>
                    </View>
                </View>
                <Text className="text-gray-400 text-xs mt-1 font-plight">Ne paraqitje te linkut do shfaqet ikona e duhur.</Text>
                {socialsError[idx] && <Text className="font-plight text-red-500 mt-1 text-xs">{socialsError[idx]}</Text>}
            </View>
        )
    })}
    <View className="mt-4 pb-6">
        <CustomButton
                title={"Paraqitni aplikimin"}
                containerStyles={"!min-h-[60px]"}
                handlePress={submit}
                isLoading={isLoading}
            />
    </View>
    </>
  )
}

export default InstructorSocialsAdd