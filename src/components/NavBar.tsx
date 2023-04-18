import React, { useEffect } from 'react';
import keyboardIcon from '../assets/icons8-keyboard-64.png';
import barChartIcon from '../assets/bar-chart-icon.svg';
import accountIcon from '../assets/account-icon.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import supabase from '../supabaseConfig';
import { User } from '@supabase/supabase-js';
import { setUser, setUsername } from '../store/slices/AuthSlice';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(setUser({} as User));
      }
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (user.id) {
        const { data, error } = await supabase.from('users').select().single();

        if (!error) dispatch(setUsername(data.username));
        else if (error) console.log('error getting username', error);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="text-white">
      <nav className="flex justify-between px-6 pt-3">
        <Link to={'/'}>
          <div className="flex items-center gap-2">
            <img className="w-12" src={keyboardIcon} alt="Keyboard icon" />
            <h1 className="text-2xl font-bold tracking-wide text-gray-300">
              QuickType
              <span className="text-xs text-gray-400">(beta v0.3)</span>
            </h1>
          </div>
        </Link>
        <div className="hidden gap-4 lg:flex">
          <NavLink
            linkName="leaderboards"
            imgUrl={barChartIcon}
            altText="Bar chart icon"
            link="/Leaderboards"
          />
          {!user.id ? (
            <>
              <NavLink link="/login" linkName="Login" />
              <NavLink link="/signup" linkName="Signup" />
            </>
          ) : (
            <>
              <NavLink
                linkName="Account"
                imgUrl={accountIcon}
                altText="Account user icon"
                link="/account"
              />
              <button
                onClick={() => {
                  supabase.auth.signOut();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
