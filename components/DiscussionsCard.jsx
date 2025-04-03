import { View, Text, Platform, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { icons } from '../constants'
import { TouchableOpacity } from 'react-native'

const DiscussionsCard = ({discussion: {title, content, tags, user, votes, edited, answers, views, createdAt}}) => {
    const date = new Date(createdAt).toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
      });
  return (
    <TouchableOpacity className="bg-oBlack p-4 relative border border-black-200" style={styles.box}>
        <View className="absolute -right-2 -top-2 border border-black-200 rounded-md bg-primary p-2" style={styles.box}>
            {user !== null ? <Image 
                source={{uri: user?.profilePictureUrl}}
                className="w-12 h-12 rounded-sm"
                resizeMode='contain'
            /> : <Image source={icons.profile} className="w-12 h12" resizeMode='contain'/>}
        </View>
        <View className="-bottom-2 -left-2 bg-primary px-2 py-1 absolute border border-black-200 rounded-md" style={styles.box}>
            <Text className="text-white font-psemibold text-sm">{date}</Text>
        </View>
        <Text className="text-xl font-psemibold text-white mb-3">{title}</Text>
        <Text numberOfLines={3} className="text-sm text-gray-400 font-plight">{content}</Text>

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