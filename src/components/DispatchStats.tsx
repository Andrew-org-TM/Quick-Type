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
  selectExcessQuoteToType,
} from '../store/slices/TypeInputSlice';
import {
  calculateAccuracy,
  calculateRaw,
  keyPressData,
} from '../helperFunctions';
import supabase from '../supabaseConfig';
import { selectAuthUser } from '../store/slices/AuthSlice';

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
  const user = useAppSelector(selectAuthUser);
  const excessQuoteToType = useAppSelector(selectExcessQuoteToType);
  const quoteToType = useAppSelector(selectQuoteToType);

  useEffect(() => {
    const accuracy = calculateAccuracy(
      totalKeysPressed,
      incorrectKeys,
      userTextInput
    );

    const endingKeyData = keyPressData(
      userTextInput,
      excessQuoteToType,
      incorrectKeys,
      quoteToType
    );
    dispatch(adjustAccuracy(accuracy));

    // Dispatch adding the score to the datbase once test is complete (user reaches the end of the test),
    // user has typed at least once and we are on countdown mode
    // dispatch(authorizeToken());
    if (testComplete && userTextInput.length !== 0 && !useCountdown) {
      const raw = calculateRaw(totalKeysPressed, timeElapsed);
      dispatch(adjustRaw(raw));
      async function dispatchData() {
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
            userId: user.id,
            endingCorrect: endingKeyData.correct,
            endingSkipped: endingKeyData.skipped,
            endingExtra: endingKeyData.extra,
            endingIncorrect: endingKeyData.incorrect,
          })
          .select()
          .single();
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
            endingCorrect: endingKeyData.correct,
            endingSkipped: endingKeyData.skipped,
            endingExtra: endingKeyData.extra,
            endingIncorrect: endingKeyData.incorrect,
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
        const { error, data: newScore } = await supabase
          .from('scores')
          .insert({
            wpm,
            testType: 'time',
            timeElapsed: startingTime,
            incorrectKeys,
            totalKeysPressed,
            language,
            accuracy,
            raw,
            userId: user.id,
            endingCorrect: endingKeyData.correct,
            endingSkipped: endingKeyData.skipped,
            endingExtra: endingKeyData.extra,
            endingIncorrect: endingKeyData.incorrect,
          })
          .select()
          .single();
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
            endingCorrect: endingKeyData.correct,
            endingSkipped: endingKeyData.skipped,
            endingExtra: endingKeyData.extra,
            endingIncorrect: endingKeyData.incorrect,
          })
        );
      }
    }
  }, [testComplete]);

  return <></>;
};

export default DispatchStats;
