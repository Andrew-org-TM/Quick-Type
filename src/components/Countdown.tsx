import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import {
  toggleTimerActive,
  selectTimeElapsed,
  selectTimerActive,
  selectCountdownTimer,
  adjustCountdown,
  selectUseCountdown,
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
  const countdownTimer = useAppSelector(selectCountdownTimer);
  const useCountdown = useAppSelector(selectUseCountdown);

  useEffect(() => {
    if (testComplete && userTextInput.length > 0 && useCountdown) {
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
  }, [userTextInput, quoteToType]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        dispatch(adjustCountdown(countdownTimer - 0.5));
      }, 500);
    } else if (!timerActive && timeElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, countdownTimer]);

  useEffect(() => {
    if (countdownTimer <= 0 && useCountdown) {
      dispatch(toggleTimerActive(false));
      dispatch(setTestComplete(true));
    }
  }, [countdownTimer, timerActive]);

  return <div>{/* <p>{countdownTimer}</p> */}</div>;
};

export default Timer;
