import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import FormField from './FormField'
import CustomButton from './CustomButton'

const INProfileDetails = ({user}) => {
    const [userData, setUserData] = useState(user)
    const [userSocials, setUserSocials] = useState(null)
    const [showDetails, setShowDetails] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    console.log(userData);
    

    useEffect(() => {
      if(user){
        setUserData(user)
        setUserSocials(JSON.parse(user.socials))
      }else{
        setUserData(null)
        setUserSocials(null)
      }
    }, [user])
    
    
  return (
    <>
    <View className="w-full border-t border-black-200 ">
        <View className="flex-row justify-between w-full border-b border-black-200">
        <View className="w-1/2 py-4 border-r border-black-200" style={{backgroundColor: showDetails ? "#13131a" : "transparent"}}>
            <TouchableOpacity
            className="flex-row items-center gap-2 justify-center text-center"
            onPress={() => setShowDetails(true)}
            >
            <Image 
                source={icons.resume}
                style={{tintColor: showDetails ? "#ff9c01" : "#fff"}}
                className="h-6 w-6 bg-secon"
                resizeMode="contain"
            />
            <Text className="text-sm text-white font-pregular">Detajet e llogarisë</Text>
            </TouchableOpacity>
        </View>
        <View className="w-1/2 py-4" style={{backgroundColor: !showDetails ? "#13131a" : "transparent"}}>
            <TouchableOpacity 
            className="flex-row items-center gap-2 justify-center text-center"
            onPress={() => setShowDetails(false)}
            >
            <Image
                source={icons.infoFilled}
                className="h-6 w-6"
                resizeMode="contain"
                style={{tintColor: !showDetails ? "#ff9c01" : "#FFF"}}
            />
            <Text className="text-sm text-white font-pregular">Detaje te tjera</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>

    {showDetails ? (
        <View className="px-4 my-4 gap-3">
            <View>
                <FormField 
                    title={"Emri i plote"}
                    placeholder={"Shkruani emrin e plote"}
                    value={userData?.name}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Ky emer do paraqitet kudo ne aplikacion.</Text>
            </View>
            <View>
                <FormField 
                    title={"Nofka juaj"}
                    placeholder={"Shkruani nofken tuaj"}
                    value={userData?.username}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Ne baze te kesaj nofke ju mund te identifoheni me vone.</Text>
            </View>
            <View>
                <FormField 
                    title={"Emaili juaj"}
                    placeholder={"Shkruani emailin tuaj"}
                    value={userData?.email}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Emaili juaj elektronik personal. Verifikimi i veprimeve ne aplikacion behet permes ketij emaili.</Text>
            </View>
            <View>
                <FormField 
                    title={"Numri juaj"}
                    placeholder={"Shkruani numrin tuaj"}
                    keyboardType="number-pad"
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Numri juaj personal. Verifikimi i veprimeve dhe kontaktet ne aplikacion behen permes ketij numri.</Text>
            </View>
            <View>
                <CustomButton 
                    title={"Paraqisni ndryshimet"}
                    containerStyles={"!min-h-[60px]"}
                    isLoading={isLoading}
                />
            </View>
        </View>
    ) : (
        <View className="px-4 my-4 gap-3">
            <View>
                <FormField 
                    title={"Ekspertiza"}
                    placeholder={"Shkruani ekspertizen tuaj ketu"}
                    value={userData?.expertise}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Kjo ekspertize shfaqet ne profil/kurse.</Text>
            </View>
            <View>
                <FormField 
                    title={"Biografia juaj"}
                    placeholder={"Shkruani pjese nga jeta juaj profesionale"}
                    multiline
                    value={userData?.bio}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Pjesa e biografise mund te terheqe me shume studente. Shfaqet poashtu ne profil/kurse.</Text>
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-base text-gray-100 font-pmedium mb-1">Rrjetet sociale</Text>
                    <TouchableOpacity>
                        <Text className="text-secondary font-psemibold text-xs underline">Beje ndryshime</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2">
                {userSocials.map((item, idx) => {
                    const getIconAndLabelFromText = (iconText) => {
                        const lowercase = iconText.toLowerCase();
                      
                        if (lowercase === "github") return { icon: icons.githubIcon, label: "Github" };
                        if (lowercase === "facebook" || lowercase === "meta") return { icon: icons.metaIcon, label: "Facebook" };
                        if (lowercase === "instagram" || lowercase === "insta") return { icon: icons.instagramIcon, label: "Instagram" };
                        if (lowercase === "twitter" || lowercase === "x") return { icon: icons.twitterIcon, label: "Twitter" };
                        if (lowercase === "linkedin") return { icon: icons.linkedinIcon, label: "Linkedin" };
                        if (lowercase === "tiktok") return { icon: icons.tiktokIcon, label: "Tiktok" };
                        if (lowercase === "youtube") return { icon: icons.youtubeIcon, label: "Youtube" };
                        if (lowercase === "reddit") return { icon: icons.redditIcon, label: "Reddit" };
                        if (lowercase === "snapchat") return { icon: icons.snapchatIcon, label: "Snapchat" };
                        if (lowercase === "discord") return { icon: icons.discordIcon, label: "Discord" };
                        if (lowercase === "telegram") return { icon: icons.telegramIcon, label: "Telegram" };
                      
                        return { icon: icons.info, label: "Other" }; // fallback
                      };
                      const { icon } = getIconAndLabelFromText(item.Label)
                    return (
                        <View key={idx} className="border border-black-200 rounded-md items-center justify-center p-1.5">
                            <Image 
                                source={icon}
                                className="w-8 h-8"
                                resizeMode='contain'
                                tintColor={"#ff9c01"}
                            />
                        </View>
                    )
                })}
                </View>
                <Text className="text-xs text-gray-400 font-plight mt-1">Rrjetet tuaj personale sociale.</Text>
            </View>
            <View>
                <CustomButton 
                    title={"Paraqisni ndryshimet"}
                    containerStyles={"!min-h-[60px]"}
                    isLoading={isLoading}
                />
            </View>
        </View>
    )}

    </>
  )
}

export default INProfileDetails

const dummyData = [
    {
      "link": "https://www.facebook.com/yourprofile",
      "icon": "Facebook"
    },
    {
      "link": "https://www.instagram.com/yourprofile",
      "icon": "Instagram"
    },
    {
      "link": "https://www.linkedin.com/in/yourprofile",
      "icon": "LinkedIn"
    },
    {
      "link": "https://www.twitter.com/yourprofile",
      "icon": "Twitter"
    },
    {
      "link": "https://www.youtube.com/c/yourchannel",
      "icon": "YouTube"
    },
    {
      "link": "https://www.tiktok.com/@yourprofile",
      "icon": "TikTok"
    },
    {
      "link": "https://www.github.com/yourprofile",
      "icon": "GitHub"
    },
    {
      "link": "https://yourwebsite.com",
      "icon": "Website"
    }
  ]
  