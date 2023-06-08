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
import NewTestButton from './NewTestButton';

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
    <>
      <section className="flex w-full flex-col items-center px-4 text-gray-300">
        <div className="w-full py-8">
          {/* <h1 className="text-center text-5xl my-6">Test Stats</h1> */}
          <div className="grid w-full auto-rows-min grid-cols-6 gap-2 px-2 text-black md:grid-cols-3 lg:grid-cols-7">
            <SingleResult stat={lastTest.language} statName="Language" />
            <SingleResult stat={lastTest.timeElapsed} statName="Time" />
            <div className="hidden lg:block">
              <SingleResult stat={lastTest.testType} statName="Type" />
            </div>
            <SingleResult stat={Math.round(lastTest.wpm)} statName="WPM" />
            <SingleResult
              stat={
                // accuracy < 0.7 ? 'Too low' : `${(accuracy * 100).toFixed(0)}%`
                `${
                  typeof lastTest.accuracy === 'string'
                    ? lastTest.accuracy
                    : (accuracy * 100).toFixed(0) + '%'
                }`
              }
              statName="Accuracy"
            />
            <SingleResult stat={lastTest.incorrectKeys} statName="Errors" />
            <SingleResult stat={Math.round(lastTest.raw)} statName="Raw" />
            <div className="col-span-6 h-96 w-full bg-[#3a3f45] p-4 md:col-span-2 lg:col-span-5">
              <LineChart />
            </div>
            <div className="row-span-2 hidden h-96 bg-[#3a3f45] md:block lg:col-span-2 ">
              <KeysPieChart />
            </div>
          </div>
        </div>
      </section>
      <NewTestButton />
    </>
  );
};

export default Results;
