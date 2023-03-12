import { Routes, Route } from 'react-router-dom';
import './index.css';
import InputForm from './components/InputForm';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    // <div className='text-white'>
    <Routes>
      <Route path="signup" element={<SignupForm />} />
      <Route path="/" element={<InputForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
    // </div>
  );
}

export default App;
