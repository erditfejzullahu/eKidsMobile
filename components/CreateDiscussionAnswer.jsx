import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor'
import { createDiscussionAnswerAsync } from '../services/fetchingService'
import Placeholder from '@tiptap/extension-placeholder'
import { Platform } from 'react-native'
import { currentUserID } from '../services/authService'
import NotifierComponent from './NotifierComponent'
import { useColorScheme } from 'nativewind'

const CreateDiscussionAnswer = forwardRef(({id, sentSuccessResponse}, ref) => {
    const {colorScheme} = useColorScheme();
    const [commentSendLoading, setCommentSendLoading] = useState(false)
    const [answerContent, setAnswerContent] = useState("")

    useImperativeHandle(ref, () => ({
        blurEditor: () => {
            if (editor && typeof editor.blur === 'function') {
                editor.blur();
            }
        }
    }))

    const editor = useEditorBridge({
        bridgeExtensions: [
            ...TenTapStartKit,
            // CoreBridge.configureCSS(`
            //     * {
            //         font-family: 'Arial';
            //     }
            // `),
            Placeholder.configure({
                placeholder: "Mbusheni pyetjen/diskutimin tuaj ketu"
            }),
        ],
        // autofocus: true,
        // avoidIosKeyboard: true,
        // dynamicHeight: true
    });
    // editor.setPlaceholder("test")
    
    const editorContent = useEditorContent(editor, {type: "html"});

    const {showNotification: underThreeChars} = NotifierComponent({
        title: "Gabim",
        description: "Nuk pranohen komente/pergjigjje me me pak se 3 karaktere",
        alertType: "warning",
        theme: colorScheme
    })

    const {showNotification: successComment} = NotifierComponent({
        title: "Sukses",
        description: "Sapo komentuat/pergjigjjet ne diskutim",
        theme: colorScheme
    })

    const {showNotification: unSuccessComment} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim, ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        theme: colorScheme
    })

    const createAnswer = async () => {
        if(answerContent.length < 7){
            underThreeChars()
            return;
        }
        setCommentSendLoading(true)
        const userId = await currentUserID();
        
        const payload = {
            discussionId: id,
            discussionAnswerContent: answerContent,
            discussionFile: null,
            userId,
            parentId: null
        }
        console.log(payload);
        const response = await createDiscussionAnswerAsync(payload);
        
        if(response){
        successComment();
        // setDiscussionAnswerData((prevData) => [response, ...prevData]);
        sentSuccessResponse(response)
        if(editor){
            editor.blur();
            editor.setContent("")
        }
        setAnswerContent("");
        }else{
        unSuccessComment();
        }
        setCommentSendLoading(false)
    }

    useEffect(() => {
      editorContent && setAnswerContent(editorContent)
    }, [editorContent])
    
  return (
    <View className="border-t flex-1 border-b min-h-full  bg-primary border-black-200 overflow-hidden p-2 px-4">
        <Text className="text-white pb-1 font-psemibold text-sm">Pergjigjja/Komenti juaj</Text>
        <Text className="text-gray-400 text-xs font-plight pb-2">Ne klikim te fushes mund te manovroni me tekstin me ane te shiritit te paraqitur poshte fushes se shkrimit.</Text>
        <View>
        <RichText onResponderGrant={() => console.log("erditbaba")} editor={editor} style={[{backgroundColor: "#13131a", height: 200, borderRadius: 6, paddingLeft: 10, paddingRight: 10, maxHeight: "200", borderWidth: 1, borderColor: "#232533"}, styles.box]}/>
        {/* <KeyboardAvoidingView style={{position: "absolute", width: "100%", bottom: 0}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
        <View className="rounded-md overflow-hidden">
            <Toolbar editor={editor} />
        </View>
        {/* </KeyboardAvoidingView> */}
        </View>
        <TouchableOpacity className={`bg-secondary py-2 px-4 self-start ml-auto rounded-md my-2 ${commentSendLoading ? "opacity-50" : ""}`} onPress={createAnswer} disabled={commentSendLoading}>
        <Text className="text-white font-psemibold text-sm">Pergjigju/Komento</Text>
        </TouchableOpacity>
    </View>
  )
})

export default CreateDiscussionAnswer

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