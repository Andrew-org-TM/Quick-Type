import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ClipLoader from 'react-spinners/ClipLoader';
import { BarLoader } from 'react-spinners';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabaseConfig';
import { selectAuthUser } from '../store/slices/AuthSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    if (user.id) {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      setEmail('');
      setPassword('');
    }

    if (error) {
      console.log(error.message);
      setLoginError(error.message);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) console.log('Signout Error:', error);
  };

  return (
    <div className="mt-24 flex flex-col items-center text-gray-300">
      <h1 className="pb-8 text-3xl font-bold">Login</h1>
      {loginError && <h3 className="text-red-300">{loginError}</h3>}
      <form className="w-96" id="form1" onSubmit={handleSubmit}>
        <div>
          <label className="block">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2 h-10 w-full rounded border-2 border-gray-400 bg-[#25282c] pl-3 text-xl brightness-75"
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2 h-10 w-full rounded border-2 border-gray-400 bg-[#25282c] pl-3 text-xl brightness-75"
          />
        </div>
        <button
          type="submit"
          form="form1"
          value="Submit"
          className="my-6 w-full rounded bg-emerald-600 py-2 text-lg font-bold tracking-wide text-slate-100 transition-all duration-100 hover:bg-emerald-800"
        >
          {loginLoading ? <BarLoader /> : <p>Submit</p>}
        </button>
      </form>
      <Link to={'/signup'}>
        <p className="text-center">
          Don't have an account?{' '}
          <span className="text-emerald-400 underline">sign up</span>
        </p>
      </Link>
      {/* <button className="border-2 p-2" onClick={handleLogout}>
        Logout
      </button> */}
    </div>
  );
};

export default LoginForm;
