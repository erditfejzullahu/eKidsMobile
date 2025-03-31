import { View, Text, Platform, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { icons } from '../constants'
import { TouchableOpacity } from 'react-native'

const DiscussionsCard = ({discussion: {title, content, tags, user, votes, answers, views}}) => {
  return (
    <TouchableOpacity className="bg-oBlack border p-4" style={styles.box}>
        <Text className="text-xl font-psemibold text-white mb-3">{title}</Text>
        <Text numberOfLines={3} className="text-sm text-gray-400 font-plight">{content}</Text>

        <View className="flex-row flex-wrap gap-2 mt-4">
        {tags.map((item, index) => (
            <Text key={index} className="text-white font-semibold bg-secondary rounded-md px-2 py-1">{item}</Text>
        ))}
        </View>

        <View className="flex-row flex-wrap justify-between mt-4">
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{votes}</Text> Vota</Text>
                <Image 
                    source={icons.votes}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"ff9c01"}
                />
            </View>
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{answers}</Text> Pergjigjje</Text>
                <Image 
                    source={icons.answers}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"ff9c01"}
                />
            </View>
            <View className="flex-row gap-1.5 items-center">
                <Text className="text-white font-psemibold text-sm"><Text className="text-secondary">{views}</Text> Shikime</Text>
                <Image 
                    source={icons.popular}
                    className="size-6"
                    resizeMode='contain'
                    tintColor={"ff9c01"}
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