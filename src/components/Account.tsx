import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  DatabaseScores,
  selectAuthUser,
  setScores,
} from '../store/slices/AuthSlice';
import supabase from '../supabaseConfig';
import { User } from '@supabase/supabase-js';
import {
  DataGrid,
  GridRowProps,
  GridColDef,
  GridCellParams,
  GridTreeNode,
} from '@mui/x-data-grid';
import { makeStyles } from '@mui/material';
import { useNavigate } from 'react-router-dom';

let rows: any = [];
let columns: GridColDef[] = [
  //   { field: 'id' },
  { field: 'wpm', headerName: 'Wpm', flex: 1 },
  { field: 'raw', headerName: 'Raw', flex: 1 },
  { field: 'accuracy', headerName: 'Accuracy', flex: 1 },
  { field: 'incorrectKeys', headerName: 'Errors', flex: 1 },
  { field: 'language', headerName: 'language', flex: 1 },
  { field: 'created_at', flex: 1, width: 150, headerName: 'Date' },
];

const Account = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user: User = useAppSelector(selectAuthUser);
  const rows = useAppSelector((state) => state.auth.pastScores);

  const handleRowClick = (
    e: GridCellParams<any, unknown, unknown, GridTreeNode>
  ): void => {
    const row = rows.find((row) => row.id === e.id);

    console.log('row', row);
    localStorage.setItem(
      'lastTest',
      JSON.stringify({
        timeElapsed: row?.timeElapsed,
        totalKeysPressed: row?.totalKeysPressed,
        incorrectKeys: row?.incorrectKeys,
        wpm: row?.wpm,
        raw: row?.raw,
        accuracy: row?.accuracy,
        language: row?.language,
        testType: row?.testType,
        endingCorrect: row?.endingCorrect,
        endingSkipped: row?.endingSkipped,
        endingExtra: row?.endingExtra,
        endingIncorrect: row?.endingIncorrect,
      })
    );
    navigate('/results');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select()
        .eq('userId', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        dispatch(setScores(data));
      } else {
        console.log('Error fetching scores:', error);
      }
    };

    if (user.id) {
      fetchUserData();
    } else {
      navigate('/');
    }
  }, [user]);

  return (
    <>
      <div className="flex gap-4 pt-8">
        <div style={{ height: '75vh', width: '50%' }} className="text-gray-300">
          <h2 className="text-center text-3xl">Previous Tests</h2>
          <DataGrid
            rows={rows}
            columns={columns}
            onCellClick={(e) => handleRowClick(e)}
            sx={{
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                '& .MuiDataGrid-row': {
                  '&:nth-child(2n)': { backgroundColor: '#0f172a' },
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
              '& .MuiDataGrid-cell:hover': {
                color: 'green',
                cursor: 'pointer',
              },
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
        <div className="w-1/2">
          <div className="{/*bg-[#3a3f45]*/} flex h-96 w-full flex-col items-center gap-1 text-center text-gray-300">
            <h2 className="text-3xl text-emerald-600 underline">
              Hello, {user?.user_metadata?.username}
            </h2>
            <p className="text-sm text-gray-300">
              Member Since {user?.created_at?.slice(0, 10)}
            </p>
            <p className="">Tests Taken: {rows.length}</p>
            <button
              className="flex items-center rounded bg-emerald-600 px-4 py-1 font-bold"
              onClick={() => {
                supabase.auth.signOut();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
