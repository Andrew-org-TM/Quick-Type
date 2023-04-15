import React from 'react';

interface ResultProps {
  stat: number | string;
  statName: string;
}

const SingleResult = (props: ResultProps) => {
  return (
    <div className="h-24 bg-[#3a3f45] flex flex-col items-center gap-2 justify-center hover:bg-white  ease-in transition-all text-center">
      <h2 className="font-bold text-3xl">{props.statName}</h2>
      <p className="text-2xl sm:text-4xl font-bold text-[#FFFFB3]">
        {props.stat}
      </p>
    </div>
  );
};

export default SingleResult;
