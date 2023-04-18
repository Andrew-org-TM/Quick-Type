import React, { useState, useEffect, SyntheticEvent } from 'react';
import axios from 'axios';
import supabase from '../supabaseConfig';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // await axios.post('http://localhost:3030/api/signup', {
    //   username,
    //   email,
    //   password,
    // });

    const signup = async () => {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (data.user) {
        console.log('data', data);
        setUsername('');
        setEmail('');
        setPassword('');
      }

      if (error) {
        console.log('error', error);
      }
    };

    signup();
  };
  return (
    <div className="flex flex-col items-center">
      <form className="text-black" id="form1" onSubmit={handleSubmit}>
        <label className="text-white block">USERNAME</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="text-white block"> EMAIL</label>
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
        className="text-white my-6 border-2 p-2"
      >
        {' '}
        Submit{' '}
      </button>
    </div>
  );
};

export default Signup;
