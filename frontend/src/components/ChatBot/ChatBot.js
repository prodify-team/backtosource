import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';

const ChatContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  height: 70vh;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px 15px 0 0;
  text-align: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? '#667eea' : '#f1f3f4'};
  color: ${props => props.isUser ? 'white' : '#333'};
  font-size: 16px;
  line-height: 1.4;
`;

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const SpeakButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 8px;
  font-size: 12px;
`;

const QuickSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
`;

const SuggestionChip = styled.button`
  background: #f1f3f4;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #e8eaed;
  }
`;

const ChatBot = ({ user, language }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { speak, cancel } = useSpeechSynthesis();

  const texts = {
    hindi: {
      title: 'बैक टू सोर्स सहायक',
      placeholder: 'अपना संदेश यहाँ लिखें...',
      welcome: `नमस्ते ${user.name}! मैं आपका सहायक हूँ। आप मुझसे खाना बनाने, काम के बारे में, या कोई भी सवाल पूछ सकते हैं।`,
      suggestions: ['दाल मखनी कैसे बनाएं?', 'आज क्या काम करना है?', 'खाना सुरक्षित कैसे रखें?', 'customer service tips']
    },
    english: {
      title: 'Back to Source Assistant',
      placeholder: 'Type your message here...',
      welcome: `Hello ${user.name}! I'm your assistant. You can ask me about cooking, work tasks, or any questions.`,
      suggestions: ['How to make dal makhani?', 'What tasks for today?', 'Food safety tips', 'Customer service help']
    }
  };

  useEffect(() => {
    setMessages([{
      text: texts[language].welcome,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [language, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chat/message', {
        message: inputValue,
        userId: user._id,
        userRole: user.role,
        preferredLanguage: language
      });

      const aiMessage = {
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: language === 'hindi' ? 'माफ करें, कुछ गलती हुई है। क्या server चल रहा है?' : 'Sorry, something went wrong. Is the server running?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const speakMessage = (text) => {
    cancel();
    speak({ 
      text, 
      voice: language === 'hindi' ? 
        window.speechSynthesis.getVoices().find(voice => voice.lang.includes('hi')) : 
        null 
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h2>{texts[language].title}</h2>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Message isUser={message.isUser}>
              {message.text}
            </Message>
            {!message.isUser && (
              <SpeakButton onClick={() => speakMessage(message.text)}>
                🔊
              </SpeakButton>
            )}
          </div>
        ))}
        {isLoading && (
          <Message isUser={false}>
            {language === 'hindi' ? 'टाइप कर रहा हूँ...' : 'Typing...'}
          </Message>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <QuickSuggestions>
        {texts[language].suggestions.map((suggestion, index) => (
          <SuggestionChip 
            key={index} 
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </SuggestionChip>
        ))}
      </QuickSuggestions>

      <InputContainer>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={texts[language].placeholder}
        />
        <SendButton onClick={sendMessage}>
          ➤
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBot;