import React, { useState, useEffect, SyntheticEvent } from 'react';
import axios from 'axios';
import supabase from '../supabaseConfig';

const inputClasses: string =
  'w-full h-10 pl-3 text-xl rounded border-gray-400 border-2 bg-[#25282c] my-2 brightness-75';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [takenUsername, setTakenUsername] = useState<boolean>(false);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [validUsername, setValidUsername] = useState<boolean>(false);

  const handleUsernameBlur = async (username: string): Promise<boolean> => {
    if (username) {
      setCheckingUsername(true);

      const { data, error } = await supabase
        .from('get_usernames')
        .select()
        .eq('username', username);

      setCheckingUsername(false);
      console.log('username data:', data, 'error:', error);

      if (data) {
        if (data.length > 0) setTakenUsername(true);
        else setTakenUsername(false);
      }
      return data ? data.length > 0 : false;
    }
    return false;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const signup = async () => {
      if (username.length >= 6 && !takenUsername) {
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
          console.log('data', data.user.id);
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({ username, auth_uuid: data.user.id })
            .select();

          console.log('newUser', newUser);
          console.log('new user error:', error);
          //   setUsername('');
          //   setEmail('');
          //   setPassword('');
        }

        if (error) {
          console.log('error', error);
        }
      } else {
        console.log('usernames a no go');
      }
    };

    signup();
  };

  useEffect(() => {
    if (username.length < 6) {
      setValidUsername(false);
    } else {
      setValidUsername(true);
    }
  }, [username]);

  return (
    <>
      <section className="flex">
        <div className="mt-24 flex w-full flex-col items-center text-slate-300">
          <h2 className="pb-8 text-3xl font-bold">Sign Up</h2>
          <h1 className="underline">{checkingUsername ? 'LOADING' : ''}</h1>
          <h1 className="underline">
            {takenUsername ? 'Username is taken' : ''}
          </h1>
          <form className="w-96" id="form1" onSubmit={handleSubmit}>
            <div>
              <label className="block ">Username</label>
              <input
                className={inputClasses}
                type="email"
                value={username}
                onBlur={() => handleUsernameBlur(username)}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block ">Email</label>
              <input
                type="text"
                value={email}
                className={inputClasses}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block ">Password</label>
              <input
                type="password"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              form="form1"
              value="Submit"
              className=" my-6 w-full rounded bg-emerald-600 py-2 text-lg font-bold tracking-wide text-slate-100 transition-all duration-100 hover:bg-emerald-800"
            >
              Create Account
            </button>
            {/* <div className="relative my-2 w-full border-b-2 border-gray-400">
              <p className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#25282c] px-2 text-gray-400">
                OR
              </p>
            </div>
            <button
              type="button"
              onClick={() => {}}
              className=" my-6 w-full rounded bg-gray-300 py-2 text-lg font-bold tracking-wide text-black transition-all duration-100 hover:bg-emerald-800"
            >
              Sign up with Google
            </button> */}
          </form>
        </div>
        {/* <div className="flex w-full flex-col items-center justify-center gap-10 text-2xl">
          <div>
            <ul className="flex flex-col gap-10">
              <li>Track Progress Over Time</li>
              <li>Appear on leaderboards</li>
              <li>View past scores</li>
              <li></li>
            </ul>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default Signup;
