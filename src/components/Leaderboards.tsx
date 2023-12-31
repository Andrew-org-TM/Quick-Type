import React, { Key, useCallback, useEffect } from 'react';
import supabase from '../supabaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/AuthSlice';

import { setLeaderboards } from '../store/slices/leaderboardSlice';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react';

type LeaderboardRow = {
  rank: number;
  username: string;
  wpm: number;
  raw: number;
  accuracy: number;
  language: string;
  [key: string]: string | number;
};

const columns = [
  { name: 'Rank', uid: 'id' },
  { name: 'Username', uid: 'username' },
  { name: 'WPM', uid: 'wpm' },
  { name: 'Raw', uid: 'raw' },
  { name: 'Accuracy', uid: 'accuracy' },
  { name: 'Language', uid: 'language' },
];

const Leaderboards = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rows = useAppSelector((state) => state.leaderboard.maxWpm);

  console.log('rows', rows);

  useEffect(() => {
    const fetchWpmLeaderboards = async () => {
      const { data: maxScores, error } = await supabase
        .rpc('max_wpm_by_user' as never)
        .order('wpm', { ascending: false });

      if (maxScores && !error) {
        dispatch(setLeaderboards(maxScores));
      }
      if (error) console.log('error', error);
    };
    fetchWpmLeaderboards();
  }, []);

  const renderCell = useCallback((row: LeaderboardRow, columnKey: Key) => {
    switch (columnKey) {
      default:
        return <p className="text-left text-base">{row[columnKey]}</p>;
    }
  }, []);

  return (
    <div className="mt-12 text-center text-gray-300">
      <h1 className="mb-4 text-left text-3xl">Leaderboards</h1>
      <div>
        <Table
          aria-label="Leaderboards showing top 10 scores"
          classNames={{
            wrapper:
              'bg-backgroundGrey rounded-lg rounded-xl border border-gray-700',
            th: 'bg-gray-700/70 text-base text-white',
            tr: 'hover:bg-gray-700/50  transition-colors first:[&>td]:rounded-l-lg last:[&>td]:rounded-r-lg',
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                {(columnKey) => (
                  <TableCell>{renderCell(row, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboards;
