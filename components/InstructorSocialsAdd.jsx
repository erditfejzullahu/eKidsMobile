import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import FormField from './FormField'

const InstructorSocialsAdd = () => {
    const [socialsCount, setSocialsCount] = useState([1])
    const [socialsData, setSocialsData] = useState([])
    const [socialsError, setSocialsError] = useState([]);


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
        if (!link) return icons.info;
      
        const lowercase = link.toLowerCase();
      
        if (lowercase.includes("github")) return icons.githubIcon;                           // GitHub
        if (lowercase.includes("meta") || lowercase.includes("facebook")) return icons.metaIcon; // Facebook
        if (lowercase.includes("insta") || lowercase.includes("instagram")) return icons.instagramIcon; // Instagram
        if (lowercase.includes("twitter") || lowercase.includes("x.com")) return icons.twitterIcon;  // Twitter/X
        if (lowercase.includes("linkedin")) return icons.linkedinIcon;                      // LinkedIn
        if (lowercase.includes("tiktok")) return icons.tiktokIcon;                          // TikTok
        if (lowercase.includes("youtube") || lowercase.includes("youtu.be")) return icons.youtubeIcon; // YouTube
        if (lowercase.includes("reddit")) return icons.redditIcon;                          // Reddit
        if (lowercase.includes("snapchat")) return icons.snapchatIcon;                      // Snapchat
        if (lowercase.includes("discord")) return icons.discordIcon;                        // Discord
        if (lowercase.includes("t.me") || lowercase.includes("telegram")) return icons.telegramIcon; // Telegram
      
        return icons.info; // Fallback icon if no match found
      };
      

    const updateSocialsData = (idx, link) => {
        const isValid = isValidUrl(link);
        const icon = isValid ? getSocialIcon(link) : icons.info;
        setSocialsData(prev => {
            const newData = [...prev];
            newData[idx] = { link, icon };
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

    useEffect(() => {
      console.log(socialsData);
      
    }, [socialsData])
    
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
    </>
  )
}

export default InstructorSocialsAdd