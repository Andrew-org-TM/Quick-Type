import React from 'react';
import { useAppSelector } from '../store/hooks';
import { KeyPresses, Stat, selectLastTest } from '../store/slices/StatSlice';
import { ResponsivePie } from '@nivo/pie';

const KeysPieChart = () => {
  const keys: KeyPresses = JSON.parse(
    localStorage.getItem('keyPresses') || '{}'
  );

  const data = [
    {
      id: 'Correct',
      label: 'Correct',
      value: keys.correct,
    },
    {
      id: 'Incorrect',
      label: 'Incorrect',
      value: keys.incorrect,
    },
    {
      id: 'Extra',
      label: 'Extra',
      value: keys.extra,
    },
    {
      id: 'Skipped',
      label: 'Skipped',
      value: keys.skipped,
    },
  ];

  return (
    <div className="h-96">
      <div className="h-full w-1/2">
        <ResponsivePie
          data={data}
          margin={{ top: 19, right: 50, bottom: 19, left: 0 }}
          valueFormat=" >-"
          theme={{
            grid: {
              line: {
                stroke: '#fff',
              },
            },
            labels: {
              text: {
                fill: '#fff',
              },
            },
            tooltip: {
              container: {
                color: '#0f0f0f',
              },
            },
            legends: {
              text: {
                fill: '#fff',
                color: '#fff',
              },
            },
            annotations: {
              text: {
                fill: '#fff',
              },
            },
          }}
          innerRadius={0.5}
          activeOuterRadiusOffset={8}
          // colors={['#4c934c', '#cd4631', '#81ADC8', '#f7cb15']}
          colors={['#315c2b', '#9e2a2b', '#81ADC8', '#335c67']}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#fff"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: -60,
              translateY: 0,
              itemsSpacing: 7,
              itemWidth: 10,
              itemHeight: 18,
              itemTextColor: '#f0f0f0',
              itemDirection: 'right-to-left',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'square',
              symbolSpacing: 7,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#fff',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default KeysPieChart;
