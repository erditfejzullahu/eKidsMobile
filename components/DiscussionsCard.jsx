import { View, Text, Platform, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { icons } from '../constants'
import { TouchableOpacity } from 'react-native'
import RenderHTML from 'react-native-render-html'
import { useRouter } from 'expo-router'
import { noop } from 'lodash'

const DiscussionsCard = ({discussion: {title, content, tags, user, votes, edited, answers, views, createdAt, id}, discussionComponentSection = false, closeDiscussionModal}) => {
    const router = useRouter();
    const [htmlContent, setHtmlContent] = useState({html: ""})
    const {width} = useWindowDimensions();

    useEffect(() => {
        if(content){
            setHtmlContent((prevData) => ({
                ...prevData,
                html: content
            }))
        }
    }, [content])
    
    const date = new Date(createdAt).toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
      });
  return (
    <TouchableOpacity className="bg-oBlack p-4 relative border border-black-200" style={styles.box} 
        onPress={() => {
            if (discussionComponentSection) {
            closeDiscussionModal();
            }
            router.push(`/discussions/${id}`);
        }}
        >
        <View className="absolute -right-2 -top-2 border border-black-200 rounded-md bg-primary p-2" style={styles.box}>
            {user !== null ? <Image 
                source={{uri: user?.profilePictureUrl}}
                className="w-12 h-12 rounded-sm"
                resizeMode='contain'
            /> : <Image source={icons.profile} className="w-12 h-12" resizeMode='contain'/>}
        </View>
        <View className="-bottom-2 -left-2 bg-primary px-2 py-1 absolute border border-black-200 rounded-md" style={styles.box}>
            <Text className="text-white font-psemibold text-sm">{date}</Text>
        </View>
        <Text className="text-xl font-psemibold text-white mb-3">{title}</Text>
        
        {/* content */}
        <RenderHTML 
            tagsStyles={{
            h1: {color:"white", fontFamily: 'Poppins-Black', marginTop:"1.5em", marginBottom: "0.5em"},
            h2: {color:"white", fontFamily: 'Poppins-Bold', marginTop:"1.25em", marginBottom: "0.75em"},
            h3: {color:"white", fontFamily: 'Poppins-Medium', marginTop: "1em", marginBottom: "0.5em"},
            h4: {color:"white", fontFamily: "Poppins-Medium", marginTop: "0.75em", marginBottom: "0.5em"},
            h5: {color:"white", fontFamily:"Poppins-Regular", marginTop:"0.5em", marginBottom: "0.25em"},
            p: {color:"#9ca3af", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0px", marginBottom: "10px"},
            strong: {color:"white", fontFamily: "Poppins-Bold", fontSize: 12},
            li: {color:"white", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0.25em", marginBottom: "0.25em"},
            ol: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12,  marginTop: "1em", marginBottom: "1em"},
            ul: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12, marginTop: "1em", marginBottom: "1em"},
            }}
            contentWidth={width}
            source={htmlContent}
            classesStyles={{ //for classes exmpl yellow clr
            special: { color: 'green', fontStyle: 'italic' },
            }}
            systemFonts={['Poppins-Black', 'Poppins-Bold', 'Poppins-ExtraBold', 'Poppins-Light', 'Poppins-Medium', 'Poppins-Regular', 'Popping-SemiBold']}
        />
        {/* content */}

        <View className="flex-row flex-wrap gap-2 mt-4">
        {tags.map((item) => (
            <Text key={item.id} className="text-white font-semibold bg-secondary rounded-md px-2 py-1">{item?.title}</Text>
        ))}
        </View>

        <View className="flex-row flex-wrap justify-between my-4">
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{votes}</Text> Vota</Text>
                <Image 
                    source={icons.votes}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </View>
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{answers || 0}</Text> Pergjigjje</Text>
                <Image 
                    source={icons.answers}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </View>
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{views}</Text> Shikime</Text>
                <Image 
                    source={icons.popular}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default DiscussionsCard

const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        })
    },
});