import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseConfig';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      console.log('signed in data:', data);

      setEmail('');
      setPassword('');
    }

    if (error) console.log(error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) console.log('Signout Error:', error);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white block py-5">LOGIN</h1>
      <form className="text-black" id="form1" onSubmit={handleSubmit}>
        <label className="text-white block">EMAIL</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-white block"> PASSWORD</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button
        type="submit"
        form="form1"
        value="Submit"
        className="text-white border-2 p-3 my-3"
      >
        Submit
      </button>
      <button className="border-2 p-2" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default LoginForm;
