import React, { useEffect } from 'react';
import keyboardIcon from '../assets/icons8-keyboard-64.png';
import barChartIcon from '../assets/bar-chart-icon.svg';
import accountIcon from '../assets/account-icon.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import supabase from '../supabaseConfig';
import { setUser } from '../store/slices/AuthSlice';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  console.log('user redux', user);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        console.log('<><><><><>');
        dispatch(setUser(session.user));
      } else {
        console.log('IM OUT');
      }
    });
  }, []);

  return (
    <div className="text-white">
      <nav className="px-6 pt-3 flex justify-between">
        <Link to={'/'}>
          <div className="flex items-center gap-4">
            <img src={keyboardIcon} alt="Keyboard icon" />
            <h1 className="text-4xl text-white font-bold tracking-wide">
              QuickType
              <span className="text-sm text-gray-400">(beta v0.3)</span>
            </h1>
          </div>
        </Link>
        <div className="hidden lg:flex gap-4">
          <NavLink
            linkName="leaderboards"
            imgUrl={barChartIcon}
            altText="Bar chart icon"
            link="/Leaderboards"
          />
          {/* <NavLink link="/login" linkName="Login" />
          <NavLink link="/signup" linkName="Signup" /> */}
          <NavLink
            linkName="Account"
            imgUrl={accountIcon}
            altText="Account user icon"
            link="/account"
          />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
