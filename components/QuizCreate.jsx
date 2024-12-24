import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from './FormField'
import CustomButton from './CustomButton'
import { icons } from '../constants'
import CustomModal from './Modal'
import { reqCreateQuiz } from '../services/fetchingService'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'

const QuizCreate = ({quizDetails, sendSuccess}) => {
    
    const [quizParents, setQuizParents] = useState([1])

    const [quizForm, setQuizForm] = useState({}) //kjo shkon tek quizData in req

    const [showModal, setShowModal] = useState([])
    const [buttonIsLoading, setButtonIsLoading] = useState(false)

    const [quizAnswersQuantity, setQuizAnswersQuantity] = useState({
        "parent_1": [1,2,3]
    })

    const {showNotification: successQuiz} = NotifierComponent({
        title: "Kuizi u krijua me sukes!",
        description: "Sapo krijuat kursin tuaj me sukses! Ecurine mund ta percillni tek pjesa e navigimit; 'Kuizet e mia'"
    })

    const {showNotification: failedQuiz} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Dicka shkoi gabim ne krijimin e kursit tuaj! Nese problemi vazhdon kontaktoni Panelin e ndihmes!",
        alertType: "warning"
    })

    const createQuiz = async () => {
        setButtonIsLoading(true)
        const userId = await currentUserID();
        const payload = {
            "quizTitle": quizDetails?.quizName,
            "quizDescription": quizDetails?.quizDescription,
            "userId": userId,
            "quizCategory": quizDetails?.category,
            "quizData": quizForm
        }
        try {
            const response = await reqCreateQuiz(payload) 
            if(response === 200){
                successQuiz()
                sendSuccess(true)
                setQuizForm({})
                setQuizParents([1])
                setQuizAnswersQuantity({
                    "parent_1": [1,2,3]
                })
            }
        } catch (error) {
            failedQuiz()
            console.log(error);
        } finally {
            setButtonIsLoading(false);
        }
    }

    const handleCorrectAnswers = (parent, answerOrder) => {
        const fieldKey = `quiz_parent_${parent}_correct_${answerOrder}`;

        if (quizForm[`quiz_parent_${parent}_type`] === "single") {
            setQuizForm((prevData) => {
                const updatedFields = { ...prevData };
                Object.keys(updatedFields).forEach((key) => {
                    if (key.startsWith(`quiz_parent_${parent}_correct_`)) {
                        delete updatedFields[key];
                    }
                });

                return {
                    ...updatedFields,
                    [fieldKey]: true,
                }; 
            })
        }else if (quizForm[`quiz_parent_${parent}_type`] === "multiple" || quizForm[`quiz_parent_${parent}_type`] === "textual") {
            setQuizForm((prevFields) => {
                const updatedFields = { ...prevFields };
          
                if (updatedFields[fieldKey]) {
                  // If the field already exists, remove it (toggle off)
                  delete updatedFields[fieldKey];
                } else {
                  // If the field doesn't exist, add it (toggle on)
                  updatedFields[fieldKey] = true;
                }
          
                return updatedFields;
              });
        }
    }

    const setQuizType = (parent, type) => {
        if(type === "single"){
            setQuizForm((prevFields) => ({
                ...prevFields,
                [`quiz_parent_${parent}_type`]: type
            }))
        }else if (type === "multiple"){
            setQuizForm((prevFields) => ({
                ...prevFields,
                [`quiz_parent_${parent}_type`]: type
            }))
        }else if (type === "textual"){
            setQuizForm((prevFields) => ({
                ...prevFields,
                [`quiz_parent_${parent}_type`]: type
            }))
        }
        setShowModal(false);
    }

    const handleValues = (index, field, value) => {
        if(field === "question"){
            setQuizForm((prevFields) => ({
                ...prevFields,
                [`quiz_parent_${index}_${field}`]: value
            }))
        }
        if(field === "answers"){
            setQuizForm((prevFields) => ({
                ...prevFields,
                [`quiz_parent_${index[0]}_${field}_${index[1]}`]: value
            }))
        }
    }

    const handleAnswerAdd = (parentId) => {
        setQuizAnswersQuantity((prevData) => ({
            ...prevData,
            [`parent_${parentId}`]: [...prevData[`parent_${parentId}`], prevData[`parent_${parentId}`].length + 1],
          }));
    }

    const handleQuestionAdd = () => {
        const newParentIndex = quizParents.length + 1;
        setQuizParents((prevData) => [...prevData, newParentIndex])
        
        setQuizAnswersQuantity((prevData) => ({
            ...prevData,
            [`parent_${newParentIndex}`]: [1,2,3]
        }))
    }

    const removeAnswer = (parentIndex, answerIndex) => {
        console.log(parentIndex, answerIndex);
    
        setQuizAnswersQuantity((prevData) => {
            const updatedAnswers = prevData[`parent_${parentIndex}`].filter((item, index) => item !== answerIndex)
            const reorderedAnswers = updatedAnswers.map((_, idx) => idx + 1);


            return {
                ...prevData,
                [`parent_${parentIndex}`]: reorderedAnswers,
            };
            
        })

        setQuizForm((prevForm) => {
            const updatedForm = {...prevForm}
            console.log(updatedForm[`quiz_parent_${parentIndex}_answers_${answerIndex}`]);
            
            delete updatedForm[`quiz_parent_${parentIndex}_answers_${answerIndex}`]

            const parentKey = `quiz_parent_${parentIndex}_answers_`;
            const remainingAnswers = Object.keys(updatedForm)
                .filter((key) => key.startsWith(parentKey))
                .sort((a, b) => {
                    // Extract the indices and sort numerically
                    const indexA = parseInt(a.split('_').pop(), 10);
                    const indexB = parseInt(b.split('_').pop(), 10);
                    return indexA - indexB;
                })
                .map((key) => updatedForm[key]);
                
            Object.keys(updatedForm)
                .filter((key) => key.startsWith(parentKey))
                .forEach((key) => delete updatedForm[key]);

            remainingAnswers.forEach((value, newIndex) => {
                updatedForm[`${parentKey}${newIndex + 1}`] = value;
            });

            return updatedForm;
        })
    }


    useEffect(() => {
      console.log(quizForm, ' ?');
      
    }, [quizForm])
    
  return (
    <>
    <View className="">
        {quizParents.map((item, index) => {
            // console.log(index);
            // console.log(quizParents.length - 1);
            
            return(
                <View key={`parent_${item}`} className="mt-4 border-b border-black-200 pb-5" style={styles.box}>
                    <View className="">
                        <FormField 
                            title={"Titulli i pyetjes " + item}
                            value={quizForm[`quiz_parent_${item}_question`]}
                            placeholder={"Shkruani ketu titullin e pyetjes"}
                            otherStyles={"mb-4"}
                            handleChangeText={(value) => handleValues(item, 'question', value)}
                        />
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => setShowModal({ ...showModal, [item]: true})} className="w-auto max-w-[200px] ml-auto -mb-8">
                            <Text className="text-white bg-secondary p-4 py-2 rounded-[5px] text-center font-pregular text-sm">
                                
                            {quizForm[`quiz_parent_${item}_type`] === "single" ? "Nje pergjigje te sakte" : quizForm[`quiz_parent_${item}_type`] === "multiple" ? "Me shume se nje pergjigjje e sakte" : quizForm[`quiz_parent_${item}_type`] === "textual" ? "Pergjigjje tekstuale (Lerini Fushat Zbrazet)" : "Zgjidh llojin e pyetjes"}    
                            </Text>
                        </TouchableOpacity>

                        <CustomModal
                            visible={showModal[item] || false}
                            title={"Zgjedhni llojin e pyetjes"}
                            showButtons={false}
                        >
                            <View>
                                <Text className="text-white font-pregular text-sm text-center my-2">Nga zgjedhja e meposhtme ju vendosni se si do duket dhe do veprohet ne pyetesorin/kuizin tuaj.</Text>
                            </View>
                            <View className="gap-4 my-4">
                                <View>
                                    <TouchableOpacity className="bg-secondary rounded-[5px] p-4 py-2 flex-row items-center justify-center gap-2" onPress={() => setQuizType(item, 'single')}>
                                        <Text className="bg-secondary text-white font-pregular text-sm ">Zgjidhje e vetme</Text>
                                        <View>
                                            <Image 
                                                source={icons.single}
                                                className="h-6 w-6"
                                                resizeMode='contain'
                                                tintColor={"#fff"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity className="bg-secondary rounded-[5px] p-4 py-2 flex-row items-center justify-center gap-2" onPress={() => setQuizType(item, 'multiple')}>
                                        <Text className=" text-white font-pregular text-sm ">Zgjidhje te shumta</Text>
                                        <View>
                                            <Image 
                                                source={icons.multiple}
                                                className="h-6 w-6"
                                                resizeMode='contain'
                                                tintColor={"#fff"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity className="bg-secondary rounded-[5px]  p-4 py-2 flex-row items-center justify-center gap-2" onPress={() => setQuizType(item, 'textual')}>
                                        <Text className=" text-white font-pregular text-sm">Pergjigjje tekstuale</Text>
                                        <View>
                                            <Image 
                                                source={icons.edit}
                                                className="h-6 w-6"
                                                resizeMode='contain'
                                                tintColor={"#fff"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="pt-4 border-t border-black-200 w-full">
                                <TouchableOpacity className="bg-secondary rounded-[5px]  p-4 py-2 flex-row items-center justify-center" onPress={() => setShowModal(false)}>
                                    <Text className="text-white font-pregular text-sm">Mendohuni me shume!</Text>
                                </TouchableOpacity>
                            </View>
                        </CustomModal>
                    </View>

                    {quizAnswersQuantity[`parent_${item}`].map((answerItem, answerIndex) => {
                        // console.log(answerItem, "/???/??");
                        
                        return(
                            <View className="relative" key={`parent_${item}_answer_${answerItem}`}>
                                <FormField
                                    title={"Pergjigjja e pyetjes " + answerItem}
                                    otherStyles={"mt-4"}
                                    value={quizForm?.[`quiz_parent_${item}_answers_${answerItem}`] || ''}
                                    placeholder={"Shkruani pergjigjjen e pyetjes"}
                                    handleChangeText={(value) => handleValues([item, answerItem], 'answers', value)}
                                />
                                <TouchableOpacity
                                    className={`${quizForm[`quiz_parent_${item}_correct_${answerItem}`] === true ? "!bg-[#2b884a]" : ""} absolute -bottom-4 right-0 p-2 py-1 rounded-[5px]`} style={{ backgroundColor: "#5c0a0a" }}
                                    onPress={() => handleCorrectAnswers(item, answerItem)}
                                >
                                    <Text className="text-white font-psemibold text-sm">
                                        {(quizForm[`quiz_parent_${item}_type`] === "multiple" || quizForm[`quiz_parent_${item}_type`] === "single")
                                            && quizForm[`quiz_parent_${item}_correct_${answerItem}`] === true
                                            ? "E sakte"
                                            : (quizForm[`quiz_parent_${item}_type`] === "multiple" || quizForm[`quiz_parent_${item}_type`] === "single")
                                            && quizForm[`quiz_parent_${item}_correct_${answerItem}`] !== true
                                            ? "E pasakte"
                                            : (quizForm[`quiz_parent_${item}_type`] === "textual" && quizForm[`quiz_parent_${item}_correct_${answerItem}`] === true)
                                            ? "Pergjigje e shtuar"
                                            : "Shtoni pergjigje"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeAnswer(item, answerItem)}>
                                    <Image 
                                        source={icons.close}
                                        className="h-4 w-4 absolute right-4 bottom-6"
                                        tintColor={"#CDCDE0"}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    })}


                    <View className="flex-row justify-between flex-1 items-center mt-6">
                        {(index === quizParents.length - 1) && <View className="flex-1 items-center justify-center">
                            <TouchableOpacity onPress={handleQuestionAdd}>
                                <Text className="text-white font-pregular text-sm bg-oBlack rounded-[5px] p-6 py-2">Shto pyetje</Text>
                            </TouchableOpacity>
                        </View>}

                        <View className="flex-1 items-center justify-center">
                            <TouchableOpacity onPress={() => handleAnswerAdd(item)}>
                                <Text className="text-white font-pregular text-sm bg-secondary p-6 py-2 rounded-[5px]">Shto pergjigjje</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                

            )
        })}
    </View>
    <View className="my-4">
        <CustomButton 
            title={"Apliko per kuizin e paraqitur"}
            handlePress={createQuiz}
            isLoading={buttonIsLoading}
        />
    </View>
</>
  )
}

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

export default QuizCreate