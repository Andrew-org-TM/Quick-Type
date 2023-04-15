import React from 'react';
import { useAppSelector } from '../store/hooks';
import {
  selectCurrentScores,
  Stat,
  ScoreTracker,
} from '../store/slices/StatSlice';
import { ResponsiveLine } from '@nivo/line';

const data = [
  {
    id: 'japan',
    color: 'hsl(222, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 213,
      },
      {
        x: 'helicopter',
        y: 47,
      },
      {
        x: 'boat',
        y: 128,
      },
      {
        x: 'train',
        y: 114,
      },
      {
        x: 'subway',
        y: 206,
      },
      {
        x: 'bus',
        y: 58,
      },
      {
        x: 'car',
        y: 116,
      },
      {
        x: 'moto',
        y: 180,
      },
      {
        x: 'bicycle',
        y: 255,
      },
      {
        x: 'horse',
        y: 1,
      },
      {
        x: 'skateboard',
        y: 80,
      },
      {
        x: 'others',
        y: 249,
      },
    ],
  },
];

const LineChart = () => {
  const score = useAppSelector(selectCurrentScores);
  const lastTestScores: ScoreTracker[] = JSON.parse(
    localStorage.getItem('lineData') || '[{}]'
  );

  const mappedWpm = lastTestScores
    ?.map((s: ScoreTracker) => ({
      x: s.time,
      y: s.wpm,
    }))
    .filter((s, idx) => s.x !== 0);
  const mappedRaw = lastTestScores
    ?.map((s: ScoreTracker) => ({
      x: s.time,
      y: s.raw,
    }))
    .filter((s) => s.x !== 0);

  const min = Math.min(...lastTestScores.slice(1).map((s) => s.wpm));

  const wpmData = { id: 'wpm', color: '#fff', data: mappedWpm };
  const rawData = { id: 'raw', color: '#fff', data: mappedRaw };

  console.log('raw', rawData);

  const data = [wpmData, rawData];

  return (
    <div className="h-96 w-full">
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
            },
          },
        }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'linear' }}
        yScale={{
          type: 'linear',
          min: Math.max(min - 20, 0),
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
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
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'set3' }}
        pointSize={5}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
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
    </div>
  );
};

export default LineChart;
