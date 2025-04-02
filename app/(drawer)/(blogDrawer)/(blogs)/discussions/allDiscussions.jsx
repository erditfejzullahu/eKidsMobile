import React, { useState } from 'react'
import { FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { icons, images } from '../../../../../constants'
import DiscussionsFilter from '../../../../../components/DiscussionsFilter'
import DiscussionsCard from '../../../../../components/DiscussionsCard'
import { useRouter } from 'expo-router'

const dummyDiscussions = [
    {
        title: "How to optimize React Native performance?",
        content: "I'm facing performance issues in my React Native app. What are some best practices to optimize performance?",
        tags: ["react-native", "performance", "optimization"],
        user: {
            name: "John Doe",
            avatar: "https://example.com/avatar1.jpg",
        },
        votes: 15,
        answers: 3,
        views: 120,
        createdAt: Date.now()
    },
    {
        title: "What's the best way to manage state in Vue 3?",
        content: "I'm trying to decide between Vuex and Pinia. What are the pros and cons of each?",
        tags: ["vue", "vuex", "pinia", "state-management"],
        user: {
            name: "Jane Smith",
            avatar: "https://example.com/avatar2.jpg",
        },
        votes: 22,
        answers: 5,
        views: 200,
        createdAt: Date.now()
    },
    {
        title: "How does Prisma handle self-referencing tables?",
        content: "I have a table where an entity can relate to itself. How do I structure this properly in Prisma?",
        tags: ["prisma", "database", "sql"],
        user: {
            name: "Alice Johnson",
            avatar: "https://example.com/avatar3.jpg",
        },
        votes: 10,
        answers: 2,
        views: 85,
        createdAt: Date.now()
    },
    {
        title: "What are the security best practices for NestJS?",
        content: "I'm building an API with NestJS and want to make sure it's secure. What should I focus on?",
        tags: ["nestjs", "security", "authentication"],
        user: {
            name: "Michael Brown",
            avatar: "https://example.com/avatar4.jpg",
        },
        votes: 30,
        answers: 8,
        views: 350,
        createdAt: Date.now()
    }
];


const allDiscussions = () => {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = () => {
        setIsRefreshing(true)

        setIsRefreshing(false)
    }

  return (
    <FlatList 
        className="bg-primary px-4"
        data={dummyDiscussions}
        contentContainerStyle={{gap:20}}
        keyExtractor={(item) => item.title}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderItem={({item}) => (
            <DiscussionsCard discussion={item}/>
        )}
        ListHeaderComponent={() => (
            <>
            <View className={`my-4 flex-row items-center gap-2 relative`}>
                <TouchableOpacity onPress={() => router.push('/discussions/addDiscussion')} className="absolute top-0 right-0 bg-secondary p-2 rounded-md" style={styles.box}>
                    <Image 
                        source={icons.plusnotfilled}
                        className="h-6 w-6"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl text-white font-pmedium">Diskutimet
                        <View>
                        <Image
                            source={images.path}
                            className="h-auto w-[100px] absolute -bottom-8 -left-12"
                            resizeMode='contain'
                            />
                        </View>
                    </Text>
                </View>
                <View>
                    <Image 
                        source={icons.star}
                        className="size-6"
                        tintColor={"#ff9c01"}
                    />
                </View>
            </View>

            <DiscussionsFilter />

            <View className="mt-2">
                <Text className="text-white font-psemibold"><Text className="text-secondary">123124</Text> Diskutime</Text>
            </View>
            </>
        )}
        ListFooterComponent={() => (
            <View className="mb-4">

            </View>
        )}
    />
  )
}

export default allDiscussions

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