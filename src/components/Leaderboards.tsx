import React, { useEffect } from 'react';
import supabase from '../supabaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/AuthSlice';
import {
  DataGrid,
  GridRowProps,
  GridColDef,
  GridCellParams,
  GridTreeNode,
} from '@mui/x-data-grid';
import { makeStyles } from '@mui/material';
import { setLeaderboards } from '../store/slices/leaderboardSlice';

let columns: GridColDef[] = [
  // { field: 'id' },
  { field: 'id', headerName: 'Rank', flex: 1 },
  { field: 'username', headerName: 'Username', flex: 1 },
  { field: 'wpm', headerName: 'Wpm', flex: 1 },
  { field: 'raw', headerName: 'Raw', flex: 1 },
  { field: 'accuracy', headerName: 'Accuracy', flex: 1 },
  { field: 'language', headerName: 'Language', flex: 1 },
  // { field: 'timeelapsed', headerName: 'Time Elapsed', flex: 1 },
  // { field: 'created_at', flex: 1, width: 150, headerName: 'Date' },
];

const Leaderboards = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const rows = useAppSelector((state) => state.leaderboard.maxWpm);

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

  return (
    <div className="mt-12 text-center text-gray-300">
      <h1 className="mb-4 text-5xl">Leaderboards</h1>
      <h2 className="mb-4 text-2xl">Highest WPM</h2>
      <div className="h-[75vh]">
        <DataGrid
          rows={rows}
          columns={columns}
          // onCellClick={(e) => handleRowClick(e)}
          sx={{
            '& .MuiDataGrid-virtualScrollerRenderZone': {
              '& .MuiDataGrid-row': {
                '&:nth-of-type(2n)': { backgroundColor: '#0f172a' },
                border: 'none',
                //   '&:nth-child(odd)': { backgroundColor: '#1e293b' },
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#3b403c',
              },
            },

            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#059669',
              color: '#d1d5db',
              fontSize: 20,
              fontWeight: 'bold',
              border: '1px solid white',
              borderRadius: '8px 8px 0 0',
            },
            //   boxShadow: 2,
            border: 0,
            //   fontSize: 16,
            //   borderColor: 'primary.light',
            // '& .MuiDataGrid-cell:hover': {
            //   color: 'green',
            //   cursor: 'pointer',
            // },
            color: 'white',
            '& .MuiDataGrid-root': {
              border: '1px solid white',
            },
            '& .MuiDataGrid-cell': {
              borderLeft: '1px solid white',
              borderBottom: '1px solid #404040',
              borderCollapse: 'collapse',
            },
            '& .name-column--cell': {
              color: 'blue',
            },

            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#0f0f0f',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              border: '1px solid white',
              backgroundColor: '#d1d5db',
              borderRadius: '0 0 8px 8px',
            },
            scrollbarColor: 'red',
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
              width: '0.4em',
            },
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
            },
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Leaderboards;
