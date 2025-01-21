import React from 'react';
import Dashboard from './dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './user_auth/login';
import SignupPage from './user_auth/signup';

const App = () => {


  return (
    <div>
      <BrowserRouter>
        {/* Navbar is shown on every page */}

        <Routes>
          {/* Main and Para components */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
