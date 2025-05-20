import { View, Text, RefreshControl, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import DefaultHeader from "../../../components/DefaultHeader"
import { Platform } from 'react-native'
import { icons } from '../../../constants'
import SupportForm from '../../../components/SupportForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReportForm from '../../../components/ReportForm'

const Support = () => {
    const [refreshKey, setRefreshKey] = useState(0)
    const [sectionEnabled, setSectionEnabled] = useState({
        supportSection: true,
        reportSection: false,
        chatSupportSection: false,
    })
    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = () => {
        setIsRefreshing(true)
        setRefreshKey(prev => prev + 1)
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000);
    }

    const handleSectionPress = (section) => {
        setSectionEnabled({
            supportSection: section === "supportSection",
            reportSection: section === "reportSection",
            chatSupportSection: section === "chatSupportSection"
        })
    }

    const handleSuccessForm = () => {
        setRefreshKey(prev => prev + 1)
    }

  return (
    <KeyboardAwareScrollView
        key={refreshKey}
        className="h-full bg-primary px-4"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
        <DefaultHeader 
            headerTitle={"Mbeshtetja teknike"}
            bottomSubtitle={"Nga navigimi mes opsioneve te dhena me poshte mund te identifikoni/rregulloni problemin, te krijoni ankesa/raportime etj. tesksti tofix"}
            showBorderBottom={true}
            topSubtitle={"Identifikoni apo Raportoni problemin"}
        />
        <View className="border border-black-200 flex-1 flex-row items-center justify-between" style={styles.box}>
            <TouchableOpacity onPress={() => handleSectionPress('supportSection')} className={`border-r flex-row gap-1 flex-1 justify-center items-center border-black-200 py-2 ${sectionEnabled.supportSection ? "bg-oBlack" : "bg-primary"}`}>
                <Text className="font-plight text-white text-sm">Support</Text>
                <Image 
                    source={icons.customerSupport}
                    className="size-5"
                    style={{tintColor: sectionEnabled.supportSection ? "#ff9c01" : "#fff"}}
                    resizeMode='contain'
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSectionPress('reportSection')} className={`border-r flex-row gap-1 flex-1 justify-center items-center border-black-200 py-2 ${sectionEnabled.reportSection ? "bg-oBlack" : "bg-primary"}`}>
                <Text className="font-plight text-white text-sm">Raportoni</Text>
                <Image 
                    source={icons.report}
                    className="size-5"
                    style={{tintColor: sectionEnabled.reportSection ? "#ff9c01" : "#fff"}}
                    resizeMode='contain'
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSectionPress('chatSupportSection')} className={`flex-1 flex-row gap-1 justify-center items-center border-black-200 py-2 ${sectionEnabled.chatSupportSection ? "bg-oBlack" : "bg-primary"}`}>
                <Text className="font-plight text-white text-sm">Chat Support</Text>
                <Image 
                    source={icons.chat}
                    className="size-5"
                    style={{tintColor: sectionEnabled.chatSupportSection ? "#ff9c01" : "#fff"}}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>

        <View className="my-4">
            {sectionEnabled.supportSection && <SupportForm onSuccess={handleSuccessForm}/>}
            {sectionEnabled.reportSection && <ReportForm onSuccess={handleSuccessForm}/>}
        </View>
    </KeyboardAwareScrollView>
  )
}

export default Support

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