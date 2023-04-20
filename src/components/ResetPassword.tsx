import React, { SyntheticEvent, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { BarLoader } from 'react-spinners';
import supabase from '../supabaseConfig';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

const inputClasses: string =
  'w-full h-10 pl-3 text-xl rounded border-gray-400 border-2 bg-[#25282c] my-2 brightness-75';

const ResetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
      } else {
        navigate('/');
        //   navigate('/reset/newpassword');
      }
    });
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const updatePassword = async () => {
      if (password === confirmPassword) {
        const { data, error } = await supabase.auth.updateUser({ password });

        if (error) {
          setResetError(error.message);
        } else {
          setResetError('');
          setResetSuccess(true);
        }
      } else {
        setResetError("Passwords don't match");
      }
    };
    updatePassword();
  };

  if (resetSuccess) {
    return (
      <h1 className="text-center text-3xl text-gray-300">
        Password successfully reset
      </h1>
    );
  }

  return (
    <>
      <div className="mt-24 flex flex-col items-center text-emerald-600">
        <h1 className="pb-8 text-3xl font-bold">Create New Password</h1>
        <h2 className="pb-8 font-bold text-red-300">{resetError}</h2>
        <form className="w-96" id="form1" onSubmit={handleSubmit}>
          <div>
            <label className="block ">Password</label>
            <input
              type="password"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block ">Confirm Password</label>
            <input
              type="password"
              className={inputClasses}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            form="form1"
            value="Submit"
            className="my-6 w-full rounded bg-emerald-600 py-2 text-lg font-bold tracking-wide text-slate-100 transition-all duration-100 hover:bg-emerald-800"
          >
            {resetLoading ? <BarLoader /> : <p>Reset</p>}
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
