import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import { images } from '../../../constants'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import LearnOnlineTutorCard from '../../../components/LearnOnlineTutorCard';

const udemyInstructors = [
  {
    id: 1,
    name: "John Smith",
    expertise: "Web Development",
    totalStudents: 120000,
    rating: 4.8,
    courses: 12,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Senior full-stack engineer with 10+ years of experience building scalable web apps.",
    socials: {
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmithdev",
      website: "https://johnsmith.dev"
    },
    topCourses: [
      "Master React in 30 Days",
      "Node.js Backend Bootcamp",
      "HTML & CSS for Beginners"
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    expertise: "Data Science & Machine Learning",
    totalStudents: 95000,
    rating: 4.7,
    courses: 9,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "Data scientist and AI consultant helping professionals transition into tech.",
    socials: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/datasarah",
      website: "https://sarahjohnson.ai"
    },
    topCourses: [
      "Python for Data Science",
      "Machine Learning A-Z",
      "Deep Learning with TensorFlow"
    ]
  },
  {
    id: 3,
    name: "Mike Chen",
    expertise: "Mobile App Development",
    totalStudents: 80000,
    rating: 4.6,
    courses: 7,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Mobile engineer specializing in React Native and Flutter with over 50 apps launched.",
    socials: {
      linkedin: "https://linkedin.com/in/mikechenapps",
      twitter: "https://twitter.com/mikechenapps",
      website: "https://mikechen.dev"
    },
    topCourses: [
      "React Native from Zero to Hero",
      "Flutter Crash Course",
      "Publishing Your First App"
    ]
  },
  {
    id: 4,
    name: "Emma Wilson",
    expertise: "Digital Marketing",
    totalStudents: 67000,
    rating: 4.9,
    courses: 6,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Award-winning marketer teaching strategies for brand growth and audience engagement.",
    socials: {
      linkedin: "https://linkedin.com/in/emmawilsonmarketing",
      twitter: "https://twitter.com/emwilson",
      website: "https://emmawilsonmarketing.com"
    },
    topCourses: [
      "Facebook Ads Masterclass",
      "SEO Fundamentals",
      "Email Marketing Strategies"
    ]
  },
  {
    id: 5,
    name: "Carlos Mendoza",
    expertise: "Cybersecurity & Networking",
    totalStudents: 72000,
    rating: 4.5,
    courses: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Certified ethical hacker and trainer helping students secure digital infrastructure.",
    socials: {
      linkedin: "https://linkedin.com/in/carlosmendoza",
      twitter: "https://twitter.com/cybercarlos",
      website: "https://carlosmendoza.tech"
    },
    topCourses: [
      "Cybersecurity Essentials",
      "CompTIA Security+ Bootcamp",
      "Ethical Hacking: Hands-On"
    ]
  },
  {
    id: 6,
    name: "Aisha Khan",
    expertise: "Graphic Design",
    totalStudents: 54000,
    rating: 4.8,
    courses: 8,
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Creative designer with 12 years of experience in branding, UX/UI, and illustration.",
    socials: {
      linkedin: "https://linkedin.com/in/aishakhan",
      twitter: "https://twitter.com/aishadesigns",
      website: "https://aishakhan.design"
    },
    topCourses: [
      "Adobe Illustrator Complete Guide",
      "Logo Design Mastery",
      "UX/UI for Beginners"
    ]
  }
];


const allTutors = () => {

  const inputData = (data) => {
    console.log(data)
  }

  return (
    <View className="flex-1">
        <FlatList 
          className="h-full bg-primary"
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          data={udemyInstructors}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <LearnOnlineTutorCard item={item}/>
          )}
          ListHeaderComponent={() => (
            <LearnOnlineHeader headerTitle={"Te gjithe tutoret"} sentInput={inputData}/>
          )}
          ListFooterComponent={() => (
            <View className="my-2"></View>
          )}
        />
    </View>
  )
}

export default allTutors