import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback,StyleSheet, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { useShadowStyles } from '../hooks/useShadowStyles'
const CustomModal = ({visible, onClose, onProcced, title, children, proceedButtonText, cancelButtonText, showButtons = true, autoCloseDuration = null, onlyProceedButton = false, onlyCancelButton = false}) => {
    const {shadowStyle} = useShadowStyles();
    useEffect(() => {
      if(visible && autoCloseDuration){
        const timeout = setTimeout(() => {
            onClose();
        }, autoCloseDuration);
        return () => clearTimeout(timeout);
      }
    }, [visible, autoCloseDuration, onClose])
    

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
            <View style={shadowStyle} className="bg-primary-light dark:bg-primary p-4 dark:rounded-[5px] border border-gray-200 dark:border-black-200 w-[80%] items-center">
                {title && <View className="w-full items-center">
                    <Text className="font-pbold text-xl text-oBlack dark:text-white mb-2 border-b border-secondary">{title}</Text>
                </View>}
                <View className="w-full items-center">
                    {children}
                </View>
                {showButtons && <View className={`flex-row-reverse ${onlyProceedButton || onlyCancelButton ? "justify-center" : "justify-between"} mt-4 w-full flex-wrap gap-2`}>
                    {!onlyCancelButton && <View>
                        <TouchableOpacity 
                            onPress={onProcced}
                            className="bg-secondary p-1.5 px-2.5 border border-gray-200 dark:border-0 dark:rounded-[5px]"
                        >
                            <Text className="text-white text-sm font-pregular">{proceedButtonText}</Text>
                        </TouchableOpacity>
                    </View>}
                    {!onlyProceedButton && <View>
                        <TouchableOpacity 
                            onPress={onClose}
                            className=" bg-secondary p-1.5 px-2.5 border border-white dark:border-0 dark:rounded-[5px]"
                        >
                            <Text className="text-white text-sm font-pregular">{cancelButtonText}</Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>
        </View>
    </Modal>
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
export default CustomModal