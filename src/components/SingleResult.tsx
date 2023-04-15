import React from 'react';

interface ResultProps {
  stat: number | string;
  statName: string;
}

const SingleResult = (props: ResultProps) => {
  return (
    <div className="h-24 bg-[#3a3f45] hover:bg-gray-700 lg:hover:scale-105 col-span-2 md:col-auto hover:rounded flex flex-col items-center gap-2 justify-center ease-in transition-all duration-75 text-center">
      <h2 className="font-bold text-xl sm:text-3xl text-[#3E92CC]">
        {props.statName}
      </h2>
      <p className="text-lg sm:text-2xl  font-bold text-gray-200">
        {props.stat}
      </p>
    </div>
  );
};

export default SingleResult;
