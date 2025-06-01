import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"
import { icons } from '../constants'

const OnlineCourseSectionExpander = ({sections = [], handleInformationBar, proceedToAvailableRoute}) => {
    const [sectionsOpened, setSectionsOpened] = useState(sections?.map((item) => item.id))
    
    const handleSectionsOpened = (id) => {
        setSectionsOpened((prevData) => {
            if(prevData.includes(id)){
                const newArray = prevData.filter((item) => item !== id)
                return newArray;
            }else{
                return [...prevData, id]
            }
        })
    }

    const handleLessonClick = (item) => {
        if(item.meeting){
            proceedToAvailableRoute(item.meeting.id)
        }else if(!item.meeting && item.video_Url){
            //proceed to video page to watch the content of that lesson.(ME PA VIDEON QE INSTRUKTORI E KA UPLOAD PER KET LEKSION)
        }else if(!item.meeting && item.video_Url === null){
            handleInformationBar();
        }
    }

    if(!Array.isArray(sections)) return null;
    
    return (
    (sections && sections.map((item, idx) => {
        if(!item || !item.id) return null;
        return (
            <View key={item.id}>
                <Animatable.View className={`${sectionsOpened.includes(item.id) ? "-mb-2" : ""}`} animation={{from: {scale: 1}, to: {scale: 1.02}}} direction="alternate" easing={'ease-in-out'} iterationCount="infinite"  duration={1000}>
                    <TouchableOpacity onPress={() => handleSectionsOpened(item.id)} className="bg-oBlack p-4 border border-black-200 mx-4" style={styles.box}>
                            <Text className="text-white font-psemibold">{idx + 1}. {item.title}</Text>
                    </TouchableOpacity>
                </Animatable.View>
                {sectionsOpened.includes(item.id) && <View className="mb-4">
                    {item?.lessons.map((lItem, lIdx) => (
                        <Animatable.View animation="fadeInLeft" key={lIdx} className="relative mx-1">
                            <TouchableOpacity onPress={() => handleLessonClick(lItem)}>
                                <Text className="text-gray-400 relative font-psemibold rounded-sm  text-sm bg-primary p-4 border border-black-200" style={styles.box}>{lIdx + 1}.{lItem.title}</Text>
                                {lItem.meeting && <Text className="absolute text-[8px] bg-oBlack border-black-200 px-0.5 py-[1px] border rounded-br-md border-r font-plight left-0 top-0 text-gray-400" style={styles.box}>{lItem.meeting.status}</Text>}
                                {lItem?.meeting ? (
                                    <TouchableOpacity className="absolute right-1 bottom-1 border rounded-md bg-oBlack p-1 border-t border-l border-black-200" style={styles.box}>
                                        <Animatable.Image
                                            animation={"pulse"}
                                            iterationCount={"infinite"}
                                            duration={2000}
                                            source={icons.play2}
                                            className="size-4"
                                            resizeMode='contain'
                                            tintColor={"#ff9c01"}
                                        />
                                    </TouchableOpacity>
                                ) : !lItem?.meeting && lItem?.video_Url === null ? (
                                    <TouchableOpacity onPress={handleInformationBar} className="absolute right-1 bottom-1 border rounded-md bg-oBlack p-1 border-t border-l border-black-200" style={styles.box}>
                                        <Animatable.Image
                                            animation={"pulse"}
                                            iterationCount={"infinite"}
                                            duration={2000}
                                            source={icons.close}
                                            className="size-4"
                                            resizeMode='contain'
                                            tintColor={"#b91c1c"}
                                        />
                                    </TouchableOpacity>
                                ) : !lItem?.meeting && lItem?.videoUrl ? (
                                    <TouchableOpacity onPress={handleInformationBar} className="absolute flex-row items-center gap-0.5 right-1 bottom-1 border rounded-md bg-oBlack p-1 border-t border-l border-black-200" style={styles.box}>
                                        <Animatable.Image
                                            animation={"pulse"}
                                            iterationCount={"infinite"}
                                            duration={2000}
                                            source={icons.close}
                                            className="size-4"
                                            resizeMode='contain'
                                            tintColor={"#b91c1c"}
                                        />
                                        <Animatable.Image
                                            animation={"pulse"}
                                            iterationCount={"infinite"}
                                            duration={2000}
                                            source={icons.videoCamera}
                                            className="size-4"
                                            resizeMode='contain'
                                            tintColor={"#b91c1c"}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </TouchableOpacity>
                        </Animatable.View>
                    ))}
                </View>}
            </View>
            )
        }
    )))
}

export default OnlineCourseSectionExpander

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
})