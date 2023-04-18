import React, { useState, useEffect } from 'react';
import {
  setUserTextInput,
  setQuoteToType,
  setExcessQuoteToType,
  selectDuplicateQuoteToType,
  setDuplicateQuoteToType,
  selectNumOfWordsToType,
  selectRandomWords,
} from '../store/slices/TypeInputSlice';
import {
  adjustTime,
  resetStats,
  selectLanguage,
  selectUseCountdown,
} from '../store/slices/StatSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { focusTextArea } from '../helperFunctions';
import { resetFormatState } from '../store/slices/formatSlice';

const NewTestButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const duplicateQuoteToType = useAppSelector(selectDuplicateQuoteToType);

  const useCountdown = useAppSelector(selectUseCountdown);
  const numOfWordsToType = useAppSelector(selectNumOfWordsToType);
  const language = useAppSelector(selectLanguage);
  const randomWordList = useAppSelector(selectRandomWords);

  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setQuoteToType(randomWordList.join(' ') || 'Loading'));
    dispatch(setDuplicateQuoteToType(randomWordList.join(' ') || 'Loading'));
  }, [useCountdown, numOfWordsToType, language]);

  return (
    <button
      className="my-6 mx-auto block w-48 rounded bg-emerald-600 py-2 text-lg font-bold tracking-wide text-slate-100 transition-all duration-100 hover:bg-emerald-800 focus:bg-emerald-900"
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
        navigate('/');
      }}
    >
      New Test
    </button>
  );
};

export default NewTestButton;
