import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Platform } from 'react-native'
import { icons } from '../constants'
import _ from 'lodash'

const DiscussionsCommentCard = ({item}) => {
    const flatReplies = _.flattenDeep(item.replies)
    console.log(flatReplies);
    const date = new Date(flatReplies.createdAt).toLocaleDateString("sq-AL", {
        day: "numeric",
        month: "short",
        year: "2-digit"
    })
    
  return (
    <>
    <View className="bg-oBlack p-4 border-t border-b border-black-200 gap-4" style={styles.box}>
        <View className="flex-row gap-2" >
        <View className="flex-col items-center gap-4">
            <Image 
                source={icons.upArrow}
                className="h-10 w-10 border border-black-200 rounded-md p-2"
                resizeMode='contain'
                tintColor={"#fff"}
            />
            <Text className="text-white font-psemibold">{item.upvotes}</Text>
            <Image 
                source={icons.downArrow}
                className="h-10 w-10 border border-black-200 rounded-md p-2"
                resizeMode='contain'
                tintColor={"#fff"}
            />
        </View>
        <ScrollView className="max-h-[200px] h-full">
            <Text className="text-white text-sm font-plight">{item.content}</Text>
        </ScrollView>
        </View>
        <View className="flex-row items-end justify-between">
            <TouchableOpacity className="flex-row items-center gap-1 border border-black-200 rounded-md bg-primary px-3 py-1.5">
                <Text className="text-white font-psemibold text-sm">Repliko</Text>
                <Image 
                    source={icons.chat}
                    className="h-4 w-4"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
                <View className="border border-black-200 rounded-md p-3">
                    <Image 
                        source={icons.profile}
                        className="h-6 w-6"
                        resizeMode='contain'
                    />
                </View>
                <View className="flex-col">
                    <Text className="text-white font-psemibold text-sm text-right">Erdit Fejzullahu</Text>
                    <Text className="text-gray-400 text-xs font-plight text-right">21 Jan 2000</Text>
                </View>
            </View>
        </View>
    </View>
    <View className="bg-primary border border-black-200 rounded-md w-[90%] mx-auto p-4 -mt-2.5" style={styles.box}>
        {flatReplies.map((reply,idx) => (
            <Text key={idx} className={`text-gray-400 text-sm font-plight ${idx === (flatReplies.length - 1) ? "" : "mb-1 pb-1 border-b border-black-200"}`}>{reply.content} - <Text className="text-secondary font-psemibold">{reply.username}</Text> <Text className="text-gray-200 text-xs">{date}</Text></Text>
        ))}
    </View>
    </>
  )
}

export default DiscussionsCommentCard

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