import { View, Text, Image, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { images } from '../../../constants'
import SorterComponent from "../../../components/SorterComponent"
import OnlineClassesCard from '../../../components/OnlineClassesCard';
import { Platform } from 'react-native';

const onlineClasses = [
    {
      id: 1,
      className: "Introduction to Programming",
      description: "Learn the basics of programming using Python. Perfect for beginners.",
      instructor: "John Doe",
      startTime: "2025-04-10T10:00:00Z", // ISO string format
      endTime: "2025-04-10T12:00:00Z",   // ISO string format
      price: 50, // Price in USD
      category: "Programming",
      level: "Beginner",
      availableSeats: 30,
      enrolledStudents: 12,
      imageUrl: "https://example.com/images/programming.jpg",
    },
    {
      id: 2,
      className: "Advanced JavaScript",
      description: "Dive deep into JavaScript with advanced topics like closures, async programming, and more.",
      instructor: "Jane Smith",
      startTime: "2025-04-12T14:00:00Z",
      endTime: "2025-04-12T16:00:00Z",
      price: 75,
      category: "Programming",
      level: "Advanced",
      availableSeats: 20,
      enrolledStudents: 15,
      imageUrl: "https://example.com/images/javascript.jpg",
    },
    {
      id: 3,
      className: "Web Design Basics",
      description: "Learn the fundamentals of web design, including HTML, CSS, and responsive design.",
      instructor: "Mary Johnson",
      startTime: "2025-04-15T09:00:00Z",
      endTime: "2025-04-15T11:00:00Z",
      price: 40,
      category: "Design",
      level: "Beginner",
      availableSeats: 25,
      enrolledStudents: 10,
      imageUrl: "https://example.com/images/web-design.jpg",
    },
    {
      id: 4,
      className: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, algorithms, and data analysis using Python.",
      instructor: "David Lee",
      startTime: "2025-04-20T13:00:00Z",
      endTime: "2025-04-20T15:00:00Z",
      price: 120,
      category: "Data Science",
      level: "Intermediate",
      availableSeats: 15,
      enrolledStudents: 8,
      imageUrl: "https://example.com/images/machine-learning.jpg",
    },
    {
      id: 5,
      className: "Digital Marketing Essentials",
      description: "Learn the basics of digital marketing, including SEO, social media, and content strategy.",
      instructor: "Emily Davis",
      startTime: "2025-04-25T17:00:00Z",
      endTime: "2025-04-25T19:00:00Z",
      price: 65,
      category: "Marketing",
      level: "Beginner",
      availableSeats: 40,
      enrolledStudents: 22,
      imageUrl: "https://example.com/images/digital-marketing.jpg",
    },
    {
      id: 6,
      className: "Advanced Data Structures and Algorithms",
      description: "Master advanced data structures like trees, graphs, and algorithms like dynamic programming.",
      instructor: "Michael Wilson",
      startTime: "2025-04-30T18:00:00Z",
      endTime: "2025-04-30T20:00:00Z",
      price: 100,
      category: "Computer Science",
      level: "Advanced",
      availableSeats: 12,
      enrolledStudents: 5,
      imageUrl: "https://example.com/images/data-structures.jpg",
    },
  ];  


const allOnlineClasses = () => {
  return (
    <View className="flex-1 bg-primary">
        <FlatList
            data={onlineClasses}
            contentContainerStyle={{gap:24, paddingLeft: 16, paddingRight: 16}}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <OnlineClassesCard classes={item}/>
            )}
            ListHeaderComponent={() => (
                <View className="border-b border-black-200 pb-4 overflow-hidden -mb-2">
                <View className="my-4">
                    <Text className="text-2xl text-white font-pmedium">Klaset Online
                        <View>
                        <Image
                            source={images.path}
                            className="h-auto w-[100px] absolute -bottom-8 -left-12"
                            resizeMode='contain'
                        />
                        </View>
                    </Text>
                </View>
                <SorterComponent showSorter={true}/>
                </View>
            )}
            ListFooterComponent={() => (
              <View className="mb-4"></View>
            )}
        />

        
    </View>
  )
}

export default allOnlineClasses

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