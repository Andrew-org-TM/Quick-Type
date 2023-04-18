import { Routes, Route } from 'react-router-dom';
import './index.css';
import InputForm from './components/InputForm';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import Results from './components/Results';
import NewTestButton from './components/NewTestButton';
import Leaderboards from './components/Leaderboards';

function App() {
  return (
    <div className="mx-auto max-w-7xl text-emerald-600">
      <NavBar />
      <Routes>
        <Route path="signup" element={<SignupForm />} />
        <Route path="/" element={<InputForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
      </Routes>
    </div>
  );
}

export default App;
