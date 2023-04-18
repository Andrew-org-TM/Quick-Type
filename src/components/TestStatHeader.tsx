import React, { useEffect, useState } from 'react';
import {
  selectTimeElapsed,
  selectTimerActive,
  selectTotalKeysPressed,
  selectIncorrectKeys,
  selectUseCountdown,
  selectCountdownTimer,
  selectStartingTime,
  adjustWpm,
  selectWpm,
  selectCurrentScores,
  pushScore,
} from '../store/slices/StatSlice';
import {
  selectTestComplete,
  selectQuoteToType,
  selectUserTextInput,
  selectDuplicateQuoteToType,
  selectExcessQuoteToType,
} from '../store/slices/TypeInputSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  CalculateWPM,
  addScoreToState,
  calculateRaw,
  incorrectKeyPresses,
  keyPressData,
} from '../helperFunctions';

const TestStatHeader = () => {
  const dispatch = useAppDispatch();
  const [wpm, setWpm] = useState(0);

  const timeElapsed = useAppSelector(selectTimeElapsed);
  const timerActive = useAppSelector(selectTimerActive);
  const quoteToType = useAppSelector(selectQuoteToType);
  const userTextInput = useAppSelector(selectUserTextInput);
  const totalKeysPressed = useAppSelector(selectTotalKeysPressed);
  const duplicateQuoteToType = useAppSelector(selectDuplicateQuoteToType);
  const incorrectKeys = useAppSelector(selectIncorrectKeys);
  const testComplete = useAppSelector(selectTestComplete);
  const useCountdown = useAppSelector(selectUseCountdown);
  const countdownTimer = useAppSelector(selectCountdownTimer);
  const startingTime = useAppSelector(selectStartingTime);
  const excessQuoteToType = useAppSelector(selectExcessQuoteToType);
  const stateWpm = useAppSelector(selectWpm);
  const currentScores = useAppSelector(selectCurrentScores);

  useEffect(() => {
    const wordsPerMin = CalculateWPM(
      useCountdown,
      timeElapsed,
      countdownTimer,
      startingTime,
      excessQuoteToType,
      quoteToType,
      duplicateQuoteToType,
      userTextInput
    );

    dispatch(adjustWpm(wordsPerMin));
  }, [userTextInput]);

  useEffect(() => {
    const wordsPerMin = CalculateWPM(
      useCountdown,
      timeElapsed,
      countdownTimer,
      startingTime,
      excessQuoteToType,
      quoteToType,
      duplicateQuoteToType,
      userTextInput
    );

    const errors = incorrectKeyPresses(excessQuoteToType, incorrectKeys);

    dispatch(adjustWpm(wordsPerMin));

    if (useCountdown) {
      const raw =
        calculateRaw(totalKeysPressed, startingTime - countdownTimer) || 0;

      if (Number.isInteger(countdownTimer)) {
        addScoreToState(
          currentScores,
          dispatch,
          wordsPerMin,
          errors,
          startingTime - countdownTimer,
          pushScore,
          totalKeysPressed
        );
        setWpm(Math.floor(stateWpm));
      }
    } else {
      if (Number.isInteger(timeElapsed) && timeElapsed !== 0) {
        const raw = calculateRaw(totalKeysPressed, timeElapsed);

        addScoreToState(
          currentScores,
          dispatch,
          wordsPerMin,
          errors,
          timeElapsed,
          pushScore,
          totalKeysPressed
        );

        setWpm(Math.floor(stateWpm));
      }
    }
  }, [timeElapsed, countdownTimer]);

  useEffect(() => {
    if (stateWpm === 0) {
      setWpm(stateWpm);
    }
  }, [stateWpm]);

  useEffect(() => {
    if (timeElapsed !== 0 || countdownTimer !== startingTime) {
      const wordsPerMin = CalculateWPM(
        useCountdown,
        timeElapsed,
        countdownTimer,
        startingTime,
        excessQuoteToType,
        quoteToType,
        duplicateQuoteToType,
        userTextInput
      );

      const raw = calculateRaw(
        totalKeysPressed,
        useCountdown ? startingTime - countdownTimer : timeElapsed
      );

      const errors = incorrectKeyPresses(excessQuoteToType, incorrectKeys);

      addScoreToState(
        currentScores,
        dispatch,
        wordsPerMin,
        errors,
        useCountdown ? startingTime - countdownTimer : timeElapsed,
        pushScore,
        totalKeysPressed
      );
      localStorage.setItem('lineData', JSON.stringify(currentScores));
      localStorage.setItem(
        'keyPresses',
        JSON.stringify(
          keyPressData(
            userTextInput,
            excessQuoteToType,
            incorrectKeys,
            quoteToType
          )
        )
      );
    }
  }, [testComplete]);

  return (
    <div
      className="flex items-center justify-center gap-16 px-4 text-center text-white transition-all duration-500"
      style={{
        transform: `translate(0,${
          timeElapsed !== 0 || countdownTimer !== startingTime ? '120px' : '0'
        })`,
      }}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl">WPM</h3>
        <p className="text-xl text-green-400">{wpm === Infinity ? '0' : wpm}</p>
      </div>
      <div className="flex flex-col items-center text-3xl sm:text-4xl">
        <h3>{useCountdown ? 'Time Remaining' : 'Time Elapsed'}</h3>
        <p className="text-[#3E92CC]">
          {useCountdown ? Math.floor(countdownTimer) : Math.floor(timeElapsed)}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl">Errors</h3>
        <p className="text-xl text-red-400">{incorrectKeys}</p>
      </div>
    </div>
  );
};

export default TestStatHeader;
