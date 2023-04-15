import React from 'react';
import { useAppSelector } from '../store/hooks';
import {
  selectCurrentScores,
  Stat,
  ScoreTracker,
} from '../store/slices/StatSlice';
import { ResponsiveLine } from '@nivo/line';

const LineChart = () => {
  const lastTestScores: ScoreTracker[] = JSON.parse(
    localStorage.getItem('lineData') || '[{}]'
  );

  console.log(window.innerWidth);

  const mappedWpm = lastTestScores?.map((s: ScoreTracker) => ({
    x: s.time,
    y: s.wpm,
  }));

  const mappedRaw = lastTestScores?.map((s: ScoreTracker) => ({
    x: s.time,
    y: s.raw,
  }));
  mappedRaw[0] = { ...mappedRaw[1], x: 0 };
  mappedRaw[mappedRaw.length - 1] = {
    ...mappedRaw[mappedRaw.length - 2],
    x: mappedWpm[mappedWpm.length - 1].x,
  };
  mappedWpm[0] = { ...mappedWpm[1], x: 0 };

  const min = Math.min(...lastTestScores.slice(0).map((s) => s.wpm));

  const wpmData = { id: 'wpm', color: '#fff', data: mappedWpm };
  const rawData = { id: 'raw', color: '#fff', data: mappedRaw };

  const data = [wpmData, rawData];

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: '#fff',
            },
          },
          legend: {
            text: {
              fill: '#fff',
              fontSize: 20,
            },
          },
          ticks: {
            line: {
              stroke: 'transparent',
            },
            text: {
              fill: '#fff',
            },
          },
        },
        legends: {
          text: {
            fill: '#fff',
            fontSize: 16,
          },
        },
        tooltip: {
          container: {
            color: '#0f0f0f',
          },
        },
        grid: {
          line: {
            stroke: '#5e5e5e',
            width: 1,
          },
        },
      }}
      margin={{ top: 50, right: 80, bottom: 50, left: 60 }}
      enableGridX={false}
      enableGridY={false}
      xScale={{ type: 'linear' }}
      yScale={{
        type: 'linear',
        min: Math.max(min - 20, 0),
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 30,
        legend: 'Seconds',
        legendOffset: 40,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Words Per Minute',
        legendOffset: -45,
        legendPosition: 'middle',
      }}
      colors={['#1c7ed6', 'hsl(105, 0%, 40%)']}
      pointSize={5}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices={'x'}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 10,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 20,
          symbolShape: 'square',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
