import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback,StyleSheet, Platform } from 'react-native'
import React, { useEffect } from 'react'

const CustomModal = ({visible, onClose, onProcced, title, children, proceedButtonText, cancelButtonText, showButtons = true, autoCloseDuration = null, onlyProceedButton = false, onlyCancelButton = false}) => {

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
            <View style={styles.box} className="bg-primary p-4 rounded-[5px] border border-black-200 w-[80%] items-center">
                <View className="w-full items-center">
                    <Text className="font-pbold text-xl text-white mb-2 border-b border-secondary">{title}</Text>
                </View>
                <View className="w-full items-center">
                    {children}
                </View>
                {showButtons && <View className={`flex-row-reverse ${onlyProceedButton || onlyCancelButton ? "justify-center" : "justify-between"} mt-4 w-full flex-wrap gap-2`}>
                    {!onlyCancelButton && <View>
                        <TouchableOpacity 
                            onPress={onProcced}
                            className="bg-secondary p-1.5 px-2.5 rounded-[5px]"
                        >
                            <Text className="text-white text-sm font-pregular">{proceedButtonText}</Text>
                        </TouchableOpacity>
                    </View>}
                    {!onlyProceedButton && <View>
                        <TouchableOpacity 
                            onPress={onClose}
                            className=" bg-secondary p-1.5 px-2.5 rounded-[5px]"
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