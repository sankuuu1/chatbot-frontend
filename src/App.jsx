import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginFlow from './pages/LoginFlow';
import HomeDashboard from './pages/HomeDashboard';
import ChatInterface from './pages/ChatInterface';
import SettingsPage from './pages/SettingsPage';
import DailyInfoPage from './pages/DailyInfoPage';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import AnalyticsTracker from './components/AnalyticsTracker';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="app-container">
          <Router>
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginFlow step="login" />} />
              <Route path="/otp" element={<LoginFlow step="otp" />} />
              <Route path="/success" element={<LoginFlow step="success" />} />
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/info" element={<DailyInfoPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Router>
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
