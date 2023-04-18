import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import {
  toggleTimerActive,
  selectTimeElapsed,
  adjustTime,
  selectTimerActive,
  selectTotalKeysPressed,
  selectIncorrectKeys,
  selectUseCountdown,
  selectWpm,
  selectLanguage,
} from '../store/slices/StatSlice';
import {
  selectTestComplete,
  selectQuoteToType,
  selectUserTextInput,
  setTestComplete,
} from '../store/slices/TypeInputSlice';

const Timer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeElapsed = useAppSelector(selectTimeElapsed);
  const timerActive = useAppSelector(selectTimerActive);
  const quoteToType = useAppSelector(selectQuoteToType);
  const userTextInput = useAppSelector(selectUserTextInput);
  const testComplete = useAppSelector(selectTestComplete);
  const useCountdown = useAppSelector(selectUseCountdown);

  useEffect(() => {
    if (testComplete && userTextInput.length > 0) {
      navigate('/results');
      dispatch(setTestComplete(false));
    }
  }, [testComplete, userTextInput]);

  useEffect(() => {
    if (userTextInput.length > 0 && userTextInput.length < quoteToType.length) {
      dispatch(toggleTimerActive(true));
    }

    return () => {
      dispatch(toggleTimerActive(false));
    };
  }, [userTextInput, quoteToType, useCountdown]);

  useEffect(() => {
    let interval: any = null;

    const timeInterval = 200;

    if (timerActive) {
      interval = setInterval(() => {
        dispatch(adjustTime(timeElapsed + timeInterval / 1000));
      }, timeInterval);
    } else if (!timerActive && timeElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeElapsed]);

  return <div>{/* <p>{timeElapsed}</p> */}</div>;
};

export default Timer;
