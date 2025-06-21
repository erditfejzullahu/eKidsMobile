import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { deleteQuizz, getCourseCategories, increaseViewCount, reqGetStatusQuiz, reqStartQuizCompletation } from '../services/fetchingService';
import * as Animatable from "react-native-animatable"
import CustomModal from './Modal';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import NotifierComponent from './NotifierComponent';
import { useTopbarUpdater } from '../navigation/TopbarUpdater';
import ShareToFriends from './ShareToFriends';
import { useColorScheme } from 'nativewind';


const SingleQuizComponent = ({quizData, allQuizzes = false, user, refetchCall}) => {
    const {colorScheme} = useColorScheme();
    const userCategories = user?.data?.categories;
    const userData = user?.data?.userData;
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    
    
    const {shareOpened, setShareOpened} = useTopbarUpdater();

    const {showNotification: successDelete} = NotifierComponent({
        title: "Me sukses!",
        description: `Sapo keni fshirë me sukses kuizin me emër ${quizData?.quizName}`,
        theme: colorScheme
    })

    const {showNotification: unsuccessDelete} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e ndihmes!",
        alertType: "warning",
        theme: colorScheme
    })

    const goToQuiz = () => {
      if(shareOpened){
          setShareOpened(false)
      }
      setModalVisible(false)
      router.push(`/quiz/${quizData?.id}`)
    }   

    const deleteQuizPrompt = async () => {
      if(shareOpened){
          setShareOpened(true)
      }
      setModalVisible(false)
      setTimeout(() => {
          setDeleteModalVisible(true)
      }, 500);
    }

    const deleteQuiz = async () => {        
      const response = await deleteQuizz(quizData?.id);
      
      if(response === 200){
          setDeleteModalVisible(false)
          successDelete();
          refetchCall();
      }else{
          setDeleteModalVisible(false)
          unsuccessDelete();
      }
      console.log("delete quiz!!!");
    }

    const bounceDownAnimation = {
      0: { transform: [{ translateY: 0 }] },
      0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
      1: { transform: [{ translateY: 0 }] }, // Back to original position
    };

    const {showNotification: successNotification} = NotifierComponent({
      title: "Me sukses!",
      description: "Sapo startuat kuizin me sukes! Mund te percillni kuizet e startuara tek pjesa e Progresit tuaj tek Profili juaj!",
      theme: colorScheme
    })

    const {showNotification: unSuccessNotification} = NotifierComponent({
      title: "Dicka shkoi gabim!",
      description: "Ju lutem provoni perseri duke klikuar mbi kuizin ose kontaktoni Panelin e Ndihmes!",
      theme: colorScheme
    })

    const handleQuizStart = async () => {
      try {
        const payload = {
          "userId": userData?.id,
          "quizId": quizData?.id
        }
        await increaseViewCount(quizData?.id, 'quiz')
        const response = await reqStartQuizCompletation(payload)
        if(response === 200){
          successNotification();
          router.push(`/quiz/${quizData?.id}`)
        }else if (response === 400){
          unSuccessNotification();
        }else if (response === 409){
          router.push(`/quiz/${quizData?.id}`)
        }
        
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <>
    <View className="mt-4 mb-4" style={styles.box}>
      <TouchableOpacity onLongPress={allQuizzes ? () => setShareOpened(true) : undefined} delayLongPress={300} onPress={allQuizzes ? handleQuizStart : () => setModalVisible(true)}>
        <View className="border border-black-200 bg-oBlack p-4 relative">
            <Text className="text-white font-psemibold text-lg">{quizData?.quizName}</Text>
            <Text className="text-gray-400 font-plight text-xs pb-2.5" numberOfLines={3}>{quizData?.quizDescription}</Text>

            <View className="flex-row justify-between pt-2.5 border-t border-black-200">
              <View>
                <Text className="text-white font-psemibold text-xs">{allQuizzes ? "Statusi" : "Shikime"}</Text>
                <Text className="text-secondary font-pbold text-sm">{allQuizzes ? (quizData?.status ? "E perfunduar" : "E paperfunduar") : quizData?.viewCount === 1 ? quizData?.viewCount + " shikim" : quizData?.viewCount + " shikime"}</Text>
              </View>
              <View>
                <Text className="text-white font-psemibold text-xs text-right">Sa here i perfunduar?</Text>
                <Text className="text-secondary font-pbold text-sm text-right">{quizData?.howMany === 0 ? "I pashfletuar" : quizData?.howMany + " Here"}</Text>
              </View>
            </View>

            {/* kategoria absolute */}
            <View className="absolute top-0 right-0 bg-secondary p-2.5 py-1 rounded-bl-[10px] items-center justify-center">
              <Text className="text-white font-psemibold text-xs">{getCourseCategories(userCategories, quizData?.quizCategory)}</Text>
            </View>
            {/* kategoria absolute */}
            <Animatable.View 
              className="absolute -bottom-3 items-center justify-center right-0 left-0 "
              duration={1000}
              iterationCount="infinite"
              animation={bounceDownAnimation}
            >
              {allQuizzes ? (
                  <Text className="text-white px-2 py-1 rounded-[5px] font-psemibold text-xs bg-secondary">Filloni tani!</Text>
              ): (
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Text className="text-white px-2 py-1 rounded-[5px] font-psemibold text-xs bg-secondary">Nderveprime te kuizit</Text>
                  </TouchableOpacity>
              )}
            </Animatable.View>
        </View>
        </TouchableOpacity>
      </View>
      
      <ShareToFriends
        currentUserData={user?.data?.userData}
        shareType="quiz"
        passedItemId={quizData?.id}
      />

      {!allQuizzes && (
        <>
        <CustomModal 
        visible={modalVisible}
        title="Veprimet e kuizit"
        onlyCancelButton={true}
        cancelButtonText="Largo dritaren"
        onClose={() => setModalVisible(false)}
    >
        <View className="mb-6 mt-2">
            <Text className="text-white font-plight text-center text-sm">
                Këtu mund të ndërveproni në lidhje me kursin tuaj! Gjatë kohës do të shtohen edhe mundësitë për redaktimin e kursit dhe shikimin e statistikave ndërmjet kurseve tjera!
            </Text>
        </View>
        <View>
            <TouchableOpacity onPress={() => {
                setModalVisible(false); 
                setTimeout(() => {
                    setShareOpened(true)
                }, 150); }} 
                className="bg-secondary p-2 py-1.5 items-center justify-center gap-2 flex-row rounded-[5px] mb-2">
                <Text className="text-white font-pregular text-sm">Shperndani kursin</Text>
                <Image 
                    source={icons.share}
                    className="h-6 w-6"
                    resizeMode='contain'
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="gap-2 flex-row flex-wrap mb-2">
            <TouchableOpacity onPress={goToQuiz} className="flex-row flex-1 items-center justify-center gap-2 bg-secondary p-2 py-1.5 rounded-[5px]">
                <Text className="text-white font-pregular text-sm">Shikoni kursin</Text>
                <Image 
                    source={icons.quiz}
                    className="h-6 w-6"
                    resizeMode='contain'
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteQuizPrompt} className="flex-row flex-1 items-center justify-center gap-2 bg-secondary p-2 py-1.5 rounded-[5px]">
                <Text className="text-white font-pregular text-sm">Fshini kursin</Text>
                <Image 
                    source={icons.close}
                    className="h-4 w-4"
                    resizeMode='contain'
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        </CustomModal>


        

        <CustomModal
            visible={deleteModalVisible}
            title="A jeni të sigurtë?"
            showButtons={true}
            proceedButtonText="Fshini kursin"
            cancelButtonText="Mos e fshini!"
            onProcced={deleteQuiz}
            onClose={() => setDeleteModalVisible(false)}
        >
            <Text className="text-white font-plight text-sm text-center">
                Me këtë veprim ju fshini kursin e krijuar dhe të gjitha statistikat e kursit tuaj që mund të jenë të ndërlidhura me të ardhurat tuaja të mundshme! Nëse jeni të sigurtë, procedoni me butonin e mëposhtëm.
            </Text>
        </CustomModal>
        </>
      )}
      </>
  )
}

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
  })

export default SingleQuizComponent