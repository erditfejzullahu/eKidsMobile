import { View, Text, ScrollView, RefreshControl, Image, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, FlatList } from 'react-native'
import React from 'react'
import { Link, Redirect, useLocalSearchParams } from 'expo-router'
import useFetchFunction, { navigateToMessenger } from '../../../../hooks/useFetchFunction'
import { getCourseCategories, getQuizById, getUserQuizzesCreated, reqCreateMistake, reqGetAllUserTypes, reqGetStatusQuiz, reqQuizCompleted } from '../../../../services/fetchingService'
import { useGlobalContext } from '../../../../context/GlobalProvider'
import Loading from '../../../../components/Loading'
import { useState } from 'react'
import { useEffect } from 'react'
import { icons, images } from '../../../../constants'
import * as Animatable from 'react-native-animatable'
import { useRouter } from 'expo-router'
import Checkbox from 'expo-checkbox'
import CustomModal from '../../../../components/Modal'
import NotifierComponent from '../../../../components/NotifierComponent'
import { useTopbarUpdater } from '../../../../navigation/TopbarUpdater'
import ShareToFriends from '../../../../components/ShareToFriends'
import { useRole } from '../../../../navigation/RoleProvider'

const Quiz = () => {
    const {role} = useRole();
    if(role === "Instructor") return <Redirect href={'/instructor/instructorHome'}/>
    const { quiz } = useLocalSearchParams();
    const {user, isLoading: userLoading} = useGlobalContext();
    const userCategories = user?.data?.categories;
    const userData = user?.data?.userData;
    const {data, isLoading, refetch} = useFetchFunction(() => getQuizById(quiz));
    const {data: countUserData, isLoading: countUserLoading, refetch: countUserRefetch} = useFetchFunction(() => getUserQuizzesCreated(userData?.id))
    const {data: quizStatusData, isLoading: quizStatusLoading, refetch: quizStatusRefetch} = useFetchFunction(() => reqGetStatusQuiz(quiz))
    const router = useRouter();

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [quizData, setQuizData] = useState(null)
    const [mistakeData, setMistakeData] = useState(null)
    const [userQuizCreatedData, setUserQuizCreatedData] = useState(null);
    const [quizCompletationStatus, setQuizCompletationStatus] = useState(null)
    const [openContactUser, setOpenContactUser] = useState(false)
    const [questionOrder, setQuestionOrder] = useState(0)
    const [allAnswers, setAllAnswers] = useState(null)
    const [successfulModal, setSuccessfulModal] = useState({visible: false, isEnd: false})
    const [unSuccessfulModal, setUnSuccessfulModal] = useState(false)

    const onRefresh = async () => {
        setIsRefreshing(true)
        await refetch();
        await quizStatusRefetch();
        await countUserRefetch();
        setIsRefreshing(false)
    }

    const removeOpenedWindows = () => {
        setOpenContactUser(false)
    }

    const {showNotification} = NotifierComponent({
        title: "Dicka shkoi gabim",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
    })

    const validateQuestions = async (answerItem, questionType, isEnd) => {        
        setAllAnswers((prevItems) => {
            const key = `answerItem-${answerItem.id}`
            prevItems = prevItems || {} //fix null val
            if(prevItems[key]){
                const {[key]: _, ...newItems} = prevItems;   //keshtu bohet destruct; key data shkon tek _ qe osht common for destruct edhe newitems qe jon pa _shkon tek prevITems
                return newItems;
            }else{
                return {
                    ...prevItems,
                    [key]: true,
                }
            }
        })

        if(questionType === 'single'){
            if(answerItem.isCorrect){
                if(!isEnd){
                    setSuccessfulModal({visible: true, isEnd: isEnd})
                    setTimeout(() => {
                        setQuestionOrder((prevData) => (
                            prevData = prevData + 1
                        ))
                        setTimeout(() => {
                            setSuccessfulModal({visible: false, isEnd: isEnd})
                            setAllAnswers(null)
                        }, 1000);
                    }, 1000);
                }else{
                    const payload = {
                        "userId": userData?.id,
                        "quizId": quiz,
                        "completed": true,
                    }
                    // modali finish dhe requesti per perfundim
                    const quizFinished = await reqQuizCompleted(payload)
                    if(quizFinished === 200){
                        setSuccessfulModal({visible: true, isEnd: isEnd})
                    }else{
                        showNotification()
                    }
                }
            }else{
                setUnSuccessfulModal(true)
                const payload = {
                    "userId": userData?.id,
                    "quizId": quiz
                }
                const updateMistake = await reqCreateMistake(payload);
                if(updateMistake === 200){
                    setMistakeData((prevData) => (prevData = prevData + 1))
                }
            }
        }else if (questionType === 'multiple'){

        }else if (questionType === 'textual'){

        }

    }

    const validateMultiples = async (answers, isEnd) => {
        console.log(isEnd);
        
        const allAnswersIds = Object.keys(allAnswers).map((key) => key.split('-')[1]);
        
        const matchingObjects = answers.filter(obj => allAnswersIds.includes(obj.id.toString()));
        const areTrue = matchingObjects.every(obj => obj.isCorrect === true);

        if(areTrue){
            if(!isEnd){
                setSuccessfulModal({visible: true, isEnd: isEnd})
                setTimeout(() => {
                    setQuestionOrder((prevData) => (
                        prevData = prevData + 1
                    ))
                    setTimeout(() => {
                        setSuccessfulModal({visible: false, isEnd: isEnd})
                    }, 500);
                }, 1000);
            }else{
                const payload = {
                    "userId": userData?.id,
                    "quizId": quiz,
                    "completed": true,
                }
                // modali finish dhe requesti per perfundim
                const quizFinished = await reqQuizCompleted(payload)
                if(quizFinished === 200){
                    setSuccessfulModal({visible: true, isEnd: isEnd})
                }else{
                    showNotification()
                }
            }
        }else{
            setUnSuccessfulModal(true)
            const updateMistake = await reqCreateMistake(payload);
            if(updateMistake === 200){
                setMistakeData((prevData) => (prevData = prevData + 1))
            }
        }
        setAllAnswers(null)
    }

    const handleContactCreator = () => {
        navigateToMessenger(router, userQuizCreatedData?.info, userData)
    }

    const tryAgain = () => {
        setAllAnswers(null)
        setUnSuccessfulModal(false)
    }

    useEffect(() => {
        setQuizData(null);
        setUserQuizCreatedData(null)
        setQuizCompletationStatus(null)
        refetch();
        countUserRefetch();
    }, [quiz])

    useEffect(() => {
        if(data) setQuizData(data?.quiz), setMistakeData(data?.mistakes)
        else setQuizData(null), setMistakeData(0)
    }, [data])
    
    useEffect(() => {
      if(countUserData) setUserQuizCreatedData(countUserData)
        else setUserQuizCreatedData(null);
    
    }, [countUserData])

    useEffect(() => {
      if(quizStatusData) setQuizCompletationStatus(quizStatusData)
        else setQuizCompletationStatus(null)    
    
    }, [quizStatusData])

    
        

    if(isLoading || userLoading || quizStatusLoading) return( <Loading /> )
  return (
    <ScrollView
        refreshControl={< RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh}/>}
        className=" h-full bg-primary"
        
    >
        <TouchableWithoutFeedback onPress={removeOpenedWindows}>
            <View>
                <View>
                    <View className="bg-oBlack px-4" style={styles.box}>
                        <View className="absolute bg-secondary p-2 rounded-bl-full top-6 right-0 z-10">
                            <Image 
                                source={quizCompletationStatus?.completed ? icons.completed : icons.completedProgress}
                                tintColor={"#fff"}
                                className="h-8 w-8 pl-2"
                                resizeMode='contain'
                            />
                        </View>
                        <View className="absolute top-0 right-0 z-20" style={styles.box}>
                            <Text className="font-psemibold text-sm text-white min-w-[80px] text-center bg-secondary p-1 px-2.5 rounded-bl-[10px]">{getCourseCategories(userCategories, quizData?.quizCategory)}</Text>
                        </View>

                        <View>
                            <View className="my-4">
                                <Text className="text-xl text-white font-pmedium my-2 max-w-[90%]">{quizData?.quizName}
                                    <View>
                                        <Image
                                            source={images.path}
                                            className="h-auto w-[100px] absolute -bottom-8 -left-12"
                                            resizeMode='contain'
                                        />
                                    </View>
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="p-4">
                        <Text className="font-psemibold text-base text-white">Pershkrimi i kuizit:</Text>
                        <Text className="font-plight text-xs text-gray-400">{quizData?.quizDescription}</Text>
                    </View>

                    <View className="relative bg-oBlack" style={styles.box}>
                        <TouchableOpacity onPress={() => setOpenContactUser(true)} className="p-4">
                            <View className="flex-row flex-1 w-full">
                                <View className="flex-1">
                                    <Text className="font-psemibold text-xs text-white">Krijuesi i kuizit</Text>
                                    <Text className="text-secondary font-psemibold text-base">{userQuizCreatedData?.info?.name} </Text>
                                </View>
                                <View className="items-center justify-center flex-1">
                                    <Animatable.Image
                                        animation="pulse"
                                        iterationCount="infinite"
                                        source={icons.profile}
                                        className="h-8 w-8"
                                        tintColor={"#fff"}
                                    />
                                </View>
                                <View className="items-end flex-1">
                                    <Text className="font-psemibold text-xs text-white">Kuize te krijuara</Text>
                                    <Text className="text-secondary font-psemibold text-base">{userQuizCreatedData?.count} {userQuizCreatedData?.count > 1 && <Text className="text-white text-xs">/sosh</Text>}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {openContactUser &&<Animatable.View animation="bounceIn" duration={500} className="absolute -bottom-5 right-0 bg-primary p-2 border border-black-200 rounded-[5px]" style={styles.box}>
                            <TouchableOpacity onPress={() => router.replace(`/users/${userQuizCreatedData?.info?.id}`)}>
                                <Text className="font-plight text-white text-sm p-1">Shikoni profilin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleContactCreator}>
                                <Text className="font-plight text-white text-sm p-1">Kontaktoni direkt</Text>
                            </TouchableOpacity>
                        </Animatable.View>}
                    </View>
                </View>

                <View className="p-4 flex-row flex-1 gap-3">
                    <View className="flex-shrink justify-between">
                        <View>
                            <Text className="font-psemibold text-sm text-white mb-0.5">Numri i pyetjeve:</Text>
                            <Text className="text-secondary font-psemibold text-xs">{quizData?.questions?.length} {quizData?.questions?.length > 1 && <Text className="text-white text-xs">/sosh</Text>}</Text>
                        </View>
                        <View>
                            <Text className="font-psemibold text-sm text-white mb-0.5">Gabimet:</Text>
                            <Text className="text-secondary font-psemibold text-xs">{mistakeData}</Text>
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="font-psemibold text-sm text-white mb-0.5">Informacione shtese:</Text>
                        <Text className="font-plight text-xs text-gray-400">
                            Gjate perfundimit te kuizeve do te hasni ne lloje te pergjigjeve qe kerkohen ne kuiz! Jane pergjigjet e <Text className="text-secondary">vetme</Text>, <Text className="text-secondary">te shumta</Text> dhe pergjigjet qe kerkojne <Text className="text-secondary">plotesim</Text>
                        </Text>
                    </View>
                </View>

                {quizData && 
                <View className="bg-oBlack p-4" style={styles.box}>
                    {quizData?.questions?.map((quizItem, index) => {
                        const answerType = () => {
                            if(quizItem.questionType === 'single'){
                                return <Text>Pritet pergjigjje <Text className="text-secondary">e vetme</Text> e sakte</Text>
                            }else if (quizItem.questionType === 'multiple'){
                                return <Text>Priten pergjigjje <Text className="text-secondary">te shumta</Text> te sakta</Text>
                            }else if (quizItem.questionType === 'textual') {
                                return <Text>Priten pergjigjje <Text className="text-secondary">me mbushje</Text> te sakta</Text>
                            }
                        }
                        if (questionOrder === index)
                        return(
                            <Animatable.View animation="fadeInLeft" duration={600} key={`question-${index}`}>
                                {quizCompletationStatus?.completed && <Text className="font-psemibold text-secondary text-sm mb-2">E perfunduar me sukes!</Text>}
                                <View className="border-b border-white self-start mb-4">
                                    <Text className="font-psemibold text-sm text-white">{answerType()}</Text>
                                </View>
                                <View className="mb-2">
                                    <Text className="font-psemibold text-lg text-white">{quizItem?.questionText}</Text>
                                </View>

                                <View className="gap-2">
                                    {quizItem?.answers?.map((answerItem, aIndex) => {
                                        
                                        return(
                                            <>
                                            <TouchableOpacity key={`answer-${aIndex}`} onPress={quizCompletationStatus?.completed ? () => {} : () => validateQuestions(answerItem, quizItem.questionType, (quizData?.questions?.length) === (index + 1))} className="border-2 border-black-200 rounded-[5px] flex-row items-center gap-2 p-2">
                                                <Checkbox 
                                                    value={quizCompletationStatus?.completed ? answerItem?.isCorrect : allAnswers?.[`answerItem-${answerItem.id}`]}
                                                    color={allAnswers?.[`answerItem-${answerItem.id}`] || quizCompletationStatus?.completed ? "#FF9C01" : undefined}
                                                />
                                                <Text className="font-psemibold text-sm text-white">{answerItem?.answerText}</Text>
                                            </TouchableOpacity>
                                            {(quizItem?.questionType !== 'single') && (quizItem?.answers?.length === aIndex + 1) && (quizCompletationStatus?.completed !== true) && <TouchableOpacity onPress={() => validateMultiples(quizItem?.answers, (quizData?.questions?.length) === (index + 1))} className="mt-2 self-start">
                                                <Text className="p-2 px-4 border border-white bg-secondary rounded-[5px] text-white font-pmedium">Keni vendosur?</Text>
                                            </TouchableOpacity>}

                                            {(quizCompletationStatus?.completed && quizItem?.answers?.length === aIndex + 1) && <View className="flex-row mt-2 justify-between">
                                                {(questionOrder + 1) >= quizData?.questions?.length && <TouchableOpacity 
                                                    className="w-[100px] items-center border rounded-[5px] bg-primary border-black-200 p-2"
                                                    onPress={() => setQuestionOrder(prevData => (prevData - 1))}>
                                                    <Text className="text-white font-psemibold text-sm  rounded-[5px]">Mbrapa</Text>
                                                </TouchableOpacity>}
                                                {(questionOrder + 1) < quizData?.questions?.length && <TouchableOpacity 
                                                    className="w-[100px] items-center border bg-secondary rounded-[5px] border-white p-2"
                                                    onPress={() => setQuestionOrder(prevData => (prevData + 1))}>
                                                    <Text className="text-white font-psemibold text-sm rounded-[5px]">Para</Text>
                                                </TouchableOpacity>}
                                            </View>}
                                            </>
                                        )
                                    })}
                                </View>
                            </Animatable.View>
                        )
                    })}
                </View>}

                <View>
                    <View className="m-4 pb-3 mb-0 border-b border-black-200">
                        <Text className="font-plight text-xs text-gray-400 mb-2">Apliko per poziten e <Text className="text-secondary font-psemibold">Pionerit</Text> duke krijuar kuize te ndryshme varesisht nga kategorite qe jane paraqitur per zgjedhje.</Text>
                        <Text className="font-plight text-xs text-gray-400">Shfrytezo mundesine per zgjerimin e dijes ndaj tjereve dhe fitimit nga interaksionet ne kuizin tuaj!</Text>
                        <Link href='/add-quiz' className="text-secondary font-psemibold text-xs underline">Krijoni tani!</Link>
                    </View>
                    <View className="p-4 pt-3 mb-2">
                        <Text className="font-plight text-xs text-gray-400">Shfletoni kurset e krijuara nga <Text className="text-secondary font-psemibold">Operatori</Text> apo nga <Text className="font-psemibold text-secondary">perdoruesit tjere</Text> dhe merr kualifikimet e nevojshme per te ardhmen tuaj!</Text>
                        <Link href='/categories' className="text-secondary font-psemibold text-xs underline">Ridrejtohuni tani!</Link>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
        
        <ShareToFriends 
            currentUserData={userData}
            shareType="quiz"
            passedItemId={quiz}
        />

        <CustomModal
            visible={successfulModal.visible}
            title={successfulModal.isEnd ? "URIME!!!" : "Pergjigjje e sakte!"}
            showButtons={successfulModal.isEnd ? true : false}
            onlyProceedButton={successfulModal.isEnd ? true : false}
            proceedButtonText={"Procedoni me tutje"}
            onProcced={() => {setSuccessfulModal({visible: false, isEnd: false}); router.replace('/profile');}}
        >
            <View className="absolute -top-10 right-0">
                <Image
                source={images.mortarBoard}
                className="h-10 w-10 opacity-50"
                resizeMode='contain'
                tintColor={"#FF9C01"}
                />
            </View>
            <View className="absolute -top-10 left-0">
                <Image
                source={images.reward}
                className="h-10 w-10 opacity-50"
                resizeMode='contain'
                tintColor={"#FF9C01"}
                />
            </View>
            {/* nese osht end me bo suksesin */}
            <View className="mt-2 bg-oBlack w-full rounded-[5px] p-2">
                <Text className="font-plight text-base text-center text-white">Vazhdoni me kete ritem!</Text>
            </View>
            <View className="mt-2">
                <Text className="font-plight text-sm text-center text-white">{successfulModal.isEnd ? `Po njoftoheni mbi perfundimin e kuizit ${quizData?.quizName}. Kuizet e perfunduara mund ti gjeni tek profili juaj ne rubriken e "Progresi juaj".` : "Brenda pak kohesh do te ridrejtoheni tek pyetja tjeter..."}</Text>
            </View>
        </CustomModal>

        <CustomModal
            visible={unSuccessfulModal}
            title="Pergjigje e pasakte!"
            onlyProceedButton={true}
            proceedButtonText={"Provoni perseri!"}
            onProcced={tryAgain}
        >
            <View className="absolute -top-10 right-0">
                <Image
                source={icons.tryAgain}
                className="h-10 w-10 opacity-50"
                resizeMode='contain'
                tintColor={"#FF9C01"}
                />
            </View>
            <View className="absolute -top-10 left-0">
                <Image
                source={icons.failedQuiz}
                className="h-10 w-10 opacity-50"
                resizeMode='contain'
                tintColor={"#FF9C01"}
                />
            </View>
            <View className="mt-2 bg-oBlack w-full rounded-[5px] p-2">
                <Text className="font-plight text-base text-center text-white">Sapo keni gabuar!</Text>
            </View>
            <View className="mt-2">
                <Text className="font-plight text-sm text-center text-white">Ju lutem provoni perseri duke klikuar ne kete butonin me poshte!</Text>
            </View>
        </CustomModal>

    </ScrollView>
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

export default Quiz