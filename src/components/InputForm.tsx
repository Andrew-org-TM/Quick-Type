import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deletePress, keyPress } from '../keyPressFunction';
import NewTestButton from './NewTestButton';
import {
  selectTestComplete,
  setTestComplete,
  selectQuoteToType,
  setQuoteToType,
  selectLettersAvailable,
  setExcessQuoteToType,
  selectExcessQuoteToType,
  setDuplicateQuoteToType,
  selectDuplicateQuoteToType,
  setUserTextInput,
  selectUserTextInput,
  fetchAllQuotes,
  selectAllQuotes,
  QuoteFormat,
  selectRandomWords,
  selectNumOfWordsToType,
} from '../store/slices/TypeInputSlice';
import TypeBoxText from './TypeBoxText';
import { deleteExcessLettersData, remakeQuoteString } from '../helperFunctions';
import Timer from './Timer';
import {
  incrementKeysPressed,
  incrementIncorrectKeys,
  selectIncorrectKeys,
  selectUseCountdown,
  selectCountdownTimer,
  selectLanguage,
  resetStats,
} from '../store/slices/StatSlice';
import Countdown from './Countdown';
import TestStatHeader from './TestStatHeader';
import OptionsMenu from './OptionsMenu';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseConfig';
import DispatchStats from './DispatchStats';

const InputForm = () => {
  const dispatch = useAppDispatch();

  const [border, setBorder] = useState(false);

  const [lastKeyPressed, setLastKeyPressed] = useState<string>('');

  const [keyEvent, setKeyEvent] =
    useState<React.KeyboardEvent<HTMLTextAreaElement> | null>(null);

  const [changeEvent, setChangeEvent] = useState<string | null>(null);

  const testComplete: boolean = useAppSelector(selectTestComplete);
  const allQuotes: QuoteFormat[] = useAppSelector(selectAllQuotes);
  const lettersAvailable: string = useAppSelector(selectLettersAvailable);
  const quoteToType: string = useAppSelector(selectQuoteToType);
  const excessQuoteToType: string = useAppSelector(selectExcessQuoteToType);
  const userTextInput: string = useAppSelector(selectUserTextInput);
  const countdownTimer = useAppSelector(selectCountdownTimer);
  const randomWordList = useAppSelector(selectRandomWords);
  const numOfWordsToType = useAppSelector(selectNumOfWordsToType);
  const language = useAppSelector(selectLanguage);
  const duplicateQuoteToType: string = useAppSelector(
    selectDuplicateQuoteToType
  );
  const useCountdown = useAppSelector(selectUseCountdown);

  // Checks if key pressed is part of the character bank
  // Stops other keys from interfering with test
  function isValidChar(char: string): boolean {
    return lettersAvailable.includes(char);
  }

  useEffect(() => {
    dispatch(setUserTextInput(''));
    dispatch(setQuoteToType(duplicateQuoteToType));
    dispatch(setExcessQuoteToType(''));
    // dispatch(fetchAllQuotes());
    dispatch(
      setQuoteToType(
        randomWordList.slice(0, numOfWordsToType).join(' ') || 'Loading'
      )
    );
    dispatch(setDuplicateQuoteToType(randomWordList.join(' ') || 'Loading'));
    // dispatch(setTestComplete(false));
    dispatch(resetStats());

    return () => {
      dispatch(setTestComplete(false));
    };
  }, []);

  useEffect(() => {
    dispatch(setQuoteToType(randomWordList.join(' ') || 'Loading'));
    dispatch(setDuplicateQuoteToType(randomWordList.join(' ') || 'Loading'));
  }, [useCountdown, numOfWordsToType, language]);

  useEffect(() => {
    if (
      userTextInput.charAt(userTextInput.length - 1) !==
        quoteToType.charAt(userTextInput.length - 1) &&
      lastKeyPressed !== 'Backspace'
    ) {
      dispatch(incrementIncorrectKeys(1));
    }
  }, [userTextInput, quoteToType]);

  useEffect(() => {
    if (keyEvent && changeEvent) {
      if (handleDeletePress(keyEvent)) {
        handleKeyPress(changeEvent);
      }
    }
    setChangeEvent(null);
  }, [changeEvent]);

  function handleFocus() {
    setBorder(true);
    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.style.display = 'block';
    }
  }

  function handleBlur() {
    setBorder(false);
    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.style.display = 'none';
    }
  }

  return (
    <>
      <TestStatHeader />
      <OptionsMenu />
      <DispatchStats />

      <div className="flex flex-col gap-4 text-white">
        {useCountdown ? <Countdown /> : <Timer />}
        <div
          id="test-box"
          className={`relative h-28 min-w-full self-start overflow-hidden border-2 border-transparent px-8 text-3xl`}
        >
          <TypeBoxText />
          <textarea
            value={userTextInput}
            id="type-test"
            className="absolute left-0 top-0 h-full w-full rounded border-2 border-white py-4 px-8 text-2xl opacity-0 "
            onChange={(e) => {
              setChangeEvent(e.target.value.slice(-1));
            }}
            onKeyDown={(e) => setKeyEvent(e)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus
          />
        </div>
      </div>
      <NewTestButton />
    </>
  );

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // KEY PRESS FUNCTION BELOW, handles key logic, colors, etc

  function handleDeletePress(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): boolean {
    return deletePress(
      e,
      setLastKeyPressed,
      deleteExcessLettersData,
      userTextInput,
      duplicateQuoteToType,
      quoteToType,
      useCountdown,
      countdownTimer,
      isValidChar,
      dispatch,
      incrementKeysPressed,
      setQuoteToType,
      setUserTextInput,
      setExcessQuoteToType,
      excessQuoteToType,
      incrementIncorrectKeys,
      remakeQuoteString
    );
  }
  function handleKeyPress(e: string): void {
    keyPress(
      e,
      setLastKeyPressed,
      deleteExcessLettersData,
      userTextInput,
      duplicateQuoteToType,
      quoteToType,
      useCountdown,
      countdownTimer,
      isValidChar,
      dispatch,
      incrementKeysPressed,
      setQuoteToType,
      setUserTextInput,
      setExcessQuoteToType,
      excessQuoteToType,
      incrementIncorrectKeys,
      remakeQuoteString,
      language
    );
  }
};

export default InputForm;
