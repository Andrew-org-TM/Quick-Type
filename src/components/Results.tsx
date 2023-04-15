import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectLastTest,
  selectWpm,
  selectAccuracy,
  selectIncorrectKeys,
  Stat,
  adjustWpm,
  adjustAccuracy,
  adjustRaw,
  setLastTest,
  setIncorrectKeys,
} from '../store/slices/StatSlice';
import SingleResult from './SingleResult';
import LineChart from './LineChart';
import KeysPieChart from './KeysPieChart';

const Results = () => {
  const dispatch = useAppDispatch();
  const wpm = useAppSelector(selectWpm);
  const accuracy = useAppSelector(selectAccuracy);
  const incorrectKeys = useAppSelector(selectIncorrectKeys);
  const raw = useAppSelector((state) => state.statSlice.raw);
  const lastTest: Stat = JSON.parse(localStorage.getItem('lastTest') || '{}');

  useEffect(() => {
    dispatch(setLastTest(lastTest));
    if (!wpm) {
      dispatch(adjustWpm(lastTest.wpm));
      dispatch(adjustAccuracy(lastTest.accuracy));
      dispatch(setIncorrectKeys(lastTest.incorrectKeys));
      dispatch(adjustRaw(lastTest.raw));
    }
  }, []);

  return (
    <section className="text-gray-300 flex flex-col items-center w-full px-4">
      <div className="w-full">
        <h1 className="text-center text-5xl my-6">Test Stats</h1>
        <div className="grid grid-cols-6 md:grid-cols-3 lg:grid-cols-7 auto-rows-min gap-2 px-2 text-black w-full">
          <SingleResult stat={lastTest.language} statName="Language" />
          <SingleResult stat={lastTest.timeElapsed} statName="Time" />
          <div className="hidden lg:block">
            <SingleResult stat={lastTest.testType} statName="Type" />
          </div>
          <SingleResult stat={Math.round(wpm)} statName="WPM" />
          <SingleResult
            stat={
              accuracy < 0.7 ? 'Too low' : `${(accuracy * 100).toFixed(0)}%`
            }
            statName="Accuracy"
          />
          <SingleResult stat={incorrectKeys} statName="Errors" />
          <SingleResult stat={Math.round(raw)} statName="Raw" />
          <div className="col-span-6 md:col-span-2 lg:col-span-5 w-full h-96 bg-[#3a3f45] p-4">
            <LineChart />
          </div>
          <div className="hidden md:block lg:col-span-2 h-96 row-span-2 bg-[#3a3f45] ">
            <KeysPieChart />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
