import React, { memo } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useColorScheme } from 'nativewind';

const LessonContent = ({htmlContent}) => {
    const {width} = useWindowDimensions();
    const {colorScheme} = useColorScheme();
  return (
    <ScrollView className="h-[40vh] overflow-x px-4 bg-primary-light dark:bg-primary">
        <RenderHTML 
            tagsStyles={{
            h1: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: 'Poppins-Black', marginTop:"1.5em", marginBottom: "0.5em"},
            h2: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: 'Poppins-Bold', marginTop:"1.25em", marginBottom: "0.75em"},
            h3: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: 'Poppins-Medium', marginTop: "1em", marginBottom: "0.5em"},
            h4: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Medium", marginTop: "0.75em", marginBottom: "0.5em"},
            h5: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily:"Poppins-Regular", marginTop:"0.5em", marginBottom: "0.25em"},
            p: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0px", marginBottom: "10px"},
            strong: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Bold", fontSize: 12},
            li: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0.25em", marginBottom: "0.25em"},
            ol: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Bold", fontSize: 12,  marginTop: "1em", marginBottom: "1em"},
            ul: {color: colorScheme === "light" ? "#000" : "#fff", fontFamily: "Poppins-Bold", fontSize: 12, marginTop: "1em", marginBottom: "1em"}
            }}
            contentWidth={width}
            source={htmlContent}
            classesStyles={{ //for classes exmpl yellow clr
            special: { color: 'green', fontStyle: 'italic' },
            }}
            systemFonts={['Poppins-Black', 'Poppins-Bold', 'Poppins-ExtraBold', 'Poppins-Light', 'Poppins-Medium', 'Poppins-Regular', 'Popping-SemiBold']}
        />
    </ScrollView>
  )
}

export default memo(LessonContent)