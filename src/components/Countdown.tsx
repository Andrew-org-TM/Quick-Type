import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authorizeToken } from '../store/slices/AuthSlice';
import { dataState } from '../store/slices/AuthSlice';
import {
  toggleTimerActive,
  selectTimeElapsed,
  adjustTime,
  selectTimerActive,
  selectTotalKeysPressed,
  selectIncorrectKeys,
  addNewScore,
  selectCountdownTimer,
  adjustCountdown,
  selectUseCountdown,
  selectStartingTime,
} from '../store/slices/StatSlice';
import {
  selectTestComplete,
  selectQuoteToType,
  selectUserTextInput,
  selectDuplicateQuoteToType,
  setTestComplete,
} from '../store/slices/TypeInputSlice';

const Timer = () => {
  const dispatch = useAppDispatch();

  const [timeRemaining, setTimeRemaining] = useState(15);

  const userData = useAppSelector(dataState);
  const timeElapsed = useAppSelector(selectTimeElapsed);
  const timerActive = useAppSelector(selectTimerActive);
  const quoteToType = useAppSelector(selectQuoteToType);
  const userTextInput = useAppSelector(selectUserTextInput);
  const totalKeysPressed = useAppSelector(selectTotalKeysPressed);
  const duplicateQuoteToType = useAppSelector(selectDuplicateQuoteToType);
  const incorrectKeys = useAppSelector(selectIncorrectKeys);
  const testComplete = useAppSelector(selectTestComplete);
  const countdownTimer = useAppSelector(selectCountdownTimer);
  const useCountdown = useAppSelector(selectUseCountdown);
  const startingTime = useAppSelector(selectStartingTime);

  useEffect(() => {
    const raw = totalKeysPressed / 5 / (startingTime / 60);
    const wpm = +(
      (totalKeysPressed - incorrectKeys) /
      5 /
      (startingTime / 60)
    ).toFixed(2);
    const accuracy = +(
      (totalKeysPressed - incorrectKeys) /
      totalKeysPressed
    ).toFixed(2);

    // Dispatch adding the score to the datbase once test is complete (clock hits 0),
    // user has typed at least once and we are on countdown mode
    if (testComplete && userTextInput.length !== 0 && useCountdown) {
      async function dispatchData() {
        if (userData) {
          await dispatch(
            addNewScore({
              timeElapsed: startingTime,
              totalKeysPressed,
              incorrectKeys,
              wpm,
              raw,
              accuracy,
              language: 'English',
              testType: 'time',
              userId: userData.id,
            })
          );
        } else {
          dispatch(
            addNewScore({
              timeElapsed: startingTime,
              totalKeysPressed,
              incorrectKeys,
              wpm,
              raw,
              accuracy,
              language: 'English',
              testType: 'time',
            })
          );
        }
      }
      dispatchData();
    }
    dispatch(authorizeToken());
  }, [testComplete]);

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
        dispatch(adjustCountdown(countdownTimer - 0.1));
      }, 100);
    } else if (!timerActive && timeElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, countdownTimer]);

  useEffect(() => {
    if (countdownTimer <= 0) {
      dispatch(toggleTimerActive(false));
      dispatch(setTestComplete(true));
    }
  }, [countdownTimer, timerActive]);

  return <div>{/* <p>{countdownTimer}</p> */}</div>;
};

export default Timer;
