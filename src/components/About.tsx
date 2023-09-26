import React from 'react';

const About = () => {
  return (
    <div className="px-3 text-center">
      <h1 className="text-3xl font-bold">About Quick Type</h1>
      <p className="my-4 text-xl text-white">
        After doing hundreds of typing tests on other platforms, I decided to
        build my own speed typing site! As a software engineer, I added features
        that would help me communicate and code faster. This was a super fun
        project to build and I look forward to adding more features in the
        future.
      </p>
      <h2 className="text-2xl font-semibold">WPM Calculation Formula:</h2>
      <p className="text-white">{`(Total characters typed - characters in incorrectly spelled words) / 5`}</p>
      <p className="my-3 text-white">{`Total characters typed in correctly spelled words / 5`}</p>
      <p className="text-white">
        Only words spelled 100% correctly will count towards WPM
      </p>
      <div className="mt-12">
        <small>
          Icons from <a href="https://twemoji.twitter.com/">Twemoji</a> &{` `}
          <a href="icons8.com">Icons8</a>
        </small>
      </div>
    </div>
  );
};

export default About;
