import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { AuthProvider } from './context/AuthContext';
import questConfig from './config/questConfig';
import Layout from './components/Layout/Layout';
import Hero from './components/Home/Hero';
import LoginPage from './components/Auth/LoginPage';
import OnboardingPage from './components/Auth/OnboardingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import './App.css';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#14b8a6',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;