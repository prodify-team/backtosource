import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatBot from './components/ChatBot/ChatBot';
import SimpleLogin from './components/Auth/SimpleLogin';
import LanguageToggle from './components/LanguageToggle/LanguageToggle';
import './App.css';

const AppContainer = styled.div`
  font-family: 'Noto Sans Devanagari', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState('hindi');

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    if (!user) {
        return (
            <AppContainer>
                <MainContent>
                    <SimpleLogin onLogin={handleLogin} language={language} />
                    <LanguageToggle language={language} setLanguage={setLanguage} />
                </MainContent>
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            <MainContent>
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <ChatBot user={user} language={language} />
            </MainContent>
        </AppContainer>
    );
}

export default App;