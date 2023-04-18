import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import {
  selectTimeElapsed,
  selectTimerActive,
  selectTotalKeysPressed,
  selectIncorrectKeys,
  addNewScore,
  selectUseCountdown,
  selectWpm,
  adjustAccuracy,
  adjustRaw,
  selectLanguage,
  selectStartingTime,
  selectCountdownTimer,
} from '../store/slices/StatSlice';
import {
  selectTestComplete,
  selectQuoteToType,
  selectUserTextInput,
} from '../store/slices/TypeInputSlice';
import { calculateAccuracy, calculateRaw } from '../helperFunctions';
import supabase from '../supabaseConfig';

const DispatchStats = () => {
  const dispatch = useAppDispatch();
  const timeElapsed = useAppSelector(selectTimeElapsed);
  const userTextInput = useAppSelector(selectUserTextInput);
  const totalKeysPressed = useAppSelector(selectTotalKeysPressed);
  const incorrectKeys = useAppSelector(selectIncorrectKeys);
  const testComplete = useAppSelector(selectTestComplete);
  const useCountdown = useAppSelector(selectUseCountdown);
  const wpm = useAppSelector(selectWpm);
  const language = useAppSelector(selectLanguage);
  const startingTime = useAppSelector(selectStartingTime);
  const countdownTimer = useAppSelector(selectCountdownTimer);

  useEffect(() => {
    const accuracy = calculateAccuracy(
      totalKeysPressed,
      incorrectKeys,
      userTextInput
    );

    dispatch(adjustAccuracy(accuracy));

    // Dispatch adding the score to the datbase once test is complete (user reaches the end of the test),
    // user has typed at least once and we are on countdown mode
    // dispatch(authorizeToken());
    if (testComplete && userTextInput.length !== 0 && !useCountdown) {
      const raw = calculateRaw(totalKeysPressed, timeElapsed);
      dispatch(adjustRaw(raw));
      async function dispatchData() {
        if (false) {
          // dispatch(
          //   addNewScore({
          //     timeElapsed,
          //     totalKeysPressed,
          //     incorrectKeys,
          //     wpm,
          //     raw,
          //     accuracy,
          //     language,
          //     testType: 'words',
          //     userId: userData.id,
          //   })
          // );
        } else {
          dispatch(
            addNewScore({
              timeElapsed,
              totalKeysPressed,
              incorrectKeys,
              wpm,
              raw,
              accuracy,
              language,
              testType: 'words',
            })
          );
        }
        const { error, data: newScore } = await supabase
          .from('scores')
          .insert({
            wpm,
            testType: 'words',
            timeElapsed,
            incorrectKeys,
            totalKeysPressed,
            language,
            accuracy,
            raw,
          })
          .select();

        console.log('NEWSCORE', newScore);
      }

      dispatchData();
      if (timeElapsed > 0) {
        localStorage.setItem(
          'lastTest',
          JSON.stringify({
            timeElapsed,
            totalKeysPressed,
            incorrectKeys,
            wpm,
            raw,
            accuracy,
            language,
            testType: 'words',
          })
        );
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    else if (testComplete && userTextInput.length !== 0 && useCountdown) {
      const raw = calculateRaw(totalKeysPressed, startingTime);
      dispatch(adjustRaw(raw));

      async function dispatchData() {
        // CHANGE THE BELOW LINE TO DISPATCH IF THE USER HAS AN ID BUT I"M PRETTY SURE IT CAN BE COMBINED INTO ONE CALL
        if (false) {
          // await dispatch(
          //   addNewScore({
          //     timeElapsed: startingTime,
          //     totalKeysPressed,
          //     incorrectKeys,
          //     wpm,
          //     raw,
          //     accuracy,
          //     language,
          //     testType: 'time',
          //     userId: userData.id,
          //   })
          // );
        } else {
          dispatch(
            addNewScore({
              timeElapsed: startingTime,
              totalKeysPressed,
              incorrectKeys,
              wpm,
              raw,
              accuracy,
              language,
              testType: 'time',
            })
          );
        }
      }
      dispatchData();
      if (countdownTimer !== startingTime) {
        localStorage.setItem(
          'lastTest',
          JSON.stringify({
            timeElapsed: startingTime,
            totalKeysPressed,
            incorrectKeys,
            wpm,
            raw,
            accuracy,
            language,
            testType: 'time',
          })
        );
      }
    }
  }, [testComplete]);

  return <></>;
};

export default DispatchStats;
