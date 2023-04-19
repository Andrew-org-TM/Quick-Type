import React, { useState, SyntheticEvent, useEffect } from 'react';
import supabase from '../supabaseConfig';
import ClipLoader from 'react-spinners/ClipLoader';
import { BarLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const SendRecovery = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>('');
  const [resetSent, setResetSent] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://quick-type.netlify.app/reset/newpassword',
    });

    if (data && !error) {
      setResetSent(true);
    }
    if (error) {
      setResetError(error.message);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/reset/newpassword');
      } else {
        // navigate('/');
      }
    });
  }, []);

  if (resetSent) {
    return (
      <h1 className="text-center text-3xl text-gray-300">
        Password reset link sent
      </h1>
    );
  }

  return (
    <>
      <div className="mt-24 flex flex-col items-center text-gray-300">
        <h1 className="pb-8 text-3xl font-bold">Reset Password</h1>
        <h2 className="pb-8 font-bold text-red-300">{resetError}</h2>
        <form className="w-96" id="form1" onSubmit={handleSubmit}>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-2 h-10 w-full rounded border-2 border-gray-400 bg-[#25282c] pl-3 text-xl brightness-75"
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

export default SendRecovery;
