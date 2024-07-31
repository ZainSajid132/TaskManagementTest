import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import SignIn from './pages/UsersignIn';
import Dashboard from '../src/Dashboard/dashboard';
import enMessages from '../src/Translator/en.json';

function App() {
  const locale = 'en'; // You can dynamically set this based on user preference
  const messages = enMessages;

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/sign-in" />} />
        </Routes>
      </Router>
    </IntlProvider>
  );
}

export default App;
