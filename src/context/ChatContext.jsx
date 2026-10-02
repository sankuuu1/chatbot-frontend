import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [activeCategory, setActiveCategory] = useState('general');
    const [language, setLanguageState] = useState(() => localStorage.getItem('bandhu_lang') || 'mr');
    const [selectedLangLabel, setSelectedLangLabel] = useState(() => {
        const lang = localStorage.getItem('bandhu_lang') || 'mr';
        return lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'English' : 'मराठी';
    });

    const setLanguage = (langCode) => {
        let code = 'mr';
        let label = 'मराठी';
        if (langCode === 'English' || langCode === 'en') {
            code = 'en';
            label = 'English';
        } else if (langCode === 'हिंदी' || langCode === 'hi') {
            code = 'hi';
            label = 'हिंदी';
        }
        setLanguageState(code);
        setSelectedLangLabel(label);
        localStorage.setItem('bandhu_lang', code);
    };

    const t = translations[language] || translations.mr;

    const addMessage = (msg) => {
        setHistory(prev => [...prev, msg]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <ChatContext.Provider value={{
            history,
            setHistory,
            addMessage,
            clearHistory,
            activeCategory,
            setActiveCategory,
            language,
            selectedLangLabel,
            setLanguage,
            t
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
