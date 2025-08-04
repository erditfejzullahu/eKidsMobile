import { View, Text, TouchableOpacity, Image } from 'react-native'
import { memo, useCallback, useMemo, useState } from 'react'
import FormField from './FormField'
import CustomButton from './CustomButton'
import { icons } from '../constants'
import CustomModal from './Modal'
import { reqCreateQuiz } from '../services/fetchingService'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'
import { useShadowStyles } from '../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const QuizCreate = ({quizDetails, sendSuccess, isFormValid}) => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const [quizParents, setQuizParents] = useState([1])
    const [quizForm, setQuizForm] = useState({})
    const [showModal, setShowModal] = useState([])
    const [buttonIsLoading, setButtonIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const [touchedFields, setTouchedFields] = useState({})

    const [quizAnswersQuantity, setQuizAnswersQuantity] = useState({
        "parent_1": [1,2,3]
    })

    // Notification handlers
    
    const successQuizField = useMemo(() => NotifierComponent({
        title: "Kuizi u krijua me sukes!",
        description: "Sapo krijuat kursin tuaj me sukses! Ecurine mund ta percillni tek pjesa e navigimit; 'Kuizet e mia'",
        theme: colorScheme
    }), [colorScheme])
    const successQuiz = successQuizField.showNotification

    const failedQuizField = useMemo(() => NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Dicka shkoi gabim ne krijimin e kursit tuaj! Nese problemi vazhdon kontaktoni Panelin e ndihmes!",
        alertType: "warning",
        theme: colorScheme
    }), [colorScheme])
    const failedQuiz = failedQuizField.showNotification

    const validationErrorField = useMemo(() => NotifierComponent({
        title: "Plotesoni te gjitha fushat!",
        description: "Ju lutem plotesoni te gjitha fushat e kerkuara per te krijuar kuizin!",
        alertType: "error",
        theme: colorScheme
    }), [colorScheme])
    const validationError = validationErrorField.showNotification;

    // Validate the entire quiz form
    const validateQuizForm = useCallback(() => {
        const errors = {}
        let isValid = true

        // Validate each question
        quizParents.forEach(parent => {
            const questionKey = `quiz_parent_${parent}_question`
            const typeKey = `quiz_parent_${parent}_type`
            
            // Validate question text
            if (!quizForm[questionKey]?.trim()) {
                errors[questionKey] = "Titulli i pyetjes eshte i detyrueshem"
                isValid = false
            }

            // Validate question type
            if (!quizForm[typeKey]) {
                errors[typeKey] = "Zgjidhni llojin e pyetjes"
                isValid = false
            }

            // Validate answers
            const answerKeys = quizAnswersQuantity[`parent_${parent}`] || []
            let hasCorrectAnswer = false
            let hasEmptyAnswer = false

            answerKeys.forEach(answer => {
                const answerKey = `quiz_parent_${parent}_answers_${answer}`
                
                // Validate answer text
                if (!quizForm[answerKey]?.trim()) {
                    errors[answerKey] = "Pergjigjja eshte e detyrueshme"
                    hasEmptyAnswer = true
                    isValid = false
                }

                // Check for correct answers
                if (quizForm[`quiz_parent_${parent}_correct_${answer}`]) {
                    hasCorrectAnswer = true
                }
            })

            // Validate at least one correct answer for non-textual questions
            if (!hasCorrectAnswer && quizForm[typeKey] !== "textual" && !hasEmptyAnswer) {
                errors[`parent_${parent}_correct`] = "Zgjidhni te pakten nje pergjigjje te sakte"
                isValid = false
            }

            // For textual questions, validate at least one answer is marked
            if (quizForm[typeKey] === "textual" && !hasCorrectAnswer && !hasEmptyAnswer) {
                errors[`parent_${parent}_correct`] = "Duhet te shenoni te pakten nje pergjigjje"
                isValid = false
            }
        })

        setValidationErrors(errors)
        return isValid
    }, [quizParents, quizForm, quizAnswersQuantity])

    const createQuiz = useCallback(async () => {
        // First validate parent form
        if (!isFormValid) {
            validationError()
            return
        }

        // Then validate quiz questions
        if (!validateQuizForm()) {
            validationError()
            return
        }

        setButtonIsLoading(true)
        const userId = await currentUserID()
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
                resetForm()
            }
        } catch (error) {
            failedQuiz()
            console.error(error)
        } finally {
            setButtonIsLoading(false)
        }
    }, [])

    const resetForm = useCallback(() => {
        setQuizForm({})
        setQuizParents([1])
        setQuizAnswersQuantity({ "parent_1": [1,2,3] })
        setValidationErrors({})
        setTouchedFields({})
    }, [])

    const handleCorrectAnswers = useCallback((parent, answerOrder) => {
        const fieldKey = `quiz_parent_${parent}_correct_${answerOrder}`

        if (quizForm[`quiz_parent_${parent}_type`] === "single") {
            setQuizForm(prev => {
                const updated = { ...prev }
                // Remove all correct answers for this question first
                Object.keys(updated).forEach(key => {
                    if (key.startsWith(`quiz_parent_${parent}_correct_`)) {
                        delete updated[key]
                    }
                })
                // Add the new correct answer
                updated[fieldKey] = true
                return updated
            })
        } else {
            // Toggle for multiple/textual answers
            setQuizForm(prev => ({
                ...prev,
                [fieldKey]: !prev[fieldKey]
            }))
        }

        // Mark as touched
        setTouchedFields(prev => ({
            ...prev,
            [fieldKey]: true
        }))
    }, [])

    const setQuizType = useCallback((parent, type) => {
        setQuizForm(prev => ({
            ...prev,
            [`quiz_parent_${parent}_type`]: type
        }))
        
        // Mark as touched
        setTouchedFields(prev => ({
            ...prev,
            [`parent_${parent}_type`]: true
        }))
        
        setShowModal(prev => ({ ...prev, [parent]: false }))
    }, [])

    const handleValues = useCallback((index, field, value) => {
        const key = field === "question" 
            ? `quiz_parent_${index}_${field}`
            : `quiz_parent_${index[0]}_${field}_${index[1]}`
            
        setQuizForm(prev => ({
            ...prev,
            [key]: value
        }))
        
        // Mark as touched
        setTouchedFields(prev => ({
            ...prev,
            [key]: true
        }))
    }, [])

    const handleAnswerAdd = useCallback((parentId) => {
        setQuizAnswersQuantity(prev => ({
            ...prev,
            [`parent_${parentId}`]: [...prev[`parent_${parentId}`], prev[`parent_${parentId}`].length + 1]
        }))
    }, [])

    const handleQuestionAdd = useCallback(() => {
        const newParentIndex = quizParents.length + 1
        setQuizParents(prev => [...prev, newParentIndex])
        setQuizAnswersQuantity(prev => ({
            ...prev,
            [`parent_${newParentIndex}`]: [1,2,3]
        }))
    }, [])

    const removeAnswer = useCallback((parentIndex, answerIndex) => {
        setQuizAnswersQuantity(prev => {
            const updatedAnswers = prev[`parent_${parentIndex}`]
                .filter(item => item !== answerIndex)
                .map((_, idx) => idx + 1)

            return {
                ...prev,
                [`parent_${parentIndex}`]: updatedAnswers
            }
        })

        setQuizForm(prev => {
            const updated = { ...prev }
            
            // Remove the deleted answer
            delete updated[`quiz_parent_${parentIndex}_answers_${answerIndex}`]
            
            // Reindex remaining answers
            const parentKey = `quiz_parent_${parentIndex}_answers_`
            const remainingAnswers = Object.keys(updated)
                .filter(key => key.startsWith(parentKey))
                .sort((a, b) => parseInt(a.split('_').pop()) - parseInt(b.split('_').pop()))
                .map(key => updated[key])

            // Remove all old answers
            Object.keys(updated)
                .filter(key => key.startsWith(parentKey))
                .forEach(key => delete updated[key])

            // Add reindexed answers
            remainingAnswers.forEach((value, idx) => {
                updated[`${parentKey}${idx + 1}`] = value
            })

            return updated
        })
        
        // Remove validation errors for this answer
        setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[`quiz_parent_${parentIndex}_answers_${answerIndex}`]
            return newErrors
        })
    }, [])

    // Helper to check if field should show error
    const shouldShowError = (field) => {
        return touchedFields[field] && validationErrors[field]
    }

    // Helper to get correct answer label
    const getAnswerLabel = (parent, answer) => {
        const type = quizForm[`quiz_parent_${parent}_type`]
        const isCorrect = quizForm[`quiz_parent_${parent}_correct_${answer}`] === true

        if (type === "textual") {
            return isCorrect ? "Pergjigje e shtuar" : "Shtoni pergjigje"
        } else {
            return isCorrect ? "E sakte" : "E pasakte"
        }
    }

    return (
        <>
            <View className="">
                {quizParents.map((item, index) => (
                    <View key={`parent_${item}`} className="mt-4 border-b border-gray-200 dark:border-black-200 pb-5" style={shadowStyle}>
                        {/* Question Title */}
                        <View className="">
                            <FormField 
                                title={"Titulli i pyetjes " + item}
                                value={quizForm[`quiz_parent_${item}_question`] || ''}
                                placeholder={"Shkruani ketu titullin e pyetjes"}
                                otherStyles={"mb-4"}
                                handleChangeText={(value) => handleValues(item, 'question', value)}
                            />
                            {shouldShowError(`quiz_parent_${item}_question`) && (
                                <Text className="text-red-500 text-xs font-plight mt-1">
                                    {validationErrors[`quiz_parent_${item}_question`]}
                                </Text>
                            )}
                        </View>

                        {/* Question Type Selector */}
                        <View>
                            <TouchableOpacity 
                                onPress={() => setShowModal({ ...showModal, [item]: true })}
                                className={`w-auto max-w-[200px] ml-auto -mb-8 ${shouldShowError(`quiz_parent_${item}_type`) ? "border border-red-500 rounded-[5px]" : ""}`}
                            >
                                <Text className={`text-white p-4 py-2 border dark:border-0 border-white rounded-[5px] text-center font-pregular text-sm ${shouldShowError(`quiz_parent_${item}_type`) ? "bg-red-500/20" : "bg-secondary"}`}>
                                    {quizForm[`quiz_parent_${item}_type`] === "single" ? "Nje pergjigje te sakte" : 
                                     quizForm[`quiz_parent_${item}_type`] === "multiple" ? "Me shume se nje pergjigjje e sakte" : 
                                     quizForm[`quiz_parent_${item}_type`] === "textual" ? "Pergjigjje tekstuale (Lerini Fushat Zbrazet)" : 
                                     "Zgjidh llojin e pyetjes"}
                                </Text>
                            </TouchableOpacity>
                            {shouldShowError(`quiz_parent_${item}_type`) && (
                                <Text className="text-red-500 text-xs font-plight mt-1 text-right mr-2">
                                    {validationErrors[`quiz_parent_${item}_type`]}
                                </Text>
                            )}

                            {/* Question Type Modal */}
                            <CustomModal
                                visible={showModal[item] || false}
                                title={"Zgjedhni llojin e pyetjes"}
                                showButtons={false}
                            >
                                <View>
                                    <Text className="text-oBlack dark:text-white font-pregular text-sm text-center my-2">
                                        Nga zgjedhja e meposhtme ju vendosni se si do duket dhe do veprohet ne pyetesorin/kuizin tuaj.
                                    </Text>
                                </View>
                                <View className="gap-4 my-4">
                                    {["single", "multiple", "textual"].map(type => (
                                        <View key={type}>
                                            <TouchableOpacity 
                                                className="bg-secondary rounded-none dark:rounded-[5px] border dark:border-0 border-white p-4 py-2 flex-row items-center justify-center gap-2" 
                                                onPress={() => setQuizType(item, type)}
                                            >
                                                <Text className="text-white font-pregular text-sm">
                                                    {type === "single" ? "Zgjidhje e vetme" : 
                                                     type === "multiple" ? "Zgjidhje te shumta" : 
                                                     "Pergjigjje tekstuale"}
                                                </Text>
                                                <Image 
                                                    source={type === "single" ? icons.single : 
                                                           type === "multiple" ? icons.multiple : icons.edit}
                                                    className="h-6 w-6"
                                                    resizeMode='contain'
                                                    tintColor={"#fff"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                                <View className="pt-4 border-t border-white dark:border-black-200 w-full">
                                    <TouchableOpacity 
                                        className="bg-secondary rounded-none border dark:border-0 border-white dark:rounded-[5px] p-4 py-2 flex-row items-center justify-center" 
                                        onPress={() => setShowModal(prev => ({ ...prev, [item]: false }))}
                                    >
                                        <Text className="text-white font-pregular text-sm">Mendohuni me shume!</Text>
                                    </TouchableOpacity>
                                </View>
                            </CustomModal>
                        </View>

                        {/* Correct Answer Error */}
                        {shouldShowError(`parent_${item}_correct`) && (
                            <Text className="text-red-500 text-xs font-plight mt-1">
                                {validationErrors[`parent_${item}_correct`]}
                            </Text>
                        )}

                        {/* Answers */}
                        {quizAnswersQuantity[`parent_${item}`].map((answerItem) => (
                            <View className="relative" key={`parent_${item}_answer_${answerItem}`}>
                                <FormField
                                    title={"Pergjigjja e pyetjes " + answerItem}
                                    otherStyles={"mt-4"}
                                    value={quizForm[`quiz_parent_${item}_answers_${answerItem}`] || ''}
                                    placeholder={"Shkruani pergjigjjen e pyetjes"}
                                    handleChangeText={(value) => handleValues([item, answerItem], 'answers', value)}
                                />
                                {shouldShowError(`quiz_parent_${item}_answers_${answerItem}`) && (
                                    <Text className="text-red-500 text-xs font-plight mt-1">
                                        {validationErrors[`quiz_parent_${item}_answers_${answerItem}`]}
                                    </Text>
                                )}
                                
                                {/* Correct Answer Toggle */}
                                <TouchableOpacity
                                    className={`absolute -bottom-4 right-0 p-2 py-1 rounded-[5px] ${
                                        quizForm[`quiz_parent_${item}_correct_${answerItem}`] ? "bg-[#2b884a]" : "bg-[#5c0a0a]"
                                    }`}
                                    onPress={() => handleCorrectAnswers(item, answerItem)}
                                >
                                    <Text className="text-white font-psemibold text-sm">
                                        {getAnswerLabel(item, answerItem)}
                                    </Text>
                                </TouchableOpacity>
                                
                                {/* Remove Answer Button (only show if more than 3 answers) */}
                                {quizAnswersQuantity[`parent_${item}`].length > 3 && (
                                    <TouchableOpacity 
                                        onPress={() => removeAnswer(item, answerItem)}
                                        className="absolute right-4 bottom-6"
                                    >
                                        <Image 
                                            source={icons.close}
                                            className="h-4 w-4"
                                            tintColor={"#CDCDE0"}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {/* Add Question/Answer Buttons */}
                        <View className="flex-row justify-between flex-1 items-center mt-6">
                            {/* Add Question Button (only on last question) */}
                            {index === quizParents.length - 1 && (
                                <View className="flex-1 items-center justify-center">
                                    <TouchableOpacity onPress={handleQuestionAdd}>
                                        <Text className="text-white font-pregular border dark:border-0 border-gray-200 text-sm bg-oBlack rounded-[5px] p-6 py-2">
                                            Shto pyetje
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Add Answer Button */}
                            <View className="flex-1 items-center justify-center">
                                <TouchableOpacity onPress={() => handleAnswerAdd(item)}>
                                    <Text className="text-white font-pregular border dark:border-0 border-white text-sm bg-secondary p-6 py-2 rounded-[5px]">
                                        Shto pergjigjje
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Submit Button */}
            <View className="my-4">
                <CustomButton 
                    title={"Apliko per kuizin e paraqitur"}
                    handlePress={createQuiz}
                    isLoading={buttonIsLoading}
                    containerStyles={!isFormValid || Object.keys(validationErrors).length > 0 ? "opacity-70" : ""}
                    disabled={!isFormValid || Object.keys(validationErrors).length > 0}
                />
            </View>
        </>
    )
}

export default memo(QuizCreate)