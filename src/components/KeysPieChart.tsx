import React from 'react';
import { useAppSelector } from '../store/hooks';
import { KeyPresses, Stat, selectLastTest } from '../store/slices/StatSlice';
import { ResponsivePie } from '@nivo/pie';

const KeysPieChart = () => {
  const keys: KeyPresses = JSON.parse(
    localStorage.getItem('keyPresses') || '{}'
  );

  console.log(window.innerWidth);

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
    <ResponsivePie
      data={data}
      margin={{ top: 19, right: 50, bottom: 19, left: 10 }}
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
      colors={['#568259', '#9e2a2b', '#81ADC8', '#335c67']}
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
      enableArcLinkLabels={false}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'row',
          justify: false,
          translateX: 40,
          translateY: 0,
          itemsSpacing: 70,
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
  );
};

export default KeysPieChart;
