import { Routes, Route } from 'react-router-dom';
import './index.css';
import InputForm from './components/InputForm';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import Results from './components/Results';
import NewTestButton from './components/NewTestButton';
import Leaderboards from './components/Leaderboards';
import Account from './components/Account';
import ResetPassword from './components/ResetPassword';
import SendRecovery from './components/SendRecovery';
import { useEffect, useState } from 'react';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen bg-[#25282C]">
      <div className="mx-auto max-w-7xl text-emerald-600">
        <NavBar />
        <Routes>
          <Route path="signup" element={<SignupForm />} />
          <Route path="/" element={<InputForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/account" element={<Account />} />
          <Route path="/reset" element={<SendRecovery />} />
          <Route path="/reset/newpassword" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
