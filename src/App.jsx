import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginFlow from './pages/LoginFlow';
import HomeDashboard from './pages/HomeDashboard';
import ChatInterface from './pages/ChatInterface';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginFlow step="login" />} />
          <Route path="/otp" element={<LoginFlow step="otp" />} />
          <Route path="/success" element={<LoginFlow step="success" />} />
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/chat" element={<ChatInterface />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
