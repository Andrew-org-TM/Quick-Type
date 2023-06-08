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
import NavLinkMain from './NavLinkMain';
import {
  setUserTextInput,
  setQuoteToType,
  setExcessQuoteToType,
  setDuplicateQuoteToType,
  selectRandomWords,
  selectDuplicateQuoteToType,
} from '../store/slices/TypeInputSlice';
import { resetFormatState } from '../store/slices/formatSlice';
import { resetStats, adjustTime } from '../store/slices/StatSlice';
import { focusTextArea } from '../helperFunctions';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const randomWordList = useAppSelector(selectRandomWords);
  const duplicateQuoteToType = useAppSelector(selectDuplicateQuoteToType);

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
    <div className="mb-2 text-gray-300">
      <nav className="flex justify-between px-6 pt-3">
        <Link to={'/'}>
          <div
            className="flex items-center gap-2"
            onClick={() => {
              dispatch(setUserTextInput(''));
              dispatch(setQuoteToType(duplicateQuoteToType));
              dispatch(setExcessQuoteToType(''));
              dispatch(adjustTime(0));
              dispatch(resetStats());
              dispatch(setQuoteToType(randomWordList.join(' ') || 'Loading'));
              dispatch(
                setDuplicateQuoteToType(randomWordList.join(' ') || 'Loading')
              );
              dispatch(resetFormatState());
              focusTextArea();
              // navigate('/');
            }}
          >
            <img className="w-12" src={keyboardIcon} alt="Keyboard icon" />
            <h1 className="text-2xl font-bold tracking-wide text-gray-300">
              QuickType
              <span className="text-xs text-gray-400">(beta v0.3)</span>
            </h1>
          </div>
        </Link>
        <div className="hidden gap-6 lg:flex">
          {!user.id ? (
            <>
              <NavLink
                linkName="Leaderboards"
                // imgUrl={barChartIcon}
                // altText="Bar chart icon"
                link="/Leaderboards"
              />
              <NavLink link="/login" linkName="Login" />
              <NavLinkMain link="/signup" linkName="Sign Up" />
            </>
          ) : (
            <>
              <NavLink
                linkName="Leaderboards"
                // imgUrl={barChartIcon}
                // altText="Bar chart icon"
                link="/Leaderboards"
              />
              <NavLinkMain
                linkName="Account"
                // imgUrl={accountIcon}
                // altText="Account user icon"
                link="/account"
              />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
