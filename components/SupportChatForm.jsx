import { useState, useRef, useEffect, memo } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import uuid from 'react-native-uuid';
import FormField from './FormField';
import { useShadowStyles } from '../hooks/useShadowStyles';
import { icons } from '../constants';

//TODO: create chat system

const SupportChatForm = () => {
  const {shadowStyle} = useShadowStyles()
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
    return <View className="bg-oBlack-light items-center justify-center dark:bg-oBlack border border-gray-200 dark:border-black-200 p-4" style={shadowStyle}>
      <Image 
        source={icons.upcoming}
        className="size-10"
        resizeMode='contain'
        tintColor={"#FF9C01"}
      />
      <Text className="text-lg text-oBlack dark:text-white">Se shpejti</Text>
    </View>
  return (
    <View className="bg-oBlack rounded-md border border-black-200" style={shadowStyle}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 10 }}
          className="flex-1 max-h-[350px] min-h-[300px]"
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
            <Text className="text-white font-psemibold">Dergo</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

export default memo(SupportChatForm)