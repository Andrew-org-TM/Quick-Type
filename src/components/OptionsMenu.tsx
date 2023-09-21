import React, { useState, useEffect } from 'react';
import SingleOption from './SingleOption';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  changeMode,
  selectUseCountdown,
  setTestTime,
  changeTestLangauge,
  resetStats,
  selectLanguage,
  selectStartingTime,
  selectCountdownTimer,
  selectTimeElapsed,
} from '../store/slices/StatSlice';
import OptionButton from './OptionButton';
import {
  resetUserInput,
  selectNumOfWordsToType,
  selectTestComplete,
  setTestWords,
} from '../store/slices/TypeInputSlice';

export type Mode = 'Time' | 'Words';
export type Languages = 'English' | 'HTML' | 'JavaScript';

interface ModeState {
  activeMode: Mode;
  modes: { id: Mode }[];
}

interface LanguageState {
  activeLanguage: Languages;
  languages: { id: Languages }[];
}

interface TimeState {
  activeTime: number;
  times: { id: number }[];
}

interface WordState {
  activeWords: number;
  words: { id: number }[];
}

const OptionsMenu = () => {
  const useCountdown = useAppSelector(selectUseCountdown);
  const testLanguage = useAppSelector(selectLanguage);
  const startingTime = useAppSelector(selectStartingTime);
  const numberofWordsToType = useAppSelector(selectNumOfWordsToType);
  const testComplete = useAppSelector(selectTestComplete);
  const countdownTimer = useAppSelector(selectCountdownTimer);
  const timeElapsed = useAppSelector(selectTimeElapsed);

  const dispatch = useAppDispatch();

  const [modes, setModes] = useState<ModeState>({
    activeMode: useCountdown ? 'Time' : 'Words',
    modes: [{ id: 'Time' }, { id: 'Words' }],
  });

  const [languages, setLanguages] = useState<LanguageState>({
    activeLanguage: testLanguage,
    languages: [{ id: 'English' }, { id: 'JavaScript' }, { id: 'HTML' }],
  });
  const [times, setTimes] = useState<TimeState>({
    activeTime: startingTime,
    times: [{ id: 15 }, { id: 30 }, { id: 60 }],
  });
  const [words, setWords] = useState<WordState>({
    activeWords: numberofWordsToType,
    words: [{ id: 10 }, { id: 20 }, { id: 50 }],
  });

  useEffect(() => {
    // Pull previous test options from local storage
    const lastLanguageSelected = localStorage.getItem('language');
    if (lastLanguageSelected) {
      setLanguages({
        ...languages,
        activeLanguage: lastLanguageSelected as Languages,
      });
    }

    const lastModeSelected = localStorage.getItem('mode');
    if (lastModeSelected) {
      setModes({
        ...modes,
        activeMode: lastModeSelected as Mode,
      });
    }

    const lastWordsSelected =
      parseInt(localStorage.getItem('words') ?? '') || undefined;

    console.log('lastWordsSelected', lastWordsSelected);

    const lastTimeSelected =
      parseInt(localStorage.getItem('time') ?? '') || undefined;

    if (lastTimeSelected) {
      setTimes({ ...times, activeTime: lastTimeSelected });
    }
    if (lastWordsSelected) {
      setWords({ ...words, activeWords: lastWordsSelected });
    }
  }, []);

  useEffect(() => {
    dispatch(changeMode(modes.activeMode));
  }, [modes]);

  useEffect(() => {
    dispatch(changeTestLangauge(languages.activeLanguage));
  }, [languages]);

  useEffect(() => {
    dispatch(setTestTime(times.activeTime));
  }, [times]);

  useEffect(() => {
    dispatch(setTestWords(words.activeWords));
  }, [words]);

  function toggleMode(id: Mode): void {
    setModes((prev) => ({ ...prev, activeMode: id }));
    dispatch(resetStats());
    dispatch(resetUserInput());
    localStorage.setItem('mode', id);
  }

  function toggleLanguage(id: Languages): void {
    setLanguages((prev) => ({ ...prev, activeLanguage: id }));
    dispatch(resetUserInput());
    dispatch(resetStats());
    localStorage.setItem('language', id);
  }
  function toggleTime(id: number): void {
    setTimes((prev) => ({ ...prev, activeTime: id }));
    dispatch(resetStats());
    dispatch(resetUserInput());
    dispatch(setTestTime(id));
    localStorage.setItem('time', String(id));
  }
  function toggleWord(id: number): void {
    setWords((prev) => ({ ...prev, activeWords: id }));
    dispatch(resetStats());
    dispatch(resetUserInput());
    dispatch(setTestWords(id));
    localStorage.setItem('words', String(id));
  }

  return (
    <div
      className={`mx-auto flex max-w-3xl justify-center gap-4 py-8 text-gray-300 transition-all duration-500 ${
        timeElapsed !== 0 || countdownTimer !== startingTime
          ? 'opacity-0 '
          : 'opacity-100'
      }`}
    >
      <SingleOption>
        <h4 className="text-xl">Mode</h4>
        <div className="flex gap-3">
          {modes.modes.map((mode) => (
            <OptionButton
              id={mode.id}
              clickFunc={toggleMode}
              key={mode.id}
              selected={mode.id === modes.activeMode}
            >
              {mode.id}
            </OptionButton>
          ))}
        </div>
      </SingleOption>
      <div className="hidden sm:block">
        <SingleOption>
          <h4 className="text-xl">Language</h4>
          <div className="flex gap-3 ">
            {languages.languages.map((language) => (
              <OptionButton
                id={language.id}
                clickFunc={toggleLanguage}
                key={language.id}
                selected={language.id === languages.activeLanguage}
              >
                {language.id}
              </OptionButton>
            ))}
          </div>
        </SingleOption>
      </div>
      <SingleOption>
        <h4 className="text-xl">{useCountdown ? 'Time' : 'Words'}</h4>
        <div className="flex gap-3">
          {useCountdown
            ? times.times.map((time) => (
                <OptionButton
                  id={time.id}
                  clickFunc={toggleTime}
                  key={time.id}
                  selected={time.id === times.activeTime}
                >
                  {time.id}
                </OptionButton>
              ))
            : words.words.map((word) => (
                <OptionButton
                  id={word.id}
                  clickFunc={toggleWord}
                  key={word.id}
                  selected={word.id === words.activeWords}
                >
                  {word.id}
                </OptionButton>
              ))}
        </div>
      </SingleOption>
    </div>
  );
};

export default OptionsMenu;
