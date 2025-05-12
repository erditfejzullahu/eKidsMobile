import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"

const OnlineCourseSectionExpander = ({sections = []}) => {
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
                        <Animatable.Text animation="fadeInLeft" key={lIdx} className="text-gray-400 font-psemibold rounded-sm mx-1 text-sm bg-primary p-4 border border-black-200" style={styles.box}>{lIdx + 1}.{lItem.title}</Animatable.Text>
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