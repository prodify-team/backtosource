import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: #667eea;
  margin-bottom: 30px;
  font-size: 28px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Noto Sans Devanagari', Arial, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Noto Sans Devanagari', Arial, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const SimpleLogin = ({ onLogin, language }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('chef');

  const texts = {
    hindi: {
      title: 'बैक टू सोर्स में आपका स्वागत है',
      namePlaceholder: 'अपना नाम लिखें',
      roleLabel: 'आपका काम',
      roles: {
        owner: 'मालिक',
        manager: 'मैनेजर',
        chef: 'रसोइया',
        waiter: 'वेटर',
        cleaner: 'सफाई कर्मचारी'
      },
      loginButton: 'शुरू करें'
    },
    english: {
      title: 'Welcome to Back to Source',
      namePlaceholder: 'Enter your name',
      roleLabel: 'Your role',
      roles: {
        owner: 'Owner',
        manager: 'Manager',
        chef: 'Chef',
        waiter: 'Waiter',
        cleaner: 'Cleaner'
      },
      loginButton: 'Start'
    }
  };

  const handleLogin = () => {
    if (!name.trim()) return;
    
    const userData = {
      _id: Date.now().toString(), // Simple ID for demo
      name: name.trim(),
      role,
      restaurantId: {
        name: 'Back to Source - Demo',
        _id: 'demo-restaurant'
      },
      preferredLanguage: language
    };
    
    onLogin(userData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <LoginContainer>
      <Title>{texts[language].title}</Title>
      
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={texts[language].namePlaceholder}
      />
      
      <Select value={role} onChange={(e) => setRole(e.target.value)}>
        {Object.entries(texts[language].roles).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </Select>
      
      <LoginButton onClick={handleLogin}>
        {texts[language].loginButton}
      </LoginButton>
    </LoginContainer>
  );
};

export default SimpleLogin;