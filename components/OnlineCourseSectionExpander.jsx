import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"
import { icons } from '../constants'

const OnlineCourseSectionExpander = ({sections = [], handleInformationBar}) => {
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
                            <TouchableOpacity>
                            <Text className="text-gray-400 relative font-psemibold rounded-sm  text-sm bg-primary p-4 border border-black-200" style={styles.box}>{lIdx + 1}.{lItem.title}</Text>

                            {/* nese ka material/klase online */}
                            {/* <TouchableOpacity className="absolute right-1 bottom-1 border rounded-md bg-oBlack p-1 border-t border-l border-black-200" style={styles.box}>
                                <Animatable.Image
                                    animation={"pulse"}
                                    iterationCount={"infinite"}
                                    duration={2000}
                                    source={icons.play2}
                                    className="size-4"
                                    resizeMode='contain'
                                    tintColor={"#ff9c01"}
                                />
                            </TouchableOpacity> */}
                            {/* nese ka material/klase online */}

                            {/* nese nuk ka material/klase online */}
                            {/* <TouchableOpacity onPress={handleInformationBar} className="absolute right-1 bottom-1 border rounded-md bg-oBlack p-1 border-t border-l border-black-200" style={styles.box}>
                                <Animatable.Image
                                    animation={"pulse"}
                                    iterationCount={"infinite"}
                                    duration={2000}
                                    source={icons.close}
                                    className="size-4"
                                    resizeMode='contain'
                                    tintColor={"#b91c1c"}
                                />
                            </TouchableOpacity> */}
                            {/* nese nuk ka material/klase online */}

                        {/* nese ska ndodh hala ama ka material (video_url content) */}
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
                            {/* nese ska ndodh hala ama ka material (video_url content) */}

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