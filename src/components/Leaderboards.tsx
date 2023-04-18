import React, { useEffect } from 'react';
import supabase from '../supabaseConfig';

// const query = `
// SELECT *, MAX(wpm) as max_wpm
// FROM scores_with_usernames
// GROUP BY usernames
// `;

const Leaderboards = () => {
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

  return <div>Leaderboards</div>;
};

export default Leaderboards;
