import React, {
  useState,
  useEffect,
  SyntheticEvent,
  CSSProperties,
} from 'react';
import supabase from '../supabaseConfig';
import ClipLoader from 'react-spinners/ClipLoader';
import { BarLoader } from 'react-spinners';
import circleCheck from '../assets/check-circle.svg';
import circleX from '../assets/x-circle.svg';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/AuthSlice';

const inputClasses: string =
  'w-full h-10 pl-3 text-xl rounded border-gray-400 border-2 bg-[#25282c] my-2 brightness-75';
const override: CSSProperties = {
  top: '-30px',
  right: '-400px',
  zIndex: '1',
};

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [takenUsername, setTakenUsername] = useState<boolean>(false);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>('');
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<string>('');

  const user = useAppSelector(selectAuthUser);

  const handleUsernameBlur = async (username: string): Promise<void> => {
    if (username) {
      if (username.length < 6) {
        setUsernameError('Username must be at least 6 characters');
        return;
      }

      setCheckingUsername(true);
      setValidUsername(false);

      const { data, error } = await supabase
        .from('get_usernames')
        .select()
        .eq('username', username);

      setCheckingUsername(false);

      if (data) {
        if (data.length > 0) {
          // setTakenUsername(true);
          setUsernameError('Username already taken');
        } else {
          setValidUsername(true);
          setUsernameError('');
          // setTakenUsername(false);
        }
      }
    } else {
      setUsernameError('Must have username');
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSignupError('Passwords must match');
      return;
    }
    const signup = async () => {
      const { data, error } = await supabase
        .from('user_emails')
        .select()
        .eq('email', email);

      if (data && data.length > 0) {
        setSignupError('Email already in use');
        return;
      }

      if (username.length >= 6 && !usernameError) {
        setSignupError('');
        setSignupLoading(true);
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
          try {
            await supabase.from('users').insert({
              auth_uuid: data.user.id,
              username,
              email,
            });
          } catch (e) {
            console.log(e);
          }

          setUsername('');
          setEmail('');
          setPassword('');

          setUsernameError('');
          setSignupError('');

          navigate('/newaccount');
        }

        if (error) {
          console.log('error', error);
          setSignupError(error.message);
        }

        setSignupLoading(false);
      } else {
        setSignupError('Missing username');
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

  useEffect(() => {
    if (user.id) {
      navigate('/');
    }
  }, [user]);

  return (
    <>
      <section className="flex">
        <div className="mt-10 flex w-full flex-col items-center text-slate-300">
          <h2 className="pb-8 text-3xl font-bold">Sign Up</h2>
          <h3 className="h-6 text-xl text-red-300">{usernameError}</h3>
          {signupError && (
            <h3 className="text-xl text-red-300">{signupError}</h3>
          )}
          {/* <h1 className="underline">
            {takenUsername ? 'Username is taken' : ''}
          </h1> */}
          <form className="w-96" id="form1" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="block ">Username</label>
              <input
                className={inputClasses}
                type="text"
                value={username}
                onBlur={() => handleUsernameBlur(username)}
                onChange={(e) => setUsername(e.target.value)}
              />
              <BarLoader
                color="#36d7b7"
                cssOverride={override}
                width={40}
                loading={checkingUsername}
              />
              {!usernameError && username.length > 5 && (
                <div className="absolute -right-40 top-8 flex items-center gap-2">
                  <img className="w-9" src={circleCheck} alt="Check icon" />
                  <span className="text-gray-300">Username valid</span>
                </div>
              )}
              {usernameError && (
                <>
                  <div className="absolute -right-12 top-8 text-left">
                    <img className="w-9" src={circleX} alt="Check icon" />
                  </div>
                </>
              )}
              {/* <FadeLoader cssOverride={override} /> */}
            </div>
            <div>
              <label className="block ">Email</label>
              <input
                type="email"
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
              className=" my-6 w-full rounded bg-emerald-600 py-2 text-lg font-bold tracking-wide text-slate-100 transition-all duration-100 hover:bg-emerald-800"
            >
              {signupLoading ? <BarLoader /> : <p>Create Account</p>}
            </button>
            <Link to={'/login'}>
              <p className="text-center">
                Already have an account?{' '}
                <span className="text-emerald-400 underline">login</span>
              </p>
            </Link>
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
