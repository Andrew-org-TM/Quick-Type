import React from 'react';

interface ResultProps {
  stat: number | string;
  statName: string;
}

const SingleResult = (props: ResultProps) => {
  return (
    <div className="col-span-2 flex h-24 flex-col items-center justify-center gap-2 bg-[#3a3f45] text-center transition-all duration-75 ease-in hover:rounded hover:bg-gray-700 md:col-auto lg:hover:scale-105">
      <h2 className="text-xl font-bold text-gray-300 sm:text-3xl">
        {props.statName}
      </h2>
      <p className="text-lg font-bold text-gray-300 sm:text-2xl">
        {props.stat}
      </p>
    </div>
  );
};

export default SingleResult;
