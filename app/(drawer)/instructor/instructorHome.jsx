import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Loading from '../../../components/Loading';
import DefaultHeader from '../../../components/DefaultHeader';
import { icons, images } from '../../../constants';
import SorterComponent from '../../../components/SorterComponent';
import OnlineClassesCard from '../../../components/OnlineClassesCard';

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

const InstructorHome = () => {
  const {user, isLoading} = useGlobalContext();
  const [openSorter, setOpenSorter] = useState(false)
  if(isLoading) return <Loading />
  const userData = user?.data?.userData;
  console.log(userData);
  
  return (
    <View className="flex-1">
      <FlatList 
        className="h-full bg-primary"
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16, gap:24}}
        keyExtractor={(item) => item.id}
        data={onlineClasses}
        renderItem={({item}) => (
          <OnlineClassesCard classes={item}/>
        )}
        ListHeaderComponent={() => (
          <>
          <View className="flex-row items-center gap-2 border-b border-black-200">
            <View className="flex-1">
              <DefaultHeader showBorderBottom={false} headerTitle={`${userData?.firstname + " " + userData?.lastname}`} topSubtitle={"Miresevjen perseri,"} bottomSubtitle={"Ju jeni duke vepruar ne baze te rolit te instruktorit. Per cdo pakjartesi mund te kontaktoni Panelin e Ndihmes!"}/>
            </View>
            <View className="flex-[0.30] items-end">
              <Image 
                source={images.logoNew}
                className="w-24 h-24"
                resizeMode='contain'
              />
            </View>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-pregular text-gray-100 text-lg">Kurse nga koleget tuaj</Text>
            <TouchableOpacity onPress={() => setOpenSorter(!openSorter)}>
              <Image 
                source={icons.sort}
                className="h-8 w-8"
                resizeMode='contain'
                tintColor={"#FF9C01"}
              />
            </TouchableOpacity>
          </View>

          {openSorter && <View className="mt-2">
            <SorterComponent showSorter={openSorter}/>
          </View>}
          </>
        )}
        ListFooterComponent={() => (
          <View className="my-2">

          </View>
        )}
      />
    </View>
  )
}

export default InstructorHome