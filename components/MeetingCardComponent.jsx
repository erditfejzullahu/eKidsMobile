import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Platform } from 'react-native'
import { images } from '../constants';
import * as Animatable from "react-native-animatable"

const MeetingCardComponent = ({item}) => {
    if(item === null) return;

    const getStatus = () => {
        switch (item.status) {
            case 0:
                return "Ne pritje";
            case 1:
                return "I perfunduar";
            case 2:
                return "Anuluar";
            case 3:
                return "Ka filluar";
            default:
                return "Ne pritje"
        }
    }

    const formatDuration = () => {
        if(!item.durationTime){
            return "Takim i lire"
        }
        if(item.durationTime < 60){
            return (
                <>
                    <Text className="text-secondary">{item.durationTime}</Text><Text className="text-white"> minuta</Text>
                </>
            )
        }else{
            const hours = item.durationTime / 60;
            return (
                <>
                    <Text className="text-secondary">{hours}</Text><Text className="text-white"> ore</Text>
                </>
            )
        }
    }

    const date = new Date(item.createdAt).toLocaleDateString("sq-AL", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
  return (
    <TouchableOpacity className="bg-oBlack border border-black-200 relative p-2" style={styles.box}>
        <Text className="absolute -left-2 -top-2 z-50 bg-secondary border border-black-200 px-2 py-0.5 font-psemibold text-sm text-white" style={styles.box}>{getStatus()}</Text>
        {item.status !== 0 && <Text className="absolute -top-2 -right-2 z-50 bg-oBlack border border-black-200 px-2 py-0.5 font-psemibold text-sm text-white" style={styles.box}><Text className="text-secondary">{item.participants}</Text> Pjesemarres</Text>}
        {item.status === 0 && <Animatable.Text animation="pulse" iterationCount="infinite" className="absolute -top-2 -right-2 z-50 bg-oBlack border border-black-200 px-3 py-1 font-psemibold text-sm text-white" style={styles.box}>Njoftohuni</Animatable.Text>}
        <Text className="absolute -bottom-2 -left-2 border border-black-200 bg-primary px-3 py-1 font-psemibold text-sm text-white" style={styles.box}>{date}</Text>
        <Text className="absolute -bottom-2 -right-2 border border-black-200 bg-primary px-3 py-1 font-psemibold text-sm text-white" style={styles.box}>{formatDuration()}</Text>
        <View className="h-[120px] border border-black-200" style={styles.box}>
            {item.course.image ? (
                <Image 
                    source={{uri: item.course.image}}
                    className="h-full w-full"
                    resizeMode='cover'
                />
            ) : (
                <Image
                    source={images.logoNew}
                    className="h-full w-full py-2 bg-primary"
                    resizeMode='contain'
                />
            )}
        </View>
        <View className="mt-3 mb-6">
            <Text className="text-white font-pmedium text-xl">{item.title}</Text>
            {item.description ? <Text className="text-gray-100 font-plight text-xs mt-1">{item.description}</Text> : <Text className="text-gray-100 italic text-xs mt-1">Pa pershkrim...</Text>}
        </View>

    </TouchableOpacity>
  )
}

export default MeetingCardComponent

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