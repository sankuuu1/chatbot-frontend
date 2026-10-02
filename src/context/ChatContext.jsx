import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [activeCategory, setActiveCategory] = useState('general');
    const [userProfile, setUserProfile] = useState({
        name: 'संतोष जाधव',
        phone: '+919876543210',
    });

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
            userProfile,
            setUserProfile
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
