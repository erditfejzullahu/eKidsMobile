import { View, Text, Image, Modal, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import FormField from './FormField'
import CustomButton from './CustomButton'
import { Platform } from 'react-native'

const INProfileDetails = ({user}) => {
    // console.log(user.instructor.socials, " USERII");
    // if(user === null || user.length === 0) return;
    const [userData, setUserData] = useState(user.instructor)
    const [userSocials, setUserSocials] = useState(null)
    const [showDetails, setShowDetails] = useState(true)
    const [socialsError, setSocialsError] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [openSocialsModal, setOpenSocialsModal] = useState(false)
    

    useEffect(() => {
      if(user){
        setUserData(user.instructor)
        setUserSocials(JSON.parse(user.instructor.socials))
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
        <View className="px-4 my-4 gap-3" style={styles.box}>
            <View>
                <FormField 
                    title={"Emri i plote"}
                    placeholder={"Shkruani emrin e plote"}
                    value={userData?.name}
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, name: e}))}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Ky emer do paraqitet kudo ne aplikacion.</Text>
            </View>
            <View>
                <FormField 
                    title={"Nofka juaj"}
                    placeholder={"Shkruani nofken tuaj"}
                    value={userData?.username}
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, username: e}))}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Ne baze te kesaj nofke ju mund te identifoheni me vone.</Text>
            </View>
            <View>
                <FormField 
                    title={"Emaili juaj"}
                    placeholder={"Shkruani emailin tuaj"}
                    value={userData?.email}
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, email: e}))}
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
        <View className="px-4 my-4 gap-3" style={styles.box}>
            <View>
                <FormField 
                    title={"Ekspertiza"}
                    placeholder={"Shkruani ekspertizen tuaj ketu"}
                    value={userData?.expertise}
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, expertise: e}))}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Kjo ekspertize shfaqet ne profil/kurse.</Text>
            </View>
            <View>
                <FormField 
                    title={"Biografia juaj"}
                    placeholder={"Shkruani pjese nga jeta juaj profesionale"}
                    multiline
                    value={userData?.bio}
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, bio: e}))}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Pjesa e biografise mund te terheqe me shume studente. Shfaqet poashtu ne profil/kurse.</Text>
            </View>
            <View>
                <FormField 
                    title={"Mosha juaj"}
                    placeholder={"Paraqitni moshen tuaj"}
                    value={userData?.age?.toString()}
                    keyboardType="number-pad"
                    handleChangeText={(e) => setUserData((prevData) => ({...prevData, age: e}))}
                />
                <Text className="text-xs text-gray-400 font-plight mt-1">Paraqitni moshen korrekte, pasi qe ne baze te moshes do zhvillohen aktivitete kohe pas kohe.</Text>
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-base text-gray-100 font-pmedium mb-1">Rrjetet sociale</Text>
                    <TouchableOpacity onPress={() => setOpenSocialsModal(true)}>
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

    <Modal
        visible={openSocialsModal}
        transparent
        animationType='slide'
        onRequestClose={() => setOpenSocialsModal(false)}
    >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <View className="h-[90%] w-[90%] bg-oBlack rounded-[10px] border border-black-200 justify-between" style={styles.box}>
                <View className="border-b border-black-200 flex-1">
                    <FlatList 
                        contentContainerStyle={{gap:24, paddingLeft: 16, paddingRight: 16}}
                        data={userSocials}
                        keyExtractor={(item) => item.Label}
                        ListHeaderComponent={() => (
                            <View className="mx-auto my-4 border-b border-black-200 bg-oBlack rounded-b-[10px] -mb-2" style={styles.box}>
                                <Text className="text-white font-psemibold text-2xl text-center border-b border-secondary self-start">Rrjete sociale</Text>
                            </View>
                        )}
                        renderItem={({item, index}) => {
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

                                const getSpecifiedIcon = () => {
                                    if(item?.Link){

                                        const lowercase = item?.Link?.toLowerCase();
                                        
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
                                    }
                                }
                                
                                const updateSocialsData = (idx, link) => {
                                    const isValid = isValidUrl(link);
                                    const icon = isValid ? getSocialIcon(link) : icons.info;
                                    setUserSocials(prev => {
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
                                    setUserSocials((prevData) => {
                                        return prevData.filter((_, index) => index !== idx)
                                    })
                                }
                            return (
                                <View className="relative">
                                    {index > 0 && <TouchableOpacity onPress={() => removeSocial(index)} className="bg-oBlack absolute rounded-xl items-center justify-center border-2 border-black-200 h-8 w-8 -left-4 top-6 z-20">
                                        <Image 
                                            source={icons.close}
                                            className="h-8 w-8 p-2"
                                            resizeMode='contain'
                                            tintColor={"#ff9c01"}
                                        />
                                    </TouchableOpacity>}
                                    {index === userSocials.length - 1 &&<TouchableOpacity 
                                        className="bg-oBlack rounded-xl items-center justify-center border-2 border-black-200 h-10 w-10 absolute right-0 -top-4"
                                        onPress={() => setUserSocials((prevData) => [...prevData, {}])}
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
                                                title={`Rrjeti social ${index + 1}`}
                                                placeholder={"P.sh linku Meta, Github etj."}
                                                value={userSocials[index]?.Link}
                                                handleChangeText={(e) => updateSocialsData(index, e)}
                                            />
                                        </View>
                                        <View className="flex-[0.2] justify-end relative">
                                            <View className="border-2 items-center justify-center border-black-200 rounded-xl h-16 bg-oBlack">
                                                <Image 
                                                    source={userSocials[index]?.icon ?? getSpecifiedIcon()?.icon}
                                                    className="h-10 w-10"
                                                    tintColor={"#ff9c01"}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <Text className="text-gray-400 text-xs mt-1 font-plight">Ne paraqitje te linkut do shfaqet ikona e duhur.</Text>
                                    {socialsError[index] && <Text className="font-plight text-red-500 mt-1 text-xs">{socialsError[index]}</Text>}
                                </View>
                            )
                        }}
                    />
                </View>
                <View className="h-[60px]">
                    <TouchableOpacity className="bg-oBlack border-t items-center justify-center flex-1 border-black-200" onPress={() => setOpenSocialsModal(false)} style={styles.box}>
                        <Text className="text-sm font-psemibold text-white">Largoni dritaren</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
    </>
  )
}

export default INProfileDetails

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
  