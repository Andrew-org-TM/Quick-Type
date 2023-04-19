import React, { useEffect } from 'react';
import supabase from '../supabaseConfig';
import { useNavigate, Link } from 'react-router-dom';

const Leaderboards = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWpmLeaderboards = async () => {
      const { data, error } = await supabase.rpc('max_wpm' as never);
      // .from('scores_with_usernames')
      // .select('*')
      // .not('userId', 'is', null)
      // .order('wpm', { ascending: false })
      // .limit(5);

      if (data && !error) {
        console.log('leaderboards', data);
      }
      console.log('error', error);
    };
    fetchWpmLeaderboards();
  }, []);

  return (
    <div className="mt-24 text-center text-gray-300">
      <h1 className="mb-8 text-3xl">Leaderboards Coming Soon...</h1>
      <h2 className="text-xl">
        <Link to={'/signup'}>
          <span className="text-emerald-600 underline">Sign up</span>{' '}
        </Link>
        for an account to be showcased when released!
      </h2>
    </div>
  );
};

export default Leaderboards;
