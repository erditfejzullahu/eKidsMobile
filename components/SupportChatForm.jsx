import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, PlatformColor } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import FormField from './FormField';

export default function SupportChatForm() {
  const [messages, setMessages] = useState([
    { id: uuid.v4(), text: "Hi there! Ask me anything about your app.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { id: uuid.v4(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: uuid.v4(),
        text: `You said: "${userMessage.text}"`,
        sender: "bot"
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessages = () =>
    messages.map((item) => (
      <View
        key={item.id}
        className={`p-3 m-2 rounded-xl max-w-[80%] ${
          item.sender === 'user' ? 'bg-secondary self-end border border-white' : 'bg-oBlack self-start border border-black-200'
        }`}
      >
        <Text className={item.sender === 'user' ? 'text-white font-pmedium text-sm' : 'text-white font-pmedium text-sm'}>
          {item.text}
        </Text>
      </View>
    ));

  return (
    <View className="bg-oBlack rounded-md border border-black-200" style={styles.box}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 10 }}
          className="flex-1 max-h-[350px]"
        >
          {renderMessages()}
        </ScrollView>

        <View className="flex-row items-center justify-center p-3 border-t border-black-200">
          <FormField 
            value={input}
            handleChangeText={(e) => setInput(e)}
            placeholder={"Shkruani pyetjen/mesazhin"}
            otherStyles={"flex-1"}
            multiline
            inputParentStyle={"!h-16"}
          />
          <TouchableOpacity
            className="ml-2 bg-secondary px-4 py-3 mt-1.5 rounded-xl h-16 items-center justify-center"
            onPress={sendMessage}
          >
            <Text className="text-white font-psemibold">Send</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
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
  });