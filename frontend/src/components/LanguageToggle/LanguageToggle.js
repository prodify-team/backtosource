import React from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Noto Sans Devanagari', Arial, sans-serif;
  font-weight: 600;
  
  &:first-child {
    border-radius: 25px 0 0 25px;
    border-right: 1px solid #667eea;
  }
  
  &:last-child {
    border-radius: 0 25px 25px 0;
    border-left: 1px solid #667eea;
  }
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f8f9ff'};
  }
`;

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <ToggleContainer>
      <ToggleButton 
        active={language === 'hindi'} 
        onClick={() => setLanguage('hindi')}
      >
        हिंदी
      </ToggleButton>
      <ToggleButton 
        active={language === 'english'} 
        onClick={() => setLanguage('english')}
      >
        English
      </ToggleButton>
    </ToggleContainer>
  );
};

export default LanguageToggle;